const path = require("path");

const {
  initializeApp,
  cert,
} = require("firebase-admin/app");

const {
  getFirestore,
} = require("firebase-admin/firestore");

const caminhoDaChave = path.join(
  process.cwd(),
  "firebase-service-account.json"
);

const serviceAccount = require(
  caminhoDaChave
);

initializeApp({
  credential: cert(
    serviceAccount
  ),
});

const db = getFirestore();

const atualizacoes = [
  {
    id: "37",
    imagem:
      "/presentes/jarra-vidro.png",
  },
  {
    id: "83",
    imagem:
      "/presentes/quadro-palmeiras.png",
  },
  {
    id: "84",
    imagem:
      "/presentes/porta-chave-palmeiras.png",
  },
];

async function atualizarImagens() {
  console.log("");
  console.log(
    "=============================================="
  );
  console.log(
    " ATUALIZAÇÃO DAS IMAGENS DOS PRESENTES"
  );
  console.log(
    "=============================================="
  );
  console.log("");

  for (const presente of atualizacoes) {
    const referencia = db
      .collection("presentes")
      .doc(presente.id);

    const snapshot =
      await referencia.get();

    if (!snapshot.exists) {
      console.log(
        `ERRO: Presente ${presente.id} não encontrado.`
      );

      continue;
    }

    await referencia.set(
      {
        imagem:
          presente.imagem,
      },
      {
        merge: true,
      }
    );

    console.log(
      `Presente ${presente.id} atualizado: ${presente.imagem}`
    );
  }

  console.log("");
  console.log(
    "ATUALIZAÇÃO CONCLUÍDA!"
  );
  console.log("");
  console.log(
    "Somente o campo imagem foi alterado."
  );
  console.log(
    "Nenhuma reserva foi alterada."
  );
  console.log(
    "=============================================="
  );
  console.log("");
}

atualizarImagens().catch(
  (erro) => {
    console.error("");
    console.error(
      "ERRO DURANTE A ATUALIZAÇÃO:"
    );
    console.error(erro);
    console.error("");
    process.exit(1);
  }
);