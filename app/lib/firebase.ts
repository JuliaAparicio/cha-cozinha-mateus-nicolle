import {
  getApps,
  initializeApp,
} from "firebase/app";

import {
  getAuth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import {
  getFirestore,
} from "firebase/firestore";


const firebaseConfig = {
  apiKey:
    "AIzaSyApSi86ADSE-W-6uuZPE7nWVEWSd52bT1g",

  authDomain:
    "cha-de-cozinha-nicolle-mateus.firebaseapp.com",

  projectId:
    "cha-de-cozinha-nicolle-mateus",

  storageBucket:
    "cha-de-cozinha-nicolle-mateus.firebasestorage.app",

  messagingSenderId:
    "324768005173",

  appId:
    "1:324768005173:web:e7ac369eaee5fbc89d057c",
};


const app =
  getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApps()[0];


export const db =
  getFirestore(app);


export const auth =
  getAuth(app);


/*
 * ============================================================
 * AUTENTICAÇÃO ANÔNIMA
 * ============================================================
 *
 * Temporariamente mantida porque o sistema atual
 * de convidados e reservas ainda utiliza essa função.
 */

export async function entrarComoConvidado() {

  if (auth.currentUser) {
    return auth.currentUser;
  }

  const resultado =
    await signInAnonymously(auth);

  return resultado.user;
}


/*
 * ============================================================
 * CRIAR CONTA COM E-MAIL E SENHA
 * ============================================================
 */

export async function criarConta(
  email: string,
  senha: string
) {

  const resultado =
    await createUserWithEmailAndPassword(
      auth,
      email,
      senha
    );

  return resultado.user;
}


/*
 * ============================================================
 * ENTRAR COM E-MAIL E SENHA
 * ============================================================
 */

export async function entrarComEmail(
  email: string,
  senha: string
) {

  const resultado =
    await signInWithEmailAndPassword(
      auth,
      email,
      senha
    );

  return resultado.user;
}