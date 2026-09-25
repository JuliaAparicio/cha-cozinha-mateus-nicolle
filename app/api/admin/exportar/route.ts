import { NextResponse } from "next/server";

import {
  cert,
  getApps,
  initializeApp,
} from "firebase-admin/app";

import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

import ExcelJS from "exceljs";

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
 * NOMES DOS PRESENTES
 * ============================================================
 */

const nomesPresentes: Record<string, string> = {
  "1": "Afiador de Facas",
  "2": "Kit de Formas e Assadeiras",
  "3": "Jogo de Bowls Inox - 5 Peças",
  "4": "Batedor Manual / Fouet",
  "5": "Centrífuga de Salada",
  "6": "Coador de Café Inox",
};

/*
 * ============================================================
 * EXPORTAR DADOS
 * ============================================================
 */

export async function GET(request: Request) {
  try {
    /*
     * ========================================================
     * INICIALIZAR FIREBASE
     * ========================================================
     *
     * O Firebase Admin é inicializado somente quando
     * a rota realmente recebe uma requisição.
     */

    const firebaseAdmin = obterFirebaseAdmin();

    const adminAuth = getAuth(firebaseAdmin);
    const adminDb = getFirestore(firebaseAdmin);

    /*
     * ========================================================
     * VERIFICAÇÃO DO TOKEN
     * ========================================================
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

    const usuario = await adminAuth.verifyIdToken(
      token
    );

    /*
     * ========================================================
     * VERIFICAÇÃO DO ADMINISTRADOR
     * ========================================================
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
     * Verificamos se quem está fazendo a requisição
     * é o administrador.
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
     * ========================================================
     * BUSCAR CONVIDADOS
     * ========================================================
     */

    const convidadosSnapshot = await adminDb
      .collection("convidados")
      .get();

    /*
     * ========================================================
     * BUSCAR PRESENTES
     * ========================================================
     */

    const presentesSnapshot = await adminDb
      .collection("presentes")
      .get();

    /*
     * ========================================================
     * BUSCAR RESERVAS
     * ========================================================
     */

    const reservasSnapshot = await adminDb
      .collection("reservas")
      .get();

    /*
     * ========================================================
     * MAPA DOS CONVIDADOS
     * ========================================================
     */

    const nomesPorUid: Record<string, string> = {};

    convidadosSnapshot.docs.forEach(
      (documento) => {
        const dados = documento.data();

        if (dados.uid) {
          nomesPorUid[dados.uid] =
            dados.nome || "Convidado";
        }
      }
    );

    /*
     * ========================================================
     * MAPA DAS RESERVAS
     * ========================================================
     */

    const reservasPorPresente: Record<
      string,
      any
    > = {};

    reservasSnapshot.docs.forEach(
      (documento) => {
        const dados = documento.data();

        const uid = dados.uid || "";

        reservasPorPresente[documento.id] = {
          uid,

          nomeConvidado:
            nomesPorUid[uid] ||
            "Convidado",

          reservadoEm:
            dados.reservadoEm
              ? dados.reservadoEm
                  .toDate()
                  .toISOString()
              : null,

          linkCompra:
            dados.linkCompra || "",
        };
      }
    );

    /*
     * ========================================================
     * CRIAR PLANILHA
     * ========================================================
     */

    const workbook =
      new ExcelJS.Workbook();

    workbook.creator =
      "Nicolle & Mateus";

    workbook.created =
      new Date();

    /*
     * ========================================================
     * ABA 1 — CONVIDADOS
     * ========================================================
     */

    const convidadosSheet =
      workbook.addWorksheet(
        "Convidados"
      );

    convidadosSheet.columns = [
      {
        header: "Nome",
        key: "nome",
        width: 32,
      },

      {
        header: "Pessoas",
        key: "quantidade",
        width: 12,
      },

      {
        header: "Acompanhantes",
        key: "acompanhantes",
        width: 50,
      },

      {
        header: "Data da confirmação",
        key: "criadoEm",
        width: 24,
      },
    ];

    convidadosSnapshot.docs.forEach(
      (documento) => {
        const dados =
          documento.data();

        const dataConfirmacao =
          dados.criadoEm
            ? dados.criadoEm
                .toDate()
                .toLocaleString(
                  "pt-BR"
                )
            : "";

        convidadosSheet.addRow({
          nome:
            dados.nome || "",

          quantidade:
            dados.quantidade || 0,

          acompanhantes:
            Array.isArray(
              dados.acompanhantes
            )
              ? dados.acompanhantes.join(
                  ", "
                )
              : "",

          criadoEm:
            dataConfirmacao,
        });
      }
    );

    /*
     * ========================================================
     * ABA 2 — PRESENTES
     * ========================================================
     */

    const presentesSheet =
      workbook.addWorksheet(
        "Presentes"
      );

    presentesSheet.columns = [
      {
        header: "Presente",
        key: "presente",
        width: 40,
      },

      {
        header: "Status",
        key: "status",
        width: 18,
      },

      {
        header: "Escolhido por",
        key: "escolhidoPor",
        width: 32,
      },

      {
        header: "Data da reserva",
        key: "reservadoEm",
        width: 24,
      },

      {
        header: "Link de compra",
        key: "linkCompra",
        width: 70,
      },
    ];

    presentesSnapshot.docs.forEach(
      (documento) => {
        const dados =
          documento.data();

        const reserva =
          reservasPorPresente[
            documento.id
          ];

        const reservado =
          dados.reservado === true;

        presentesSheet.addRow({
          presente:
            nomesPresentes[
              documento.id
            ] ||
            `Presente ${documento.id}`,

          status:
            reservado
              ? "Reservado"
              : "Disponível",

          escolhidoPor:
            reservado &&
            reserva
              ? reserva.nomeConvidado
              : "",

          reservadoEm:
            reservado &&
            reserva
              ? (
                  reserva.reservadoEm
                    ? new Date(
                        reserva.reservadoEm
                      ).toLocaleString(
                        "pt-BR"
                      )
                    : ""
                )
              : "",

          linkCompra:
            reservado &&
            reserva
              ? reserva.linkCompra
              : "",
        });
      }
    );

    /*
     * ========================================================
     * FORMATAÇÃO DOS CABEÇALHOS
     * ========================================================
     */

    const folhas = [
      convidadosSheet,
      presentesSheet,
    ];

    folhas.forEach(
      (folha) => {
        const cabecalho =
          folha.getRow(1);

        cabecalho.font = {
          bold: true,
        };

        cabecalho.alignment = {
          vertical: "middle",
          horizontal: "left",
        };

        cabecalho.height = 24;

        folha.views = [
          {
            state: "frozen",
            ySplit: 1,
          },
        ];
      }
    );

    /*
     * ========================================================
     * GERAR ARQUIVO
     * ========================================================
     */

    const buffer =
      await workbook.xlsx.writeBuffer();

    /*
     * ========================================================
     * RETORNAR EXCEL
     * ========================================================
     */

    return new NextResponse(
      buffer,
      {
        status: 200,

        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

          "Content-Disposition":
            'attachment; filename="cha-de-cozinha-nicolle-mateus.xlsx"',
        },
      }
    );

  } catch (erro) {
    console.error(
      "Erro ao exportar informações:",
      erro
    );

    return NextResponse.json(
      {
        erro: "ERRO_AO_EXPORTAR",
      },
      {
        status: 500,
      }
    );
  }
}