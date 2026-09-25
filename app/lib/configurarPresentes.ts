import {
  collection,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { db } from "./firebase";

import { presentes } from "../data/presentes";

export async function configurarPresentes() {
  for (const presente of presentes) {
    const presenteId = String(presente.id);

    const presenteRef = doc(
      db,
      "presentes",
      presenteId
    );

    const presenteExistente = await getDoc(presenteRef);

    if (!presenteExistente.exists()) {
      await setDoc(presenteRef, {
        nome: presente.nome,
        imagem: presente.imagem,
        linkCompra: presente.linkCompra,
        reservado: false,
      });
    }
  }
}