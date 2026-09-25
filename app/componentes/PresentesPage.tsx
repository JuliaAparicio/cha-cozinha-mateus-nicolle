"use client";

import Image from "next/image";
import { Presente } from "../types/presente";

type PresentesPageProps = {
  presentes: Presente[];
  presentesReservados: number[];
  minhasReservas: number[];
  onVoltar: () => void;
  onAbrirEscolha: (presente: Presente) => void;
};

export default function PresentesPage({
  presentes,
  presentesReservados,
  minhasReservas,
  onVoltar,
  onAbrirEscolha,
}: PresentesPageProps) {
  return (
    <main className="min-h-screen bg-[#f7f4ef] px-4 py-8 text-[#2f2f2f] sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">

        {/* Cabeçalho */}
        <div className="mb-8 text-center sm:mb-10">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#777] sm:text-sm">
            Com carinho
          </p>

          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-medium sm:text-4xl md:text-5xl">
            Lista de presentes
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-xs leading-5 text-[#666] sm:text-sm sm:leading-6">
            Ao selecionar um presente, ele ficará reservado e deixará de
            aparecer como disponível para os demais convidados.
          </p>
        </div>

        {/* Lista de presentes */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
          {presentes.map((presente) => {
            const reservado =
              presentesReservados.includes(
                presente.id
              );

            const meuPresente =
              minhasReservas.includes(
                presente.id
              );

            const bloqueado =
              reservado && !meuPresente;

            return (
              <div
                key={presente.id}
                className={`group overflow-hidden rounded-2xl border bg-white shadow-sm transition duration-300 sm:rounded-3xl ${
                  reservado
                    ? "border-[#ddd]"
                    : "border-transparent hover:-translate-y-1 hover:shadow-md"
                }`}
              >
                {/* Imagem */}
                <div className="relative h-40 w-full bg-[#f5f5f5] sm:h-64">
                  <Image
                    src={presente.imagem}
                    alt={presente.nome}
                    fill
                    className="object-contain p-3 transition duration-300 group-hover:scale-[1.02] sm:p-5"
                  />

                  {bloqueado && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 px-2">
                      <span className="rounded-full bg-white px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.08em] text-[#333] sm:px-5 sm:py-2 sm:text-xs sm:tracking-[0.15em]">
                        Presente reservado
                      </span>
                    </div>
                  )}

                  {meuPresente && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#1E5631]/20 px-2">
                      <span className="rounded-full bg-white px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.08em] text-[#1E5631] sm:px-5 sm:py-2 sm:text-xs sm:tracking-[0.15em]">
                        Você escolheu
                      </span>
                    </div>
                  )}
                </div>

                {/* Conteúdo */}
                <div className="p-3 sm:p-5">
                  <h2 className="font-[family-name:var(--font-playfair)] text-base leading-5 sm:text-2xl sm:leading-normal">
                    {presente.nome}
                  </h2>

                  {presente.descricao && (
                    <p className="mt-1.5 text-[11px] leading-4 text-[#666] sm:mt-2 sm:text-sm sm:leading-6">
                      {presente.descricao}
                    </p>
                  )}

                  {presente.observacao && (
                    <div className="mt-2 text-[10px] leading-4 text-[#777] sm:mt-4 sm:text-xs">
                      <p>
                        <span className="font-medium text-[#444]">
                          Observação:
                        </span>{" "}
                        {presente.observacao}
                      </p>
                    </div>
                  )}

                  {/* Botão */}
                  <button
                    type="button"
                    onClick={() =>
                      onAbrirEscolha(
                        presente
                      )
                    }
                    disabled={bloqueado}
                    className={`mt-4 w-full rounded-full px-3 py-2 text-[11px] font-medium transition sm:mt-6 sm:px-5 sm:py-3 sm:text-sm ${
                      bloqueado
                        ? "cursor-not-allowed bg-[#e8e8e8] text-[#888]"
                        : "bg-[#2f2f2f] text-white hover:bg-[#1f1f1f]"
                    }`}
                  >
                    {meuPresente
                      ? "Ver meu presente"
                      : bloqueado
                      ? "Presente reservado"
                      : "Escolher presente"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Voltar */}
        <div className="mt-8 text-center sm:mt-10">
          <button
            type="button"
            onClick={onVoltar}
            className="rounded-full border border-[#333] px-6 py-2.5 text-xs font-medium transition hover:bg-white sm:px-7 sm:py-3 sm:text-sm"
          >
            Voltar
          </button>
        </div>
      </div>
    </main>
  );
}