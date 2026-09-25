import {
  collection,
  doc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from "firebase/firestore";

import {
  auth,
  db,
} from "./firebase";

export type Presente = {
  id: string;
  nome: string;
  descricao: string;
  imagem: string;
  cor: string;
  observacao: string;
  linkCompra: string;
  reservado: boolean;
};

export type ReservaPresente = {
  presenteId: string;
  uid: string;
  reservadoEm?: unknown;
};

/*
 * ============================================================
 * BUSCAR TODOS OS PRESENTES DO FIRESTORE
 * ============================================================
 */

export async function buscarPresentes(): Promise<
  Presente[]
> {
  const snapshot =
    await getDocs(
      collection(
        db,
        "presentes"
      )
    );

  const presentes: Presente[] =
    [];

  snapshot.forEach(
    (documento) => {
      const dados =
        documento.data();

      presentes.push({
        id: documento.id,
        nome: dados.nome ?? "",
        descricao:
          dados.descricao ?? "",
        imagem:
          dados.imagem ?? "",
        cor: dados.cor ?? "",
        observacao:
          dados.observacao ?? "",
        linkCompra:
          dados.linkCompra ?? "",
        reservado:
          dados.reservado === true,
      });
    }
  );

  /*
   * Mantém os presentes na ordem:
   * 1, 2, 3, 4... 84
   */

  presentes.sort(
    (a, b) =>
      Number(a.id) -
      Number(b.id)
  );

  return presentes;
}

/*
 * ============================================================
 * BUSCAR RESERVAS DOS PRESENTES
 * ============================================================
 */

export async function buscarReservas() {
  const snapshot =
    await getDocs(
      collection(
        db,
        "presentes"
      )
    );

  const reservas: Record<
    string,
    ReservaPresente
  > = {};

  snapshot.forEach(
    (documento) => {
      const dados =
        documento.data();

      if (
        dados.reservado === true
      ) {
        reservas[documento.id] = {
          presenteId:
            documento.id,
          uid: "",
        };
      }
    }
  );

  return reservas;
}

/*
 * ============================================================
 * BUSCAR RESERVAS DO USUÁRIO
 * ============================================================
 */

export async function buscarMinhasReservas() {
  const usuario =
    auth.currentUser;

  if (
    !usuario ||
    usuario.isAnonymous
  ) {
    return {};
  }

  const reservasQuery =
    query(
      collection(
        db,
        "reservas"
      ),
      where(
        "uid",
        "==",
        usuario.uid
      )
    );

  const snapshot =
    await getDocs(
      reservasQuery
    );

  const minhasReservas:
    Record<
      string,
      ReservaPresente
    > = {};

  snapshot.forEach(
    (documento) => {
      const dados =
        documento.data();

      minhasReservas[
        documento.id
      ] = {
        presenteId:
          dados.presenteId,
        uid: dados.uid,
        reservadoEm:
          dados.reservadoEm,
      };
    }
  );

  return minhasReservas;
}

/*
 * ============================================================
 * RESERVAR PRESENTE
 * ============================================================
 */

export async function reservarPresente(
  presenteId: string
) {
  const usuario =
    auth.currentUser;

  if (
    !usuario ||
    usuario.isAnonymous
  ) {
    throw new Error(
      "USUARIO_NAO_AUTENTICADO"
    );
  }

  const presenteRef =
    doc(
      db,
      "presentes",
      presenteId
    );

  const reservaRef =
    doc(
      db,
      "reservas",
      presenteId
    );

  await runTransaction(
    db,
    async (transaction) => {
      const presenteSnapshot =
        await transaction.get(
          presenteRef
        );

      if (
        !presenteSnapshot.exists()
      ) {
        throw new Error(
          "PRESENTE_NAO_EXISTE"
        );
      }

      const presente =
        presenteSnapshot.data();

      if (
        presente.reservado === true
      ) {
        throw new Error(
          "PRESENTE_JA_RESERVADO"
        );
      }

      transaction.update(
        presenteRef,
        {
          reservado: true,
        }
      );

      transaction.set(
        reservaRef,
        {
          uid: usuario.uid,
          presenteId,
          reservadoEm:
            serverTimestamp(),
        }
      );
    }
  );

  return {
    presenteId,
    uid: usuario.uid,
  };
}