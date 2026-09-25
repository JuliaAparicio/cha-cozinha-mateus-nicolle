"use client";

import Image from "next/image";
import { Presente } from "../types/presente";

type PresenteModalProps = {
  presente: Presente | null;
  meuPresente?: boolean;
  onCancelar: () => void;
  onConfirmar: () => void;
};

export default function PresenteModal({
  presente,
  meuPresente = false,
  onCancelar,
  onConfirmar,
}: PresenteModalProps) {
  if (!presente) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Botão fechar */}
        <button
          type="button"
          onClick={onCancelar}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-xl text-[#555] shadow-sm transition hover:bg-white"
          aria-label="Fechar"
        >
          ×
        </button>

        {/* Imagem */}
        <div className="relative h-64 w-full bg-[#f5f5f5]">
          <Image
            src={presente.imagem}
            alt={presente.nome}
            fill
            className="object-contain p-6"
          />
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[#888]">
            {meuPresente ? "Seu presente escolhido" : "Escolha de presente"}
          </p>

          <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#2f2f2f]">
            {presente.nome}
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#666]">
            {presente.descricao}
          </p>

          <div className="mt-5 space-y-2 text-sm">
            <p>
              <span className="font-medium">Cor:</span>{" "}
              {presente.cor}
            </p>

            {presente.observacao && (
              <p className="leading-6 text-[#666]">
                <span className="font-medium text-[#333]">
                  Observação:
                </span>{" "}
                {presente.observacao}
              </p>
            )}
          </div>

          {/* Informação */}
          <div className="mt-6 rounded-2xl bg-[#f7f4ef] p-4">
            <p className="text-xs leading-5 text-[#666]">
              {meuPresente
                ? "Este presente foi escolhido por você. Você pode acessar novamente o link de compra."
                : "Ao confirmar, você será direcionado para o link de compra deste presente."}
            </p>
          </div>

          {/* Botões */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onCancelar}
              className="w-full rounded-full border border-[#333] px-6 py-3 text-sm font-medium text-[#333] transition hover:bg-[#f5f5f5]"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={onConfirmar}
              className="w-full rounded-full bg-[#2f2f2f] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#1f1f1f]"
            >
              {meuPresente
                ? "Acessar link de compra"
                : "Escolher presente"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}