"use client";

import { Dispatch, SetStateAction } from "react";

type ConfirmacaoPageProps = {
  nome: string;
  setNome: (valor: string) => void;
  quantidade: string;
  alterarQuantidade: (valor: string) => void;
  nomesAcompanhantes: string[];
  setNomesAcompanhantes: Dispatch<SetStateAction<string[]>>;
  onVoltar: () => void;
  onConfirmar: () => void;
};

export default function ConfirmacaoPage({
  nome,
  setNome,
  quantidade,
  alterarQuantidade,
  nomesAcompanhantes,
  setNomesAcompanhantes,
  onVoltar,
  onConfirmar,
}: ConfirmacaoPageProps) {
  return (
    <main className="min-h-screen bg-[#f7f4ef] px-5 py-8 text-[#3f4038] md:px-8 md:py-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl flex-col justify-center">
        {/* Cabeçalho */}
        <div className="mb-8 text-center">
          <p className="mb-3 text-[11px] uppercase tracking-[0.38em] text-[#8b8068]">
            Chá de Cozinha
          </p>

          <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-medium tracking-tight text-[#3d4038] md:text-5xl">
            Confirme sua presença
          </h1>

          <div className="mx-auto mt-5 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[#c6ad72]" />
            <span className="text-sm text-[#a68c50]">♥</span>
            <span className="h-px w-10 bg-[#c6ad72]" />
          </div>

          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-[#72736b]">
            Será uma alegria ter você conosco. Preencha os dados abaixo para
            confirmar sua presença.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-[28px] border border-[#e9e4da] bg-white p-7 shadow-[0_15px_45px_rgba(70,65,50,0.08)] md:p-9">
          <div className="space-y-7">
            {/* Nome */}
            <div>
              <label
                htmlFor="nome"
                className="mb-2.5 block text-sm font-medium text-[#484941]"
              >
                Nome completo <span className="text-[#a68c50]">*</span>
              </label>

              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex.: Maria da Silva"
                required
                autoComplete="name"
                className="w-full rounded-2xl border border-[#ddd9d0] bg-[#fbfaf7] px-4 py-3.5 text-sm text-[#3f4038] outline-none transition placeholder:text-[#aaa79f] focus:border-[#536447] focus:bg-white focus:ring-2 focus:ring-[#536447]/10"
              />

              <p className="mt-2 text-xs text-[#89877f]">
                Informe seu nome e sobrenome.
              </p>
            </div>

            {/* Quantidade */}
            <div>
              <label
                htmlFor="quantidade"
                className="mb-2.5 block text-sm font-medium text-[#484941]"
              >
                Quantas pessoas irão ao evento?{" "}
                <span className="text-[#a68c50]">*</span>
              </label>

              <select
                id="quantidade"
                value={quantidade}
                onChange={(e) => alterarQuantidade(e.target.value)}
                required
                className="w-full rounded-2xl border border-[#ddd9d0] bg-[#fbfaf7] px-4 py-3.5 text-sm text-[#3f4038] outline-none transition focus:border-[#536447] focus:bg-white focus:ring-2 focus:ring-[#536447]/10"
              >
                <option value="">Selecione a quantidade</option>
                <option value="1">1 pessoa</option>
                <option value="2">2 pessoas</option>
                <option value="3">3 pessoas</option>
                <option value="4">4 pessoas</option>
                <option value="5">5 pessoas</option>
                <option value="6">6 pessoas</option>
              </select>
            </div>

            {/* Acompanhantes */}
            {nomesAcompanhantes.length > 0 && (
              <div className="border-t border-[#eeeae2] pt-7">
                <div className="mb-5">
                  <h2 className="text-sm font-medium text-[#484941]">
                    Acompanhantes
                  </h2>

                  <p className="mt-1.5 text-xs leading-5 text-[#89877f]">
                    Informe o nome completo de cada acompanhante.
                  </p>
                </div>

                <div className="space-y-5">
                  {nomesAcompanhantes.map((nomeAcompanhante, index) => (
                    <div key={index}>
                      <label
                        htmlFor={`acompanhante-${index}`}
                        className="mb-2.5 block text-sm text-[#55564f]"
                      >
                        Nome completo da {index + 1}ª pessoa{" "}
                        <span className="text-[#a68c50]">*</span>
                      </label>

                      <input
                        id={`acompanhante-${index}`}
                        type="text"
                        value={nomeAcompanhante}
                        onChange={(e) => {
                          const novosNomes = [...nomesAcompanhantes];

                          novosNomes[index] = e.target.value;

                          setNomesAcompanhantes(novosNomes);
                        }}
                        placeholder="Ex.: João da Silva"
                        required
                        autoComplete="off"
                        className="w-full rounded-2xl border border-[#ddd9d0] bg-[#fbfaf7] px-4 py-3.5 text-sm text-[#3f4038] outline-none transition placeholder:text-[#aaa79f] focus:border-[#536447] focus:bg-white focus:ring-2 focus:ring-[#536447]/10"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Aviso */}
            <div className="rounded-2xl bg-[#f5f4ee] px-4 py-3.5">
              <p className="text-xs leading-5 text-[#77786f]">
                <span className="font-medium text-[#536447]">*</span> Campos
                obrigatórios.
              </p>
            </div>

            {/* Botões */}
            <div className="grid gap-3 pt-1 sm:grid-cols-2">
              <button
                type="button"
                onClick={onVoltar}
                className="w-full rounded-full border border-[#b7b5ad] px-6 py-3.5 text-sm font-medium text-[#55564f] transition duration-200 hover:bg-[#f5f3ee]"
              >
                Voltar
              </button>

              <button
                type="button"
                onClick={onConfirmar}
                className="w-full rounded-full bg-[#536447] px-6 py-3.5 text-sm font-medium text-white shadow-sm transition duration-200 hover:bg-[#435238] hover:shadow-md"
              >
                Confirmar presença
              </button>
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