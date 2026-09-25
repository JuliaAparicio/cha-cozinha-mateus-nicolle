"use client";

import { useState } from "react";

import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  auth,
} from "../lib/firebase";


type Convidado = {
  id: string;
  nome: string;
  quantidade: number;
  acompanhantes: string[];
  uid: string;
  criadoEm: string | null;
};


type Presente = {
  id: string;
  nome: string;
  reservado: boolean;

  reserva: {
    presenteId: string;
    uid: string;
    nomeConvidado: string;
    linkCompra: string;
    reservadoEm: string | null;
  } | null;
};


type Secao =
  | "painel"
  | "convidados"
  | "presentes";


export default function AdminPage() {

  const [email, setEmail] =
    useState("");

  const [senha, setSenha] =
    useState("");

  const [carregando, setCarregando] =
    useState(false);

  const [erro, setErro] =
    useState("");

  const [autorizado, setAutorizado] =
    useState(false);


  const [secao, setSecao] =
    useState<Secao>("painel");


  const [convidados, setConvidados] =
    useState<Convidado[]>([]);


  const [carregandoConvidados, setCarregandoConvidados] =
    useState(false);


  const [presentes, setPresentes] =
    useState<Presente[]>([]);


  const [carregandoPresentes, setCarregandoPresentes] =
    useState(false);


  const [exportando, setExportando] =
    useState(false);


  async function carregarConvidados(
    token: string
  ) {

    try {

      setCarregandoConvidados(
        true
      );

      const resposta =
        await fetch(
          "/api/admin/convidados",
          {
            method:
              "GET",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const dados =
        await resposta.json();

      if (!resposta.ok) {

        throw new Error(
          dados.erro ||
            "ERRO_AO_BUSCAR_CONVIDADOS"
        );
      }

      setConvidados(
        Array.isArray(
          dados.convidados
        )
          ? dados.convidados
          : []
      );

    } catch (erro) {

      console.error(
        "Erro ao carregar convidados:",
        erro
      );

      throw erro;

    } finally {

      setCarregandoConvidados(
        false
      );
    }
  }


  async function carregarPresentes(
    token: string
  ) {

    try {

      setCarregandoPresentes(
        true
      );

      const resposta =
        await fetch(
          "/api/admin/presentes",
          {
            method:
              "GET",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const dados =
        await resposta.json();

      if (!resposta.ok) {

        throw new Error(
          dados.erro ||
            "ERRO_AO_BUSCAR_PRESENTES"
        );
      }

      setPresentes(
        Array.isArray(
          dados.presentes
        )
          ? dados.presentes
          : []
      );

    } catch (erro) {

      console.error(
        "Erro ao carregar presentes:",
        erro
      );

      throw erro;

    } finally {

      setCarregandoPresentes(
        false
      );
    }
  }


  async function entrar() {

    if (
      carregando
    ) {

      return;
    }

    setErro("");

    if (
      !email.trim()
    ) {

      setErro(
        "Digite seu e-mail."
      );

      return;
    }

    if (
      !senha
    ) {

      setErro(
        "Digite sua senha."
      );

      return;
    }

    try {

      setCarregando(
        true
      );

      const resultado =
        await signInWithEmailAndPassword(
          auth,
          email
            .trim()
            .toLowerCase(),
          senha
        );

      const token =
        await resultado.user.getIdToken();

      const resposta =
        await fetch(
          "/api/admin/verificar",
          {
            method:
              "POST",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const dados =
        await resposta.json();

      if (
        !resposta.ok ||
        dados.autorizado !== true
      ) {

        await signOut(
          auth
        );

        setErro(
          "Esta conta não possui acesso ao painel administrativo."
        );

        return;
      }

      setAutorizado(
        true
      );

      await Promise.all([
        carregarConvidados(
          token
        ),
        carregarPresentes(
          token
        ),
      ]);

    } catch (erro) {

      console.error(
        "Erro no acesso administrativo:",
        erro
      );

      setErro(
        "Não foi possível carregar o painel. Verifique o acesso e tente novamente."
      );

    } finally {

      setCarregando(
        false
      );
    }
  }


  async function sair() {

    await signOut(
      auth
    );

    setAutorizado(
      false
    );

    setEmail("");

    setSenha("");

    setConvidados([]);

    setPresentes([]);

    setSecao(
      "painel"
    );
  }


  async function exportarExcel() {

    if (
      exportando
    ) {

      return;
    }

    try {

      setExportando(
        true
      );

      setErro("");

      const usuario =
        auth.currentUser;

      if (
        !usuario
      ) {

        throw new Error(
          "USUARIO_NAO_AUTENTICADO"
        );
      }

      const token =
        await usuario.getIdToken();

      const resposta =
        await fetch(
          "/api/admin/exportar",
          {
            method:
              "GET",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      if (
        !resposta.ok
      ) {

        let mensagem =
          "Não foi possível exportar os dados.";

        try {

          const dados =
            await resposta.json();

          if (
            dados.erro
          ) {

            mensagem =
              dados.erro;
          }

        } catch {
          // Mantém a mensagem padrão.
        }

        throw new Error(
          mensagem
        );
      }

      const arquivo =
        await resposta.blob();

      const url =
        window.URL.createObjectURL(
          arquivo
        );

      const link =
        document.createElement(
          "a"
        );

      link.href =
        url;

      link.download =
        "cha-de-cozinha-nicolle-mateus.xlsx";

      document.body.appendChild(
        link
      );

      link.click();

      link.remove();

      window.URL.revokeObjectURL(
        url
      );

    } catch (erro) {

      console.error(
        "Erro ao exportar Excel:",
        erro
      );

      alert(
        "Não foi possível exportar os dados agora. Tente novamente."
      );

    } finally {

      setExportando(
        false
      );
    }
  }


  const totalConvidados =
    convidados.length;


  const totalPessoas =
    convidados.reduce(
      (
        total,
        convidado
      ) =>
        total +
        Number(
          convidado.quantidade ||
            0
        ),
      0
    );


  const totalPresentes =
    presentes.length;


  const totalPresentesReservados =
    presentes.filter(
      (presente) =>
        presente.reservado
    ).length;


  const totalPresentesDisponiveis =
    presentes.filter(
      (presente) =>
        !presente.reservado
    ).length;


  if (
    autorizado
  ) {

    return (
      <main className="min-h-screen bg-[#f7f4ef] px-6 py-10 text-[#3f4038]">

        <div className="mx-auto max-w-6xl">

          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

            <div>

              <p className="mb-2 text-xs uppercase tracking-[0.3em] text-[#8b8068]">
                Nicolle & Mateus
              </p>

              <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-medium text-[#3d4038] md:text-5xl">
                Painel administrativo
              </h1>

              <p className="mt-3 text-sm text-[#72736b]">
                Acompanhe as confirmações e os presentes do chá de cozinha.
              </p>

            </div>

            <button
              type="button"
              onClick={
                sair
              }
              className="rounded-full border border-[#b7b5ad] px-6 py-3 text-sm font-medium text-[#55564f] transition hover:bg-white"
            >
              Sair
            </button>

          </div>


          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-3xl border border-[#e9e4da] bg-white p-6 shadow-sm">

              <p className="text-xs uppercase tracking-[0.15em] text-[#99958b]">
                Convidados
              </p>

              <p className="mt-3 font-[family-name:var(--font-playfair)] text-4xl text-[#3d4038]">
                {carregandoConvidados
                  ? "..."
                  : totalConvidados}
              </p>

              <p className="mt-2 text-xs text-[#8b8b83]">
                Confirmações
              </p>

            </div>


            <div className="rounded-3xl border border-[#e9e4da] bg-white p-6 shadow-sm">

              <p className="text-xs uppercase tracking-[0.15em] text-[#99958b]">
                Pessoas
              </p>

              <p className="mt-3 font-[family-name:var(--font-playfair)] text-4xl text-[#3d4038]">
                {carregandoConvidados
                  ? "..."
                  : totalPessoas}
              </p>

              <p className="mt-2 text-xs text-[#8b8b83]">
                Total confirmado
              </p>

            </div>


            <div className="rounded-3xl border border-[#e9e4da] bg-white p-6 shadow-sm">

              <p className="text-xs uppercase tracking-[0.15em] text-[#99958b]">
                Presentes
              </p>

              <p className="mt-3 font-[family-name:var(--font-playfair)] text-4xl text-[#3d4038]">
                {carregandoPresentes
                  ? "..."
                  : totalPresentesReservados}
              </p>

              <p className="mt-2 text-xs text-[#8b8b83]">
                Reservados
              </p>

            </div>


            <div className="rounded-3xl border border-[#e9e4da] bg-white p-6 shadow-sm">

              <p className="text-xs uppercase tracking-[0.15em] text-[#99958b]">
                Disponíveis
              </p>

              <p className="mt-3 font-[family-name:var(--font-playfair)] text-4xl text-[#3d4038]">
                {carregandoPresentes
                  ? "..."
                  : totalPresentesDisponiveis}
              </p>

              <p className="mt-2 text-xs text-[#8b8b83]">
                Presentes restantes
              </p>

            </div>

          </div>


          {secao === "painel" && (

            <>

              <div className="mt-8 grid gap-6 md:grid-cols-2">

                <div className="rounded-3xl border border-[#e9e4da] bg-white p-7 shadow-sm">

                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef1e9] text-xl text-[#536447]">
                    ♡
                  </div>

                  <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#3d4038]">
                    Convidados
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#72736b]">
                    Consulte as pessoas que confirmaram presença e os respectivos acompanhantes.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setSecao(
                        "convidados"
                      )
                    }
                    className="mt-6 rounded-full bg-[#536447] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#435238]"
                  >
                    Ver convidados
                  </button>

                </div>


                <div className="rounded-3xl border border-[#e9e4da] bg-white p-7 shadow-sm">

                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f4eee0] text-xl text-[#a68c50]">
                    ♥
                  </div>

                  <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#3d4038]">
                    Lista de presentes
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#72736b]">
                    Veja quais presentes foram escolhidos e quais ainda estão disponíveis.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setSecao(
                        "presentes"
                      )
                    }
                    className="mt-6 rounded-full border border-[#536447] px-6 py-3 text-sm font-medium text-[#536447] transition hover:bg-[#f4f6f1]"
                  >
                    Ver presentes
                  </button>

                </div>

              </div>


              <div className="mt-6 rounded-3xl border border-[#e9e4da] bg-white p-7 shadow-sm">

                <p className="text-xs uppercase tracking-[0.2em] text-[#a68c50]">
                  Organização
                </p>

                <h2 className="mt-2 font-[family-name:var(--font-playfair)] text-2xl text-[#3d4038]">
                  Exportar informações
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#72736b]">
                  Baixe os convidados e as reservas em uma planilha Excel.
                </p>

                <button
                  type="button"
                  onClick={
                    exportarExcel
                  }
                  disabled={
                    exportando
                  }
                  className="mt-6 rounded-full bg-[#536447] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#435238] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {exportando
                    ? "Gerando Excel..."
                    : "Exportar para Excel"}
                </button>

              </div>

            </>
          )}


          {secao === "convidados" && (

            <div className="mt-8">

              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>

                  <p className="text-xs uppercase tracking-[0.2em] text-[#a68c50]">
                    Dados recebidos
                  </p>

                  <h2 className="mt-2 font-[family-name:var(--font-playfair)] text-3xl text-[#3d4038]">
                    Convidados confirmados
                  </h2>

                  <p className="mt-2 text-sm text-[#72736b]">
                    Lista de pessoas que confirmaram presença no chá de cozinha.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSecao(
                      "painel"
                    )
                  }
                  className="w-fit rounded-full border border-[#b7b5ad] px-6 py-3 text-sm font-medium text-[#55564f] transition hover:bg-white"
                >
                  ← Voltar ao painel
                </button>

              </div>


              <div className="rounded-3xl border border-[#e9e4da] bg-white p-7 shadow-sm">

                <div className="flex items-center justify-between">

                  <p className="text-xs uppercase tracking-[0.2em] text-[#a68c50]">
                    Confirmações
                  </p>

                  <p className="text-xs text-[#8b8b83]">
                    {carregandoConvidados
                      ? "Carregando..."
                      : `${totalConvidados} confirmação(ões)`}
                  </p>

                </div>


                {convidados.length === 0 &&
                  !carregandoConvidados && (

                    <div className="mt-6 rounded-2xl bg-[#f7f4ef] px-5 py-4">

                      <p className="text-sm text-[#72736b]">
                        Nenhuma confirmação encontrada.
                      </p>

                    </div>

                  )}


                {convidados.length > 0 && (

                  <div className="mt-6 overflow-x-auto">

                    <table className="w-full min-w-[700px] text-left">

                      <thead>

                        <tr className="border-b border-[#eeeae2]">

                          <th className="px-3 py-3 text-xs font-medium uppercase tracking-[0.12em] text-[#8b8b83]">
                            Nome
                          </th>

                          <th className="px-3 py-3 text-xs font-medium uppercase tracking-[0.12em] text-[#8b8b83]">
                            Pessoas
                          </th>

                          <th className="px-3 py-3 text-xs font-medium uppercase tracking-[0.12em] text-[#8b8b83]">
                            Acompanhantes
                          </th>

                        </tr>

                      </thead>

                      <tbody>

                        {convidados.map(
                          (convidado) => (

                            <tr
                              key={
                                convidado.id
                              }
                              className="border-b border-[#f0ede7] last:border-0"
                            >

                              <td className="px-3 py-4 text-sm font-medium text-[#3f4038]">
                                {convidado.nome}
                              </td>

                              <td className="px-3 py-4 text-sm text-[#66675f]">
                                {convidado.quantidade}
                              </td>

                              <td className="px-3 py-4 text-sm text-[#66675f]">

                                {convidado.acompanhantes.length > 0
                                  ? convidado.acompanhantes.join(
                                      ", "
                                    )
                                  : "—"}

                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                )}

              </div>

            </div>

          )}


          {secao === "presentes" && (

            <div className="mt-8">

              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>

                  <p className="text-xs uppercase tracking-[0.2em] text-[#a68c50]">
                    Lista de presentes
                  </p>

                  <h2 className="mt-2 font-[family-name:var(--font-playfair)] text-3xl text-[#3d4038]">
                    Situação dos presentes
                  </h2>

                  <p className="mt-2 text-sm text-[#72736b]">
                    Veja quais presentes foram escolhidos e quais ainda estão disponíveis.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSecao(
                      "painel"
                    )
                  }
                  className="w-fit rounded-full border border-[#b7b5ad] px-6 py-3 text-sm font-medium text-[#55564f] transition hover:bg-white"
                >
                  ← Voltar ao painel
                </button>

              </div>


              <div className="rounded-3xl border border-[#e9e4da] bg-white p-7 shadow-sm">

                <div className="flex items-center justify-between">

                  <p className="text-xs uppercase tracking-[0.2em] text-[#a68c50]">
                    Presentes
                  </p>

                  <p className="text-xs text-[#8b8b83]">
                    {carregandoPresentes
                      ? "Carregando..."
                      : `${totalPresentes} presente(s)`}
                  </p>

                </div>


                {presentes.length === 0 &&
                  !carregandoPresentes && (

                    <div className="mt-6 rounded-2xl bg-[#f7f4ef] px-5 py-4">

                      <p className="text-sm text-[#72736b]">
                        Nenhum presente encontrado.
                      </p>

                    </div>

                  )}


                {presentes.length > 0 && (

                  <div className="mt-6 overflow-x-auto">

                    <table className="w-full min-w-[750px] text-left">

                      <thead>

                        <tr className="border-b border-[#eeeae2]">

                          <th className="px-3 py-3 text-xs font-medium uppercase tracking-[0.12em] text-[#8b8b83]">
                            Presente
                          </th>

                          <th className="px-3 py-3 text-xs font-medium uppercase tracking-[0.12em] text-[#8b8b83]">
                            Status
                          </th>

                          <th className="px-3 py-3 text-xs font-medium uppercase tracking-[0.12em] text-[#8b8b83]">
                            Escolhido por
                          </th>

                        </tr>

                      </thead>


                      <tbody>

                        {presentes.map(
                          (presente) => (

                            <tr
                              key={
                                presente.id
                              }
                              className="border-b border-[#f0ede7] last:border-0"
                            >

                              <td className="px-3 py-4 text-sm font-medium text-[#3f4038]">
                                {presente.nome}
                              </td>

                              <td className="px-3 py-4 text-sm">

                                {presente.reservado ? (

                                  <span className="inline-flex rounded-full bg-[#f4eee0] px-3 py-1 text-xs font-medium text-[#8b7341]">
                                    Reservado
                                  </span>

                                ) : (

                                  <span className="inline-flex rounded-full bg-[#eef1e9] px-3 py-1 text-xs font-medium text-[#536447]">
                                    Disponível
                                  </span>

                                )}

                              </td>

                              <td className="px-3 py-4 text-sm text-[#66675f]">

                                {presente.reservado &&
                                presente.reserva
                                  ? presente.reserva.nomeConvidado
                                  : "—"}

                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                )}

              </div>

            </div>

          )}


          <p className="mt-10 text-center text-xs tracking-wide text-[#aaa69c]">
            Nicolle & Mateus · Área administrativa
          </p>

        </div>

      </main>
    );
  }


  return (
    <main className="min-h-screen bg-[#f7f4ef] px-5 py-8 text-[#3f4038] md:px-8 md:py-12">

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col justify-center">

        <div className="mb-8 text-center">

          <p className="mb-3 text-[11px] uppercase tracking-[0.38em] text-[#8b8068]">
            Nicolle & Mateus
          </p>

          <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-medium tracking-tight text-[#3d4038] md:text-5xl">
            Área administrativa
          </h1>

          <div className="mx-auto mt-5 flex items-center justify-center gap-3">

            <span className="h-px w-10 bg-[#c6ad72]" />

            <span className="text-sm text-[#a68c50]">
              ♥
            </span>

            <span className="h-px w-10 bg-[#c6ad72]" />

          </div>

          <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#72736b]">
            Entre com a conta administrativa para acessar o painel.
          </p>

        </div>


        <div className="rounded-[28px] border border-[#e9e4da] bg-white p-7 shadow-[0_15px_45px_rgba(70,65,50,0.08)] md:p-9">

          <div className="space-y-6">

            <div>

              <label
                htmlFor="admin-email"
                className="mb-2.5 block text-sm font-medium text-[#484941]"
              >
                E-mail
              </label>

              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                placeholder="E-mail administrativo"
                autoComplete="email"
                className="w-full rounded-2xl border border-[#ddd9d0] bg-[#fbfaf7] px-4 py-3.5 text-sm text-[#3f4038] outline-none transition placeholder:text-[#aaa79f] focus:border-[#536447] focus:bg-white focus:ring-2 focus:ring-[#536447]/10"
              />

            </div>


            <div>

              <label
                htmlFor="admin-senha"
                className="mb-2.5 block text-sm font-medium text-[#484941]"
              >
                Senha
              </label>

              <input
                id="admin-senha"
                type="password"
                value={senha}
                onChange={(e) =>
                  setSenha(
                    e.target.value
                  )
                }
                placeholder="Sua senha"
                autoComplete="current-password"
                onKeyDown={(e) => {

                  if (
                    e.key === "Enter"
                  ) {

                    entrar();
                  }

                }}
                className="w-full rounded-2xl border border-[#ddd9d0] bg-[#fbfaf7] px-4 py-3.5 text-sm text-[#3f4038] outline-none transition placeholder:text-[#aaa79f] focus:border-[#536447] focus:bg-white focus:ring-2 focus:ring-[#536447]/10"
              />

            </div>


            {erro && (

              <div className="rounded-2xl bg-[#fdf1ef] px-4 py-3.5">

                <p className="text-xs leading-5 text-[#9b5148]">
                  {erro}
                </p>

              </div>

            )}


            <button
              type="button"
              onClick={
                entrar
              }
              disabled={
                carregando
              }
              className="w-full rounded-full bg-[#536447] px-6 py-3.5 text-sm font-medium text-white shadow-sm transition duration-200 hover:bg-[#435238] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {carregando
                ? "Verificando..."
                : "Entrar no painel"}
            </button>

          </div>

        </div>


        <p className="mt-7 text-center text-xs tracking-wide text-[#aaa69c]">
          Acesso restrito
        </p>

      </div>

    </main>
  );
}