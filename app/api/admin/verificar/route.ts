import { NextResponse } from "next/server";

import {
  getAuth,
} from "firebase-admin/auth";

import {
  getApps,
  cert,
  initializeApp,
} from "firebase-admin/app";

import serviceAccount from "../../../../firebase-service-account.json";


/*
 * ============================================================
 * INICIALIZAÇÃO DO FIREBASE ADMIN
 * ============================================================
 */

const app =
  getApps().length === 0
    ? initializeApp({
        credential: cert(
          serviceAccount as {
            projectId?: string;
            clientEmail?: string;
            privateKey?: string;
          }
        ),
      })
    : getApps()[0];


const adminAuth =
  getAuth(app);


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
     * Pegamos o token enviado pelo navegador.
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
          erro: "NAO_AUTENTICADO",
        },
        {
          status: 401,
        }
      );
    }


    /*
     * Extraímos somente o token.
     */

    const token =
      autorizacao.replace(
        "Bearer ",
        ""
      );


    /*
     * O Firebase verifica se o token
     * realmente pertence a um usuário
     * autenticado.
     */

    const usuario =
      await adminAuth.verifyIdToken(
        token
      );


    /*
     * UID do administrador definido
     * no ambiente do servidor.
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
          erro: "ADMIN_NAO_CONFIGURADO",
        },
        {
          status: 500,
        }
      );
    }


    /*
     * Comparamos o UID da pessoa logada
     * com o UID autorizado.
     */

    if (
      usuario.uid !== adminUid
    ) {

      return NextResponse.json(
        {
          autorizado: false,
          erro: "ACESSO_NEGADO",
        },
        {
          status: 403,
        }
      );
    }


    /*
     * Se chegou até aqui,
     * é o administrador.
     */

    return NextResponse.json(
      {
        autorizado: true,
      }
    );

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