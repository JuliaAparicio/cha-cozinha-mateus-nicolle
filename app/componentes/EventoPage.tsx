"use client";

type EventoPageProps = {
  endereco: string;
  linkGoogleMaps: string;
  linkWaze: string;
  onVoltar: () => void;
  onConfirmar: () => void;
};

export default function EventoPage({
  endereco,
  linkGoogleMaps,
  linkWaze,
  onVoltar,
  onConfirmar,
}: EventoPageProps) {
  return (
    <main className="min-h-screen bg-[#f7f4ef] px-5 py-8 text-[#3f4038] md:px-8 md:py-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-4xl flex-col justify-center">

        {/* Cabeçalho */}
        <div className="mb-8 text-center md:mb-10">
          <p className="mb-3 text-[11px] uppercase tracking-[0.38em] text-[#8b8068]">
            Nosso dia
          </p>

          <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-medium tracking-tight text-[#3d4038] md:text-5xl">
            Chá de Cozinha
          </h1>

          <div className="mx-auto mt-6 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[#c6ad72]" />
            <span className="text-sm text-[#a68c50]">♥</span>
            <span className="h-px w-10 bg-[#c6ad72]" />
          </div>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#72736b]">
            Que bom ter você aqui!
            Será uma alegria celebrar esse momento com você.
            Entre para confirmar sua presença e acessar nossa lista de presentes.
          </p>
        </div>

        {/* Card principal */}
        <div className="overflow-hidden rounded-[28px] border border-[#e9e4da] bg-white shadow-[0_15px_45px_rgba(70,65,50,0.08)]">
          <div className="p-7 md:p-10">

            {/* =========================
                3 INFORMAÇÕES
            ========================== */}
            <div className="grid gap-5 md:grid-cols-3">

              {/* DATA */}
              <div className="flex min-h-[190px] flex-col items-center justify-center rounded-[24px] border border-[#e9e4da] bg-[#fbfaf7] px-5 py-8 text-center transition duration-200 hover:shadow-sm">

                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#f0ede4] text-lg text-[#a68c50]">
                  ♡
                </div>

                <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-[#9a907b]">
                  Data
                </p>

                <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#42443c]">
                  25 de outubro
                </h2>

                <p className="mt-2 text-sm text-[#77786f]">
                  Domingo · 2026
                </p>
              </div>

              {/* HORÁRIO */}
              <div className="flex min-h-[190px] flex-col items-center justify-center rounded-[24px] border border-[#e9e4da] bg-[#fbfaf7] px-5 py-8 text-center transition duration-200 hover:shadow-sm">

                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#f0ede4] text-lg text-[#a68c50]">
                  ♡
                </div>

                <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-[#9a907b]">
                  Horário
                </p>

                <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#42443c]">
                  13h00
                </h2>

                <p className="mt-2 text-sm text-[#77786f]">
                  Almoço
                </p>
              </div>

              {/* LOCAL */}
              <div className="flex min-h-[190px] flex-col items-center justify-center rounded-[24px] border border-[#e9e4da] bg-[#fbfaf7] px-5 py-8 text-center transition duration-200 hover:shadow-sm">

                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#f0ede4] text-lg text-[#a68c50]">
                  ♡
                </div>

                <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-[#9a907b]">
                  Local
                </p>

                <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#42443c]">
                  Vila Constança
                </h2>

                <p className="mt-2 max-w-[220px] text-sm leading-6 text-[#77786f]">
                  {endereco}
                </p>
              </div>

            </div>

            {/* =========================
                PARTE DE BAIXO
                MANTIDA
            ========================== */}

            {/* Localização */}
            <div className="pt-8">
              <p className="mb-4 text-xs text-[#77786f]">
                Para facilitar sua chegada:
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <a
                  href={linkGoogleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-[#8c8d82] px-6 py-3.5 text-center text-sm font-medium text-[#4a4b44] transition duration-200 hover:border-[#536447] hover:bg-[#536447] hover:text-white"
                >
                  Abrir no Google Maps
                </a>

                <a
                  href={linkWaze}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-[#8c8d82] px-6 py-3.5 text-center text-sm font-medium text-[#4a4b44] transition duration-200 hover:border-[#536447] hover:bg-[#536447] hover:text-white"
                >
                  Abrir no Waze
                </a>
              </div>
            </div>

            {/* Botões */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
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

        {/* Rodapé */}
        <p className="mt-7 text-center text-xs tracking-wide text-[#aaa69c]">
          Nicolle & Mateus
        </p>
      </div>
    </main>
  );
}