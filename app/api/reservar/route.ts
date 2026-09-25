import { NextResponse } from "next/server";

import {
  cert,
  getApps,
  initializeApp,
} from "firebase-admin/app";

import { getAuth } from "firebase-admin/auth";

import {
  getFirestore,
  FieldValue,
} from "firebase-admin/firestore";

export const dynamic = "force-dynamic";

/*
 * ============================================================
 * INICIALIZAÇÃO DO FIREBASE ADMIN
 * ============================================================
 */

function obterFirebaseAdmin() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const projectId =
    process.env.FIREBASE_PROJECT_ID;

  const clientEmail =
    process.env.FIREBASE_CLIENT_EMAIL;

  const privateKey =
    process.env.FIREBASE_PRIVATE_KEY;

  if (
    !projectId ||
    !clientEmail ||
    !privateKey
  ) {
    throw new Error(
      "Variáveis do Firebase Admin não configuradas."
    );
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey:
        privateKey.replace(
          /\\n/g,
          "\n"
        ),
    }),
  });
}

/*
 * ============================================================
 * TESTE DA API
 * ============================================================
 */

export async function GET() {
  return NextResponse.json({
    ok: true,
    mensagem:
      "Servidor de reserva funcionando.",
  });
}

/*
 * ============================================================
 * RESERVAR PRESENTE
 * ============================================================
 */

export async function POST(
  request: Request
) {
  try {
    /*
     * ========================================================
     * INICIALIZAR FIREBASE
     * ========================================================
     *
     * O Firebase Admin só é inicializado quando
     * a API realmente recebe uma requisição.
     */

    const firebaseAdmin =
      obterFirebaseAdmin();

    const adminAuth =
      getAuth(firebaseAdmin);

    const adminDb =
      getFirestore(firebaseAdmin);

    /*
     * ========================================================
     * VERIFICAR AUTENTICAÇÃO
     * ========================================================
     */

    const autorizacao =
      request.headers.get(
        "authorization"
      );

    if (!autorizacao) {
      return NextResponse.json(
        {
          erro:
            "NAO_AUTORIZADO",
        },
        {
          status: 401,
        }
      );
    }

    if (
      !autorizacao.startsWith(
        "Bearer "
      )
    ) {
      return NextResponse.json(
        {
          erro:
            "TOKEN_INVALIDO",
        },
        {
          status: 401,
        }
      );
    }

    /*
     * ========================================================
     * EXTRAIR TOKEN
     * ========================================================
     */

    const token =
      autorizacao.substring(7);

    /*
     * ========================================================
     * VERIFICAR TOKEN NO FIREBASE
     * ========================================================
     */

    const tokenVerificado =
      await adminAuth.verifyIdToken(
        token
      );

    const uid =
      tokenVerificado.uid;

    /*
     * ========================================================
     * RECEBER DADOS
     * ========================================================
     */

    const corpo =
      await request.json();

    const presenteId =
      String(
        corpo.presenteId
      );

    const acessarReserva =
      corpo.acessarReserva === true;

    /*
     * ========================================================
     * VALIDAR ID DO PRESENTE
     * ========================================================
     */

    if (
      !presenteId ||
      presenteId === "undefined" ||
      presenteId === "null"
    ) {
      return NextResponse.json(
        {
          erro:
            "PRESENTE_NAO_EXISTE",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * ========================================================
     * REFERÊNCIAS DO FIRESTORE
     * ========================================================
     */

    const presenteRef =
      adminDb
        .collection("presentes")
        .doc(presenteId);

    const reservaRef =
      adminDb
        .collection("reservas")
        .doc(presenteId);

    /*
     * ========================================================
     * BUSCAR O PRESENTE
     * ========================================================
     *
     * O link de compra vem diretamente do Firestore.
     */

    const presenteSnapshot =
      await presenteRef.get();

    if (
      !presenteSnapshot.exists
    ) {
      return NextResponse.json(
        {
          erro:
            "PRESENTE_NAO_EXISTE",
        },
        {
          status: 404,
        }
      );
    }

    const presente =
      presenteSnapshot.data();

    const linkCompra =
      presente?.linkCompra;

    /*
     * ========================================================
     * VERIFICAR LINK DE COMPRA
     * ========================================================
     */

    if (
      typeof linkCompra !==
        "string" ||
      !linkCompra.trim()
    ) {
      return NextResponse.json(
        {
          erro:
            "LINK_COMPRA_NAO_ENCONTRADO",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * ========================================================
     * ACESSAR UMA RESERVA EXISTENTE
     * ========================================================
     *
     * Se o usuário já reservou esse presente,
     * permitimos que ele acesse novamente
     * o próprio link de compra.
     */

    if (
      acessarReserva
    ) {
      const reservaSnapshot =
        await reservaRef.get();

      if (
        !reservaSnapshot.exists
      ) {
        return NextResponse.json(
          {
            erro:
              "RESERVA_NAO_ENCONTRADA",
          },
          {
            status: 404,
          }
        );
      }

      const reserva =
        reservaSnapshot.data();

      /*
       * Só liberamos o link se a reserva
       * realmente pertencer ao usuário atual.
       */

      if (
        reserva?.uid !== uid
      ) {
        return NextResponse.json(
          {
            erro:
              "RESERVA_NAO_PERTENCE_AO_USUARIO",
          },
          {
            status: 403,
          }
        );
      }

      return NextResponse.json({
        sucesso: true,
        presenteId,
        linkCompra,
      });
    }

    /*
     * ========================================================
     * NOVA RESERVA
     * ========================================================
     */

    await adminDb.runTransaction(
      async (transaction) => {
        /*
         * Buscar novamente o presente
         * dentro da transação.
         */

        const presenteSnapshot =
          await transaction.get(
            presenteRef
          );

        if (
          !presenteSnapshot.exists
        ) {
          throw new Error(
            "PRESENTE_NAO_EXISTE"
          );
        }

        const presente =
          presenteSnapshot.data();

        /*
         * Verifica dentro da transação
         * se o presente já foi reservado.
         *
         * Isso evita que duas pessoas
         * reservem o mesmo presente
         * simultaneamente.
         */

        if (
          presente?.reservado === true
        ) {
          throw new Error(
            "PRESENTE_JA_RESERVADO"
          );
        }

        /*
         * Marca o presente como reservado.
         */

        transaction.update(
          presenteRef,
          {
            reservado: true,
          }
        );

        /*
         * Cria a reserva vinculada
         * ao usuário.
         */

        transaction.set(
          reservaRef,
          {
            uid,

            presenteId,

            linkCompra,

            reservadoEm:
              FieldValue.serverTimestamp(),
          }
        );
      }
    );

    /*
     * ========================================================
     * RESERVA CONCLUÍDA
     * ========================================================
     */

    return NextResponse.json({
      sucesso: true,
      presenteId,
      linkCompra,
    });

  } catch (erro) {
    console.error(
      "Erro ao reservar presente:",
      erro
    );

    /*
     * ========================================================
     * PRESENTE JÁ RESERVADO
     * ========================================================
     */

    if (
      erro instanceof Error &&
      erro.message ===
        "PRESENTE_JA_RESERVADO"
    ) {
      return NextResponse.json(
        {
          erro:
            "PRESENTE_JA_RESERVADO",
        },
        {
          status: 409,
        }
      );
    }

    /*
     * ========================================================
     * PRESENTE NÃO EXISTE
     * ========================================================
     */

    if (
      erro instanceof Error &&
      erro.message ===
        "PRESENTE_NAO_EXISTE"
    ) {
      return NextResponse.json(
        {
          erro:
            "PRESENTE_NAO_EXISTE",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * ========================================================
     * LINK NÃO ENCONTRADO
     * ========================================================
     */

    if (
      erro instanceof Error &&
      erro.message ===
        "LINK_COMPRA_NAO_ENCONTRADO"
    ) {
      return NextResponse.json(
        {
          erro:
            "LINK_COMPRA_NAO_ENCONTRADO",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * ========================================================
     * ERRO GENÉRICO
     * ========================================================
     */

    return NextResponse.json(
      {
        erro:
          "ERRO_AO_RESERVAR",
      },
      {
        status: 500,
      }
    );
  }
}