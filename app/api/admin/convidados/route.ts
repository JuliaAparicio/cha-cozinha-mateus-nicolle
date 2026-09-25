import { NextResponse } from "next/server";

import {
  cert,
  getApps,
  initializeApp,
} from "firebase-admin/app";

import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

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

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Variáveis do Firebase Admin não configuradas."
    );
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, "\n"),
    }),
  });
}

/*
 * ============================================================
 * BUSCAR CONVIDADOS
 * ============================================================
 */

export async function GET(request: Request) {
  try {
    /*
     * Inicializamos o Firebase somente quando
     * a API realmente for chamada.
     */
    const firebaseAdmin = obterFirebaseAdmin();

    const adminAuth = getAuth(firebaseAdmin);
    const adminDb = getFirestore(firebaseAdmin);

    /*
     * Pegamos o token enviado pelo navegador.
     */
    const autorizacao = request.headers.get(
      "authorization"
    );

    if (
      !autorizacao ||
      !autorizacao.startsWith("Bearer ")
    ) {
      return NextResponse.json(
        {
          erro: "NAO_AUTENTICADO",
        },
        {
          status: 401,
        }
      );
    }

    /*
     * Extraímos o token.
     */
    const token = autorizacao.substring(7);

    /*
     * O Firebase Admin verifica se o token é válido.
     */
    const usuario = await adminAuth.verifyIdToken(token);

    /*
     * Recuperamos o UID do administrador.
     */
    const adminUid = process.env.ADMIN_UID;

    if (!adminUid) {
      console.error(
        "ADMIN_UID não configurado."
      );

      return NextResponse.json(
        {
          erro: "ADMIN_NAO_CONFIGURADO",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * Verificamos se quem está fazendo
     * a requisição é o administrador.
     */
    if (usuario.uid !== adminUid) {
      return NextResponse.json(
        {
          erro: "ACESSO_NEGADO",
        },
        {
          status: 403,
        }
      );
    }

    /*
     * Buscamos os convidados no Firestore.
     */
    const snapshot = await adminDb
      .collection("convidados")
      .get();

    /*
     * Transformamos os documentos em objetos simples.
     */
    const convidados = snapshot.docs.map(
      (documento) => {
        const dados = documento.data();

        return {
          id: documento.id,

          nome: dados.nome || "",

          quantidade:
            dados.quantidade || 0,

          acompanhantes:
            Array.isArray(
              dados.acompanhantes
            )
              ? dados.acompanhantes
              : [],

          uid: dados.uid || "",

          criadoEm: dados.criadoEm
            ? dados.criadoEm
                .toDate()
                .toISOString()
            : null,
        };
      }
    );

    /*
     * Retornamos os convidados.
     */
    return NextResponse.json({
      convidados,
    });

  } catch (erro) {
    console.error(
      "Erro ao buscar convidados:",
      erro
    );

    return NextResponse.json(
      {
        erro: "ERRO_AO_BUSCAR_CONVIDADOS",
      },
      {
        status: 500,
      }
    );
  }
}