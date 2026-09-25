import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  auth,
  db,
} from "./firebase";


export type DadosConvidado = {
  nome: string;
  quantidade: number;
  acompanhantes: string[];
};


export async function salvarConvidado(
  dados: DadosConvidado
) {
  const usuario =
    auth.currentUser;


  if (!usuario) {
    throw new Error(
      "USUARIO_NAO_AUTENTICADO"
    );
  }


  // Verifica se este usuário já confirmou presença
  const consulta = query(
    collection(db, "convidados"),
    where(
      "uid",
      "==",
      usuario.uid
    )
  );


  const resultado =
    await getDocs(consulta);


  // Se já existe cadastro, não cria outro
  if (!resultado.empty) {
    return resultado.docs[0].id;
  }


  const convidado = {
    nome: dados.nome.trim(),

    quantidade:
      dados.quantidade,

    acompanhantes:
      dados.acompanhantes
        .map((nome) =>
          nome.trim()
        )
        .filter(Boolean),

    uid: usuario.uid,

    criadoEm:
      serverTimestamp(),
  };


  const documento =
    await addDoc(
      collection(
        db,
        "convidados"
      ),
      convidado
    );


  return documento.id;
}