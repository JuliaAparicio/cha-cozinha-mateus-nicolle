"use client";

import { useState } from "react";

type AcessoPageProps = {
  modoInicial?: "login" | "cadastro";
  onVoltar: () => void;
  onLogin: (
    email: string,
    senha: string
  ) => Promise<void>;
  onCadastro: (
    email: string,
    senha: string
  ) => Promise<void>;
};

export default function AcessoPage({
  modoInicial = "login",
  onVoltar,
  onLogin,
  onCadastro,
}: AcessoPageProps) {
  const [modo, setModo] =
    useState<"login" | "cadastro">(
      modoInicial
    );

  const [email, setEmail] =
    useState("");

  const [senha, setSenha] =
    useState("");

  const [confirmarSenha, setConfirmarSenha] =
    useState("");

  const [carregando, setCarregando] =
    useState(false);

  const [erro, setErro] =
    useState("");

  async function continuar() {
    if (carregando) {
      return;
    }

    setErro("");

    const emailLimpo =
      email.trim().toLowerCase();

    if (!emailLimpo) {
      setErro(
        "Digite seu e-mail."
      );
      return;
    }

    if (!emailLimpo.includes("@")) {
      setErro(
        "Digite um e-mail válido."
      );
      return;
    }

    if (!senha) {
      setErro(
        "Digite sua senha."
      );
      return;
    }

    if (senha.length < 6) {
      setErro(
        "A senha deve ter pelo menos 6 caracteres."
      );
      return;
    }

    if (
      modo === "cadastro" &&
      senha !== confirmarSenha
    ) {
      setErro(
        "As senhas não são iguais."
      );
      return;
    }

    try {
      setCarregando(true);

      if (modo === "login") {
        await onLogin(
          emailLimpo,
          senha
        );
      } else {
        await onCadastro(
          emailLimpo,
          senha
        );
      }

    } catch (error) {
      console.error(
        "Erro na autenticação:",
        error
      );

      const mensagem =
        error instanceof Error
          ? error.message
          : "";

      if (
        mensagem.includes(
          "auth/email-already-in-use"
        )
      ) {
        setErro(
          "Este e-mail já possui uma conta. Entre com sua senha."
        );
      } else if (
        mensagem.includes(
          "auth/invalid-credential"
        )
      ) {
        setErro(
          "E-mail ou senha incorretos."
        );
      } else if (
        mensagem.includes(
          "auth/weak-password"
        )
      ) {
        setErro(
          "A senha precisa ter pelo menos 6 caracteres."
        );
      } else {
        setErro(
          "Não foi possível continuar agora. Tente novamente."
        );
      }

    } finally {
      setCarregando(false);
    }
  }

  function trocarModo(
    novoModo: "login" | "cadastro"
  ) {
    setModo(novoModo);
    setErro("");
    setSenha("");
    setConfirmarSenha("");
  }

  return (
    <main className="min-h-screen bg-[#f7f4ef] px-5 py-8 text-[#3f4038] md:px-8 md:py-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl flex-col justify-center">

        {/* Cabeçalho */}
        <div className="mb-8 text-center">
          <p className="mb-3 text-[11px] uppercase tracking-[0.38em] text-[#8b8068]">
            Chá de Cozinha
          </p>

          <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-medium tracking-tight text-[#3d4038] md:text-5xl">
            {modo === "login"
              ? "Bem-vindo"
              : "Crie seu acesso"}
          </h1>

          <div className="mx-auto mt-5 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[#c6ad72]" />

            <span className="text-sm text-[#a68c50]">
              ♥
            </span>

            <span className="h-px w-10 bg-[#c6ad72]" />
          </div>

          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-[#72736b]">
            {modo === "login"
              ? "Entre para acessar sua confirmação e os presentes que você escolheu."
              : "Crie seu acesso para confirmar sua presença e guardar suas escolhas."}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-[28px] border border-[#e9e4da] bg-white p-7 shadow-[0_15px_45px_rgba(70,65,50,0.08)] md:p-9">

          <div className="space-y-6">

            {/* E-mail */}
            <div>
              <label
                htmlFor="email"
                className="mb-2.5 block text-sm font-medium text-[#484941]"
              >
                E-mail
                <span className="text-[#a68c50]">
                  {" "}*
                </span>
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                placeholder="Ex.: maria@email.com"
                autoComplete="email"
                className="w-full rounded-2xl border border-[#ddd9d0] bg-[#fbfaf7] px-4 py-3.5 text-sm text-[#3f4038] outline-none transition placeholder:text-[#aaa79f] focus:border-[#536447] focus:bg-white focus:ring-2 focus:ring-[#536447]/10"
              />
            </div>

            {/* Senha */}
            <div>
              <label
                htmlFor="senha"
                className="mb-2.5 block text-sm font-medium text-[#484941]"
              >
                Senha
                <span className="text-[#a68c50]">
                  {" "}*
                </span>
              </label>

              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) =>
                  setSenha(
                    e.target.value
                  )
                }
                placeholder="Mínimo de 6 caracteres"
                autoComplete={
                  modo === "login"
                    ? "current-password"
                    : "new-password"
                }
                className="w-full rounded-2xl border border-[#ddd9d0] bg-[#fbfaf7] px-4 py-3.5 text-sm text-[#3f4038] outline-none transition placeholder:text-[#aaa79f] focus:border-[#536447] focus:bg-white focus:ring-2 focus:ring-[#536447]/10"
              />
            </div>

            {/* Confirmar senha */}
            {modo === "cadastro" && (
              <div>
                <label
                  htmlFor="confirmarSenha"
                  className="mb-2.5 block text-sm font-medium text-[#484941]"
                >
                  Confirmar senha
                  <span className="text-[#a68c50]">
                    {" "}*
                  </span>
                </label>

                <input
                  id="confirmarSenha"
                  type="password"
                  value={
                    confirmarSenha
                  }
                  onChange={(e) =>
                    setConfirmarSenha(
                      e.target.value
                    )
                  }
                  placeholder="Digite a senha novamente"
                  autoComplete="new-password"
                  className="w-full rounded-2xl border border-[#ddd9d0] bg-[#fbfaf7] px-4 py-3.5 text-sm text-[#3f4038] outline-none transition placeholder:text-[#aaa79f] focus:border-[#536447] focus:bg-white focus:ring-2 focus:ring-[#536447]/10"
                />
              </div>
            )}

            {/* Erro */}
            {erro && (
              <div className="rounded-2xl bg-[#fdf1ef] px-4 py-3.5">
                <p className="text-xs leading-5 text-[#9b5148]">
                  {erro}
                </p>
              </div>
            )}

            {/* Aviso */}
            <div className="rounded-2xl bg-[#f5f4ee] px-4 py-3.5">
              <p className="text-xs leading-5 text-[#77786f]">
                <span className="font-medium text-[#536447]">
                  *
                </span>{" "}
                Campos obrigatórios.
              </p>
            </div>

            {/* Botões */}
            <div className="grid gap-3 pt-1 sm:grid-cols-2">

              <button
                type="button"
                onClick={onVoltar}
                disabled={carregando}
                className="w-full rounded-full border border-[#b7b5ad] px-6 py-3.5 text-sm font-medium text-[#55564f] transition duration-200 hover:bg-[#f5f3ee] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Voltar
              </button>

              <button
                type="button"
                onClick={continuar}
                disabled={carregando}
                className="w-full rounded-full bg-[#536447] px-6 py-3.5 text-sm font-medium text-white shadow-sm transition duration-200 hover:bg-[#435238] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {carregando
                  ? "Aguarde..."
                  : modo === "login"
                  ? "Entrar"
                  : "Criar acesso"}
              </button>

            </div>

            {/* Alternar modo */}
            <div className="border-t border-[#eeeae2] pt-6 text-center">

              {modo === "login" ? (
                <p className="text-sm text-[#77786f]">
                  Ainda não possui acesso?
                  {" "}

                  <button
                    type="button"
                    onClick={() =>
                      trocarModo(
                        "cadastro"
                      )
                    }
                    className="font-medium text-[#536447] underline underline-offset-2 transition hover:text-[#435238]"
                  >
                    Criar acesso
                  </button>
                </p>
              ) : (
                <p className="text-sm text-[#77786f]">
                  Já possui acesso?
                  {" "}

                  <button
                    type="button"
                    onClick={() =>
                      trocarModo(
                        "login"
                      )
                    }
                    className="font-medium text-[#536447] underline underline-offset-2 transition hover:text-[#435238]"
                  >
                    Entrar
                  </button>
                </p>
              )}

            </div>
          </div>
        </div>

        <p className="mt-7 text-center text-xs tracking-wide text-[#aaa69c]">
          Nicolle & Mateus
        </p>
      </div>
    </main>
  );
}