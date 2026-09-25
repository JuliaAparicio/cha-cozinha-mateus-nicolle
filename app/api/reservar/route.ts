import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";

import {
  cert,
  getApps,
  initializeApp,
} from "firebase-admin/app";

import {
  getAuth,
} from "firebase-admin/auth";

import {
  getFirestore,
  FieldValue,
} from "firebase-admin/firestore";


function obterFirebaseAdmin() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const caminhoDaChave = path.join(
    process.cwd(),
    "firebase-service-account.json"
  );

  const serviceAccount = JSON.parse(
    readFileSync(
      caminhoDaChave,
      "utf-8"
    )
  );

  return initializeApp({
    credential: cert(
      serviceAccount
    ),
  });
}


const firebaseAdmin =
  obterFirebaseAdmin();

const adminAuth =
  getAuth(firebaseAdmin);

const adminDb =
  getFirestore(firebaseAdmin);


export async function GET() {
  return NextResponse.json({
    ok: true,
    mensagem:
      "Servidor de reserva funcionando.",
  });
}


export async function POST(
  request: Request
) {

  try {

    /*
     * ============================================================
     * VERIFICAR AUTENTICAÇÃO
     * ============================================================
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


    const token =
      autorizacao.substring(7);


    const tokenVerificado =
      await adminAuth.verifyIdToken(
        token
      );


    const uid =
      tokenVerificado.uid;


    /*
     * ============================================================
     * RECEBER DADOS
     * ============================================================
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
     * ============================================================
     * REFERÊNCIAS DO FIRESTORE
     * ============================================================
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
     * ============================================================
     * BUSCAR O PRESENTE
     * ============================================================
     *
     * Agora o link de compra vem diretamente do Firestore.
     *
     * Isso permite trabalhar com todos os 84 presentes.
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
     * ============================================================
     * VERIFICAR LINK DE COMPRA
     * ============================================================
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
     * ============================================================
     * ACESSAR UMA RESERVA QUE JÁ PERTENCE AO USUÁRIO
     * ============================================================
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
     * ============================================================
     * NOVA RESERVA
     * ============================================================
     */

    await adminDb.runTransaction(
      async (transaction) => {

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
         * Verifica novamente dentro
         * da transação se o presente
         * já foi reservado.
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
     * ============================================================
     * RESERVA CONCLUÍDA
     * ============================================================
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
     * ============================================================
     * PRESENTE JÁ RESERVADO
     * ============================================================
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
     * ============================================================
     * PRESENTE NÃO EXISTE
     * ============================================================
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
     * ============================================================
     * LINK NÃO ENCONTRADO
     * ============================================================
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
     * ============================================================
     * ERRO GENÉRICO
     * ============================================================
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