"use client";

type HomePageProps = {
  onContinuar: () => void;
};

export default function HomePage({ onContinuar }: HomePageProps) {
  return (
    <main className="min-h-screen bg-[#f7f4ef] text-[#2f2f2f]">
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-10">
        {/* Imagem do casal */}
        <div className="absolute inset-0">
          <img
            src="/foto%20casal/casal_pedido.jpeg"
            alt="Nicolle e Mateus"
            className="h-full w-full object-cover object-[65%_center] md:object-center"
          />

          {/* Sobreposição para melhorar a leitura */}
          <div className="absolute inset-0 bg-black/35" />
        </div>

        {/* Conteúdo */}
        <div className="relative z-10 w-full max-w-2xl text-center text-white">
          <p className="mb-5 text-sm uppercase tracking-[0.35em]">
            Chá de Cozinha
          </p>

          <h1 className="font-[family-name:var(--font-playfair)] text-5xl font-medium md:text-7xl">
            Um novo capítulo
            <br />
            começa...
          </h1>

          <p className="mt-6 font-[family-name:var(--font-playfair)] text-3xl md:text-4xl">
            Nicolle & Mateus
          </p>

          <div className="mx-auto mt-8 h-px w-20 bg-white/70" />

          <div className="mt-6 space-y-1">
            <p className="text-lg tracking-[0.15em]">25.10.2026</p>

            <p className="text-sm uppercase tracking-[0.25em]">
              13H00
            </p>
          </div>

          <button
            type="button"
            onClick={onContinuar}
            className="mt-10 rounded-full bg-white px-8 py-4 text-sm font-medium text-[#2f2f2f] shadow-lg transition hover:scale-[1.02] hover:bg-[#f5f5f5]"
          >
            Conheça o nosso dia
          </button>
        </div>
      </div>
    </main>
  );
}