"use client";

import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import HomePage from "./componentes/HomePage";
import EventoPage from "./componentes/EventoPage";
import ConfirmacaoPage from "./componentes/ConfirmacaoPage";
import SucessoPage from "./componentes/SucessoPage";
import IntroducaoPresentesPage from "./componentes/IntroducaoPresentesPage";
import PresentesPage from "./componentes/PresentesPage";
import PresenteModal from "./componentes/PresenteModal";
import AcessoPage from "./componentes/AcessoPage";

import { Presente } from "./types/presente";

import { salvarConvidado } from "./lib/convidados";

import {
  buscarPresentes,
  buscarReservas,
} from "./lib/presentes";

import {
  auth,
  db,
  criarConta,
  entrarComEmail,
} from "./lib/firebase";

export default function Home() {
  const [tela, setTela] =
    useState("inicio");

  const [nome, setNome] =
    useState("");

  const [quantidade, setQuantidade] =
    useState("");

  const [
    nomesAcompanhantes,
    setNomesAcompanhantes,
  ] = useState<string[]>([]);

  const [
    presenteSelecionado,
    setPresenteSelecionado,
  ] = useState<Presente | null>(null);

  const [
    presentes,
    setPresentes,
  ] = useState<Presente[]>([]);

  const [
    presentesReservados,
    setPresentesReservados,
  ] = useState<number[]>([]);

  const [
    minhasReservas,
    setMinhasReservas,
  ] = useState<number[]>([]);

  const [salvando, setSalvando] =
    useState(false);

  const [
    reservandoPresente,
    setReservandoPresente,
  ] = useState(false);

  const [
    verificandoAcesso,
    setVerificandoAcesso,
  ] = useState(true);

  const endereco =
    "Av. Jd. Japão, 1542 - Jardim Brasil";

  const linkGoogleMaps =
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      endereco
    )}`;

  const linkWaze =
    `https://www.waze.com/ul?q=${encodeURIComponent(
      endereco
    )}&navigate=yes`;

  /*
   * ============================================================
   * CARREGAR PRESENTES DO FIRESTORE
   * ============================================================
   */

  useEffect(() => {
    async function carregarPresentes() {
      try {
        const dados =
          await buscarPresentes();

        const presentesFormatados:
          Presente[] =
          dados.map((presente) => ({
            ...presente,
            id: Number(presente.id),
          }));

        setPresentes(
          presentesFormatados
        );
      } catch (erro) {
        console.error(
          "Erro ao carregar presentes:",
          erro
        );
      }
    }

    carregarPresentes();
  }, []);

  /*
   * ============================================================
   * VERIFICA SE O USUÁRIO JÁ ESTÁ LOGADO
   * ============================================================
   */

  useEffect(() => {
    const cancelarObservacao =
      onAuthStateChanged(
        auth,
        async (usuario) => {
          try {
            /*
             * Usuário anônimo pertence ao sistema antigo.
             * Não vamos mais utilizá-lo no novo fluxo.
             */

            if (
              usuario?.isAnonymous
            ) {
              await signOut(auth);

              setVerificandoAcesso(
                false
              );

              return;
            }

            /*
             * Não existe usuário logado.
             * É uma primeira visita.
             */

            if (!usuario) {
              setVerificandoAcesso(
                false
              );

              return;
            }

            /*
             * Usuário possui conta de e-mail.
             * Agora verificamos se ele já confirmou presença.
             */

            const consulta =
              query(
                collection(
                  db,
                  "convidados"
                ),
                where(
                  "uid",
                  "==",
                  usuario.uid
                )
              );

            const resultado =
              await getDocs(
                consulta
              );

            /*
             * Se já existe cadastro,
             * recuperamos os dados do convidado.
             */

            if (
              !resultado.empty
            ) {
              const dados =
                resultado.docs[0].data();

              setNome(
                dados.nome || ""
              );

              setQuantidade(
                String(
                  dados.quantidade || ""
                )
              );

              setNomesAcompanhantes(
                Array.isArray(
                  dados.acompanhantes
                )
                  ? dados.acompanhantes
                  : []
              );

              /*
               * Também carregamos os presentes
               * escolhidos por essa pessoa.
               */

              await carregarMinhasReservas();

              /*
               * Como a pessoa já confirmou presença,
               * ela pode acessar diretamente os presentes.
               */

              setTela(
                "presentes"
              );
            } else {
              /*
               * Conta existe, mas ainda não confirmou presença.
               */

              setTela(
                "evento"
              );
            }
          } catch (erro) {
            console.error(
              "Erro ao verificar acesso:",
              erro
            );
          } finally {
            setVerificandoAcesso(
              false
            );
          }
        }
      );

    return () =>
      cancelarObservacao();
  }, []);

  /*
   * ============================================================
   * CARREGAR RESERVAS DOS PRESENTES
   * ============================================================
   */

  useEffect(() => {
    async function carregarReservas() {
      try {
        const reservas =
          await buscarReservas();

        const idsReservados =
          Object.keys(
            reservas
          ).map(
            (id) =>
              Number(id)
          );

        setPresentesReservados(
          idsReservados
        );
      } catch (erro) {
        console.error(
          "Erro ao carregar reservas:",
          erro
        );
      }
    }

    carregarReservas();
  }, []);

  /*
   * ============================================================
   * BUSCAR RESERVAS DO USUÁRIO ATUAL
   * ============================================================
   */

  async function carregarMinhasReservas() {
    const usuario =
      auth.currentUser;

    if (
      !usuario ||
      usuario.isAnonymous
    ) {
      setMinhasReservas([]);

      return;
    }

    const reservasQuery =
      query(
        collection(
          db,
          "reservas"
        ),
        where(
          "uid",
          "==",
          usuario.uid
        )
      );

    const snapshot =
      await getDocs(
        reservasQuery
      );

    const ids =
      snapshot.docs.map(
        (documento) =>
          Number(
            documento.id
          )
      );

    setMinhasReservas(
      ids
    );
  }

  /*
   * ============================================================
   * VERIFICAR SE O USUÁRIO JÁ CONFIRMOU
   * ============================================================
   */

  async function verificarConvidadoAtual(
    uid: string
  ) {
    const consulta =
      query(
        collection(
          db,
          "convidados"
        ),
        where(
          "uid",
          "==",
          uid
        )
      );

    const resultado =
      await getDocs(
        consulta
      );

    if (
      resultado.empty
    ) {
      return false;
    }

    const dados =
      resultado.docs[0].data();

    setNome(
      dados.nome || ""
    );

    setQuantidade(
      String(
        dados.quantidade || ""
      )
    );

    setNomesAcompanhantes(
      Array.isArray(
        dados.acompanhantes
      )
        ? dados.acompanhantes
        : []
    );

    return true;
  }

  /*
   * ============================================================
   * ALTERAR QUANTIDADE
   * ============================================================
   */

  function alterarQuantidade(
    valor: string
  ) {
    setQuantidade(
      valor
    );

    const numero =
      Number(valor);

    if (
      !numero ||
      numero < 2
    ) {
      setNomesAcompanhantes(
        []
      );

      return;
    }

    setNomesAcompanhantes(
      (nomesAtuais) =>
        Array.from(
          {
            length:
              numero - 1,
          },
          (_, index) =>
            nomesAtuais[index] ||
            ""
        )
    );
  }

  /*
   * ============================================================
   * LOGIN
   * ============================================================
   */

  async function fazerLogin(
    email: string,
    senha: string
  ) {
    const usuario =
      await entrarComEmail(
        email,
        senha
      );

    const jaConfirmou =
      await verificarConvidadoAtual(
        usuario.uid
      );

    if (
      jaConfirmou
    ) {
      await carregarMinhasReservas();

      setTela(
        "presentes"
      );

      return;
    }

    setTela(
      "evento"
    );
  }

  /*
   * ============================================================
   * CRIAR CONTA
   * ============================================================
   */

  async function fazerCadastro(
    email: string,
    senha: string
  ) {
    await criarConta(
      email,
      senha
    );

    /*
     * Depois de criar a conta,
     * a pessoa ainda precisa confirmar
     * os dados do evento.
     */

    setTela(
      "evento"
    );
  }

  /*
   * ============================================================
   * CONFIRMAR PRESENÇA
   * ============================================================
   */

  async function confirmarPresenca() {
    if (
      salvando
    ) {
      return;
    }

    const nomeDigitado =
      nome.trim();

    const partesDoNome =
      nomeDigitado.split(
        /\s+/
      );

    if (
      !nomeDigitado
    ) {
      alert(
        "Digite seu nome completo."
      );

      return;
    }

    if (
      partesDoNome.length < 2
    ) {
      alert(
        "Digite seu nome completo, com nome e sobrenome."
      );

      return;
    }

    if (
      !quantidade
    ) {
      alert(
        "Selecione a quantidade de pessoas."
      );

      return;
    }

    const numeroDePessoas =
      Number(
        quantidade
      );

    if (
      numeroDePessoas < 1
    ) {
      alert(
        "Selecione uma quantidade válida de pessoas."
      );

      return;
    }

    if (
      nomesAcompanhantes.some(
        (nomeAcompanhante) => {
          const nomeAcompanhanteLimpo =
            nomeAcompanhante.trim();

          const partesAcompanhante =
            nomeAcompanhanteLimpo.split(
              /\s+/
            );

          return (
            !nomeAcompanhanteLimpo ||
            partesAcompanhante.length < 2
          );
        }
      )
    ) {
      alert(
        "Preencha o nome completo de todos os acompanhantes, com nome e sobrenome."
      );

      return;
    }

    try {
      setSalvando(
        true
      );

      await salvarConvidado({
        nome:
          nomeDigitado,

        quantidade:
          numeroDePessoas,

        acompanhantes:
          nomesAcompanhantes,
      });

      setTela(
        "sucesso"
      );
    } catch (erro) {
      console.error(
        "Erro ao salvar convidado:",
        erro
      );

      alert(
        "Não foi possível confirmar sua presença agora. Tente novamente."
      );
    } finally {
      setSalvando(
        false
      );
    }
  }

  /*
   * ============================================================
   * ABRIR PRESENTE
   * ============================================================
   */

  function abrirEscolha(
    presente: Presente
  ) {
    const reservado =
      presentesReservados.includes(
        presente.id
      );

    const meuPresente =
      minhasReservas.includes(
        presente.id
      );

    if (
      reservado &&
      !meuPresente
    ) {
      return;
    }

    setPresenteSelecionado(
      presente
    );
  }

  /*
   * ============================================================
   * RESERVAR / ACESSAR PRESENTE
   * ============================================================
   */

  async function confirmarEscolhaPresente() {
    if (
      !presenteSelecionado ||
      reservandoPresente
    ) {
      return;
    }

    const presenteId =
      String(
        presenteSelecionado.id
      );

    const meuPresente =
      minhasReservas.includes(
        presenteSelecionado.id
      );

    try {
      setReservandoPresente(
        true
      );

      const usuario =
        auth.currentUser;

      if (
        !usuario ||
        usuario.isAnonymous
      ) {
        throw new Error(
          "USUARIO_NAO_AUTENTICADO"
        );
      }

      const token =
        await usuario.getIdToken();

      /*
       * Se o presente já pertence
       * ao usuário atual, apenas
       * acessamos novamente o link.
       */

      if (
        meuPresente
      ) {
        const resposta =
          await fetch(
            "/api/reservar",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body:
                JSON.stringify({
                  presenteId,

                  acessarReserva:
                    true,
                }),
            }
          );

        const resultado =
          await resposta.json();

        if (
          !resposta.ok
        ) {
          throw new Error(
            resultado.erro ||
              "ERRO_AO_ACESSAR_RESERVA"
          );
        }

        if (
          resultado.linkCompra
        ) {
          window.open(
            resultado.linkCompra,
            "_blank"
          );
        }

        setPresenteSelecionado(
          null
        );

        return;
      }

      /*
       * Nova reserva.
       */

      const resposta =
        await fetch(
          "/api/reservar",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body:
              JSON.stringify({
                presenteId,
              }),
          }
        );

      const resultado =
        await resposta.json();

      if (
        !resposta.ok
      ) {
        if (
          resultado.erro ===
          "PRESENTE_JA_RESERVADO"
        ) {
          alert(
            "Esse presente acabou de ser escolhido por outra pessoa."
          );

          setPresentesReservados(
            (atuais) => {
              if (
                atuais.includes(
                  presenteSelecionado.id
                )
              ) {
                return atuais;
              }

              return [
                ...atuais,
                presenteSelecionado.id,
              ];
            }
          );

          setPresenteSelecionado(
            null
          );

          return;
        }

        throw new Error(
          resultado.erro ||
            "ERRO_AO_RESERVAR"
        );
      }

      setPresentesReservados(
        (atuais) => {
          if (
            atuais.includes(
              presenteSelecionado.id
            )
          ) {
            return atuais;
          }

          return [
            ...atuais,
            presenteSelecionado.id,
          ];
        }
      );

      setMinhasReservas(
        (atuais) => {
          if (
            atuais.includes(
              presenteSelecionado.id
            )
          ) {
            return atuais;
          }

          return [
            ...atuais,
            presenteSelecionado.id,
          ];
        }
      );

      setPresenteSelecionado(
        null
      );

      if (
        resultado.linkCompra
      ) {
        window.open(
          resultado.linkCompra,
          "_blank"
        );
      }
    } catch (erro) {
      console.error(
        "Erro ao reservar presente:",
        erro
      );

      alert(
        "Não foi possível reservar esse presente agora. Tente novamente."
      );
    } finally {
      setReservandoPresente(
        false
      );
    }
  }

  const presenteEhMeu =
    presenteSelecionado
      ? minhasReservas.includes(
          presenteSelecionado.id
        )
      : false;

  /*
   * ============================================================
   * AGUARDANDO VERIFICAÇÃO
   * ============================================================
   */

  if (
    verificandoAcesso
  ) {
    return (
      <main className="min-h-screen bg-[#f7f4ef]" />
    );
  }

  return (
    <>
      {tela === "inicio" && (
        <HomePage
          onContinuar={() =>
            setTela(
              "acesso"
            )
          }
        />
      )}

      {tela === "acesso" && (
        <AcessoPage
          modoInicial="login"
          onVoltar={() =>
            setTela(
              "inicio"
            )
          }
          onLogin={
            fazerLogin
          }
          onCadastro={
            fazerCadastro
          }
        />
      )}

      {tela === "evento" && (
        <EventoPage
          endereco={
            endereco
          }
          linkGoogleMaps={
            linkGoogleMaps
          }
          linkWaze={
            linkWaze
          }
          onVoltar={() =>
            setTela(
              "acesso"
            )
          }
          onConfirmar={() =>
            setTela(
              "confirmacao"
            )
          }
        />
      )}

      {tela === "confirmacao" && (
        <ConfirmacaoPage
          nome={
            nome
          }
          setNome={
            setNome
          }
          quantidade={
            quantidade
          }
          alterarQuantidade={
            alterarQuantidade
          }
          nomesAcompanhantes={
            nomesAcompanhantes
          }
          setNomesAcompanhantes={
            setNomesAcompanhantes
          }
          onVoltar={() =>
            setTela(
              "evento"
            )
          }
          onConfirmar={
            confirmarPresenca
          }
        />
      )}

      {tela === "sucesso" && (
        <SucessoPage
          nome={
            nome
          }
          onConhecerPresentes={async () => {
            await carregarMinhasReservas();

            setTela(
              "introducao-presentes"
            );
          }}
        />
      )}

      {tela === "introducao-presentes" && (
        <IntroducaoPresentesPage
          onVoltar={() =>
            setTela(
              "sucesso"
            )
          }
          onAcessarPresentes={() =>
            setTela(
              "presentes"
            )
          }
        />
      )}

      {tela === "presentes" && (
        <>
          <PresentesPage
            presentes={
              presentes
            }
            presentesReservados={
              presentesReservados
            }
            minhasReservas={
              minhasReservas
            }
            onVoltar={() =>
              setTela(
                "introducao-presentes"
              )
            }
            onAbrirEscolha={
              abrirEscolha
            }
          />

          <PresenteModal
            presente={
              presenteSelecionado
            }
            meuPresente={
              presenteEhMeu
            }
            onCancelar={() =>
              setPresenteSelecionado(
                null
              )
            }
            onConfirmar={
              confirmarEscolhaPresente
            }
          />
        </>
      )}
    </>
  );
}