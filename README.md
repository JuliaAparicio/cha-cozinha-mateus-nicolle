# 💍 Chá de Cozinha — Nicolle & Mateus

Site desenvolvido para o Chá de Cozinha de Nicolle e Mateus, com uma experiência digital completa para convidados, confirmação de presença e gerenciamento da lista de presentes.

O projeto foi desenvolvido com foco em uma interface elegante, responsiva e intuitiva, além da integração com Firebase para gerenciamento dos dados e reservas de presentes.

---

## ✨ Sobre o projeto

O objetivo do projeto foi desenvolver uma aplicação web para centralizar as informações do evento e facilitar a interação dos convidados.

A aplicação permite que o convidado:

- 💌 Acesse as informações do evento
- 📅 Consulte data, horário e local
- 📍 Acesse a localização pelo Google Maps ou Waze
- 👤 Crie uma conta utilizando e-mail e senha
- ✅ Confirme sua presença
- 👥 Informe acompanhantes
- 🎁 Visualize a lista de presentes
- 🔒 Reserve um presente
- 🛒 Acesse diretamente o link de compra
- 🔄 Consulte seus presentes reservados

Além da área dos convidados, o projeto possui uma área administrativa para gerenciamento das informações do evento.

---

## 🎨 Design

A interface foi desenvolvida seguindo uma identidade visual elegante e minimalista, utilizando:

- Verde oliva
- Tons off-white
- Dourado
- Tipografia sofisticada
- Elementos inspirados em folhas e natureza

O layout foi desenvolvido com abordagem **mobile-first**, garantindo uma experiência adequada em diferentes tamanhos de tela.

---

## 🚀 Funcionalidades

### 👰 Área do convidado

- Tela de introdução
- Informações do evento
- Confirmação de presença
- Cadastro de acompanhantes
- Lista de presentes
- Detalhes dos presentes
- Reserva de presentes
- Controle de presentes já reservados
- Acesso ao link de compra
- Identificação das reservas do próprio usuário

### 🎁 Sistema de reservas

O sistema utiliza o Firebase para controlar a disponibilidade dos presentes.

Quando um convidado reserva um presente:

1. O presente é identificado pelo seu ID.
2. O sistema verifica se ele ainda está disponível.
3. A reserva é registrada.
4. O presente passa a ser marcado como reservado.
5. O link de compra correspondente é disponibilizado ao convidado.

O processo utiliza transações no Firestore para evitar conflitos entre reservas simultâneas.

### 🔐 Autenticação

A aplicação utiliza **Firebase Authentication** com autenticação por:

- E-mail
- Senha

Cada convidado possui um identificador próprio, permitindo relacionar sua confirmação de presença e suas reservas.

### 🛠️ Área administrativa

O projeto também possui uma área administrativa com:

- Login administrativo
- Consulta dos convidados
- Consulta dos presentes
- Visualização das reservas
- Exportação das informações para Excel

---

## 🧩 Tecnologias utilizadas

### Front-end

- Next.js
- React
- TypeScript
- Tailwind CSS
- HTML5
- CSS3

### Back-end / Serviços

- Firebase Authentication
- Firebase Firestore
- Firebase Admin SDK
- API Routes do Next.js

### Ferramentas

- Git
- GitHub
- Figma
- Visual Studio Code
- npm

---

## 📁 Estrutura do projeto

```text
cha-cozinha-mateus-nicolle/
│
├── app/
│   ├── admin/
│   │   └── page.tsx
│   │
│   ├── api/
│   │   ├── admin/
│   │   └── reservar/
│   │
│   ├── componentes/
│   │   ├── AcessoPage.tsx
│   │   ├── ConfirmacaoPage.tsx
│   │   ├── EventoPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── IntroducaoPresentesPage.tsx
│   │   ├── PresenteModal.tsx
│   │   ├── PresentesPage.tsx
│   │   └── SucessoPage.tsx
│   │
│   ├── lib/
│   │   ├── configurarPresentes.ts
│   │   ├── convidados.ts
│   │   ├── firebase.ts
│   │   └── presentes.ts
│   │
│   ├── data/
│   ├── types/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── public/
│   ├── foto casal/
│   └── presentes/
│
├── scripts/
│   ├── atualizar-imagens.js
│   └── importar-presentes.js
│
├── package.json
└── README.md
