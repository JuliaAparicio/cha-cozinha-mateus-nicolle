import { NextResponse } from "next/server";

import {
  getAuth,
} from "firebase-admin/auth";

import {
  getApps,
  cert,
  initializeApp,
} from "firebase-admin/app";

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
 * VERIFICAR ADMINISTRADOR
 * ============================================================
 */

export async function POST(
  request: Request
) {
  try {
    /*
     * Inicializamos o Firebase somente quando
     * a rota realmente receber uma requisição.
     */

    const firebaseAdmin =
      obterFirebaseAdmin();

    const adminAuth =
      getAuth(firebaseAdmin);

    /*
     * ========================================================
     * PEGAR TOKEN
     * ========================================================
     */

    const autorizacao =
      request.headers.get(
        "authorization"
      );

    if (
      !autorizacao ||
      !autorizacao.startsWith(
        "Bearer "
      )
    ) {
      return NextResponse.json(
        {
          autorizado: false,
          erro:
            "NAO_AUTENTICADO",
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
     * VALIDAR TOKEN NO FIREBASE
     * ========================================================
     */

    const usuario =
      await adminAuth.verifyIdToken(
        token
      );

    /*
     * ========================================================
     * VERIFICAR UID DO ADMINISTRADOR
     * ========================================================
     */

    const adminUid =
      process.env.ADMIN_UID;

    if (!adminUid) {
      console.error(
        "ADMIN_UID não configurado."
      );

      return NextResponse.json(
        {
          autorizado: false,
          erro:
            "ADMIN_NAO_CONFIGURADO",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * ========================================================
     * COMPARAR UID
     * ========================================================
     */

    if (
      usuario.uid !== adminUid
    ) {
      return NextResponse.json(
        {
          autorizado: false,
          erro:
            "ACESSO_NEGADO",
        },
        {
          status: 403,
        }
      );
    }

    /*
     * ========================================================
     * ADMINISTRADOR AUTORIZADO
     * ========================================================
     */

    return NextResponse.json({
      autorizado: true,
    });

  } catch (erro) {
    console.error(
      "Erro ao verificar administrador:",
      erro
    );

    return NextResponse.json(
      {
        autorizado: false,
        erro: "TOKEN_INVALIDO",
      },
      {
        status: 401,
      }
    );
  }
}