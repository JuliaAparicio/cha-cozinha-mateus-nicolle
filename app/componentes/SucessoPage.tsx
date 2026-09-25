"use client";

type SucessoPageProps = {
  nome: string;
  onConhecerPresentes: () => void;
};

export default function SucessoPage({
  nome,
  onConhecerPresentes,
}: SucessoPageProps) {
  return (
    <main className="min-h-screen bg-[#f7f4ef] px-6 py-10 text-[#2f2f2f]">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-2xl flex-col items-center justify-center text-center">
        <div className="rounded-3xl bg-white p-8 shadow-sm md:p-12">
          {/* Ícone */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f0eee8] text-2xl">
            ✓
          </div>

          <p className="mt-6 text-sm uppercase tracking-[0.3em] text-[#777]">
            Tudo certo!
          </p>

          <h1 className="mt-3 font-[family-name:var(--font-playfair)] text-4xl font-medium md:text-5xl">
            Presença confirmada!
          </h1>

          <p className="mt-5 text-sm leading-7 text-[#666]">
            Até breve,{" "}
            <span className="font-medium text-[#333]">{nome}</span>! 💚
          </p>

          <p className="mt-3 text-sm leading-7 text-[#777]">
            Estamos muito felizes em poder compartilhar esse momento
            especial com você.
          </p>

          <button
            type="button"
            onClick={onConhecerPresentes}
            className="mt-8 rounded-full bg-[#2f2f2f] px-8 py-4 text-sm font-medium text-white transition hover:bg-[#1f1f1f]"
          >
            Conhecer nossa lista de presentes
          </button>
        </div>
      </div>
    </main>
  );
}