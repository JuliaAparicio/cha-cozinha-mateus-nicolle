"use client";

type IntroducaoPresentesPageProps = {
  onVoltar: () => void;
  onAcessarPresentes: () => void;
};

export default function IntroducaoPresentesPage({
  onVoltar,
  onAcessarPresentes,
}: IntroducaoPresentesPageProps) {
  return (
    <main className="min-h-screen bg-[#f7f4ef] px-5 py-12 text-[#3f4038] md:px-8 md:py-16">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-3xl flex-col justify-center">
        
        {/* Cabeçalho */}
        <div className="text-center">
          <p className="mb-5 text-[11px] uppercase tracking-[0.38em] text-[#8b8068]">
            Com carinho
          </p>

          <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-medium tracking-tight text-[#3d4038] md:text-5xl">
            Lista de presentes
          </h1>

          {/* Detalhe decorativo */}
          <div className="mx-auto mt-6 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[#c6ad72]" />
            <span className="text-sm text-[#a68c50]">♥</span>
            <span className="h-px w-10 bg-[#c6ad72]" />
          </div>

          <p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-[#72736b] md:text-[15px]">
            Mais do que presentes, queremos celebrar esse momento com vocês.
            Para quem quiser nos presentear, preparamos uma lista com alguns
            itens que farão parte da nossa nova casa.
          </p>
        </div>

        {/* Espaço antes do card */}
        <div className="mt-12 md:mt-14">
          <div className="rounded-[28px] border border-[#e9e4da] bg-white px-6 py-9 shadow-[0_15px_45px_rgba(70,65,50,0.07)] md:px-10 md:py-10">
            
            {/* Título da paleta */}
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#9a907b]">
                Nossa paleta
              </p>

              <p className="mx-auto mt-4 max-w-md text-xs leading-6 text-[#89877f]">
                Para deixar nossa cozinha harmoniosa, escolhemos uma paleta
                simples e atemporal.
              </p>
            </div>

            {/* Cores */}
            <div className="mt-9 grid grid-cols-2 gap-y-8 sm:grid-cols-4 sm:gap-6">
              
              {/* Branco */}
              <div className="flex flex-col items-center">
                <div className="h-14 w-14 rounded-full border border-[#dedbd4] bg-white shadow-sm" />

                <span className="mt-3 text-xs text-[#66675f]">
                  Branco
                </span>
              </div>

              {/* Preto */}
              <div className="flex flex-col items-center">
                <div className="h-14 w-14 rounded-full bg-[#2f2f2f] shadow-sm" />

                <span className="mt-3 text-xs text-[#66675f]">
                  Preto
                </span>
              </div>

              {/* Bambu */}
              <div className="flex flex-col items-center">
                <div className="h-14 w-14 rounded-full bg-[#c8a879] shadow-sm" />

                <span className="mt-3 text-xs text-[#66675f]">
                  Bambu
                </span>
              </div>

              {/* Inox */}
              <div className="flex flex-col items-center">
                <div className="h-14 w-14 rounded-full bg-[#b9b9b9] shadow-sm" />

                <span className="mt-3 text-xs text-[#66675f]">
                  Inox
                </span>
              </div>
            </div>

            {/* Separador */}
            <div className="mx-auto mt-10 h-px max-w-xs bg-[#eeeae2]" />

            {/* Texto final */}
            <p className="mx-auto mt-8 max-w-lg text-center text-xs leading-6 text-[#89877f]">
              Para facilitar, deixamos em cada item um link com uma opção que nós mesmos selecionamos. 
              Mas fique à vontade para comprar onde preferir, o importante para nós é o carinho em fazer parte desse momento.
            </p>
          </div>
        </div>

        {/* Botões */}
        <div className="mt-10 grid gap-3 sm:grid-cols-2 md:mt-12">
          <button
            type="button"
            onClick={onVoltar}
            className="w-full rounded-full border border-[#b7b5ad] bg-transparent px-6 py-3.5 text-sm font-medium text-[#55564f] transition duration-200 hover:bg-white"
          >
            Voltar
          </button>

          <button
            type="button"
            onClick={onAcessarPresentes}
            className="w-full rounded-full bg-[#536447] px-6 py-3.5 text-sm font-medium text-white shadow-sm transition duration-200 hover:bg-[#435238] hover:shadow-md"
          >
            Acessar lista de presentes
          </button>
        </div>

        {/* Rodapé */}
        <p className="mt-8 text-center text-xs tracking-wide text-[#aaa69c]">
          Nicolle & Mateus
        </p>
      </div>
    </main>
  );
}