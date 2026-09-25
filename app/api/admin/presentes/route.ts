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
} from "firebase-admin/firestore";


function obterFirebaseAdmin() {

  if (
    getApps().length > 0
  ) {

    return getApps()[0];
  }


  const caminhoDaChave =
    path.join(
      process.cwd(),
      "firebase-service-account.json"
    );


  const serviceAccount =
    JSON.parse(
      readFileSync(
        caminhoDaChave,
        "utf-8"
      )
    );


  return initializeApp({
    credential:
      cert(serviceAccount),
  });
}


const firebaseAdmin =
  obterFirebaseAdmin();


const adminAuth =
  getAuth(
    firebaseAdmin
  );


const adminDb =
  getFirestore(
    firebaseAdmin
  );


const nomesPresentes:
  Record<string, string> = {

  "1":
    "Afiador de Facas",

  "2":
    "Kit de Formas e Assadeiras",

  "3":
    "Jogo de Bowls Inox - 5 Peças",

  "4":
    "Batedor Manual / Fouet",

  "5":
    "Centrífuga de Salada",

  "6":
    "Coador de Café Inox",
};


export async function GET(
  request: Request
) {

  try {

    /*
     * Verifica o token enviado
     * pelo painel administrativo.
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
          erro:
            "NAO_AUTENTICADO",
        },
        {
          status: 401,
        }
      );
    }


    /*
     * Remove "Bearer " e verifica
     * o token no Firebase.
     */

    const token =
      autorizacao.substring(7);


    const usuario =
      await adminAuth.verifyIdToken(
        token
      );


    /*
     * Confere se o UID pertence
     * ao administrador.
     */

    const adminUid =
      process.env.ADMIN_UID;


    if (!adminUid) {

      console.error(
        "ADMIN_UID não configurado."
      );


      return NextResponse.json(
        {
          erro:
            "ADMIN_NAO_CONFIGURADO",
        },
        {
          status: 500,
        }
      );
    }


    if (
      usuario.uid !== adminUid
    ) {

      return NextResponse.json(
        {
          erro:
            "ACESSO_NEGADO",
        },
        {
          status: 403,
        }
      );
    }


    /*
     * Busca todos os presentes.
     */

    const presentesSnapshot =
      await adminDb
        .collection(
          "presentes"
        )
        .get();


    /*
     * Busca todas as reservas.
     */

    const reservasSnapshot =
      await adminDb
        .collection(
          "reservas"
        )
        .get();


    /*
     * Busca todos os convidados.
     */

    const convidadosSnapshot =
      await adminDb
        .collection(
          "convidados"
        )
        .get();


    /*
     * Criamos um mapa dos convidados.
     *
     * A chave será o UID.
     *
     * Exemplo:
     *
     * UID 123 -> Maria Silva
     * UID 456 -> João Souza
     */

    const nomesPorUid:
      Record<string, string> = {};


    convidadosSnapshot.docs.forEach(
      (documento) => {

        const dados =
          documento.data();


        if (
          dados.uid
        ) {

          nomesPorUid[
            dados.uid
          ] =
            dados.nome ||
            "Convidado";
        }
      }
    );


    /*
     * Criamos um mapa das reservas.
     */

    const reservasPorPresente:
      Record<string, any> = {};


    reservasSnapshot.docs.forEach(
      (documento) => {

        const dados =
          documento.data();


        const uid =
          dados.uid || "";


        reservasPorPresente[
          documento.id
        ] = {

          presenteId:
            dados.presenteId ||
            documento.id,

          uid:
            uid,

          nomeConvidado:
            nomesPorUid[uid] ||
            "Convidado",

          /*
           * DIAGNÓSTICO
           *
           * true =
           * encontramos esse UID
           * na coleção convidados.
           *
           * false =
           * não encontramos.
           */

          uidEncontrado:
            Boolean(
              nomesPorUid[uid]
            ),

          linkCompra:
            dados.linkCompra || "",

          reservadoEm:
            dados.reservadoEm
              ? dados.reservadoEm
                  .toDate()
                  .toISOString()
              : null,
        };
      }
    );


    /*
     * Montamos a resposta final.
     */

    const presentes =
      presentesSnapshot.docs.map(
        (documento) => {

          const dados =
            documento.data();


          const reserva =
            reservasPorPresente[
              documento.id
            ];


          return {

            id:
              documento.id,

            nome:
              nomesPresentes[
                documento.id
              ] ||
              `Presente ${documento.id}`,

            reservado:
              dados.reservado === true,

            reserva:
              reserva || null,
          };
        }
      );


    return NextResponse.json({

      presentes,

      total:
        presentes.length,

      reservados:
        presentes.filter(
          (presente) =>
            presente.reservado
        ).length,

      disponiveis:
        presentes.filter(
          (presente) =>
            !presente.reservado
        ).length,

    });

  } catch (erro) {

    console.error(
      "Erro ao buscar presentes:",
      erro
    );


    return NextResponse.json(
      {
        erro:
          "ERRO_AO_BUSCAR_PRESENTES",
      },
      {
        status: 500,
      }
    );
  }
}