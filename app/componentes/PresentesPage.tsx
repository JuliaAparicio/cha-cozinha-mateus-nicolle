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
    <main className="min-h-screen bg-[#f7f4ef] px-6 py-10 text-[#2f2f2f]">
      <div className="mx-auto max-w-6xl">
        {/* Cabeçalho */}
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#777]">
            Com carinho
          </p>

          <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-medium md:text-5xl">
            Lista de presentes
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#666]">
            Ao selecionar um presente, ele ficará reservado e deixará de aparecer como disponível para os demais convidados..
          </p>
        </div>

        {/* Lista de presentes */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                className={`group overflow-hidden rounded-3xl border bg-white shadow-sm transition duration-300 ${
                  reservado
                    ? "border-[#ddd]"
                    : "border-transparent hover:-translate-y-1 hover:shadow-md"
                }`}
              >
                {/* Imagem */}
                <div className="relative h-64 w-full bg-[#f5f5f5]">
                  <Image
                    src={presente.imagem}
                    alt={presente.nome}
                    fill
                    className="object-contain p-5 transition duration-300 group-hover:scale-[1.02]"
                  />

                  {bloqueado && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <span className="rounded-full bg-white px-5 py-2 text-xs font-medium uppercase tracking-[0.15em] text-[#333]">
                        Presente reservado
                      </span>
                    </div>
                  )}

                  {meuPresente && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#1E5631]/20">
                      <span className="rounded-full bg-white px-5 py-2 text-xs font-medium uppercase tracking-[0.15em] text-[#1E5631]">
                        Você escolheu
                      </span>
                    </div>
                  )}
                </div>

                {/* Conteúdo */}
                <div className="p-5">
                  <h2 className="font-[family-name:var(--font-playfair)] text-2xl">
                    {presente.nome}
                  </h2>

                  {presente.descricao && (
                    <p className="mt-2 text-sm leading-6 text-[#666]">
                      {presente.descricao}
                    </p>
                  )}

                  {presente.observacao && (
                    <div className="mt-4 text-xs text-[#777]">
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
                    className={`mt-6 w-full rounded-full px-5 py-3 text-sm font-medium transition ${
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
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={onVoltar}
            className="rounded-full border border-[#333] px-7 py-3 text-sm font-medium transition hover:bg-white"
          >
            Voltar
          </button>
        </div>
      </div>
    </main>
  );
}