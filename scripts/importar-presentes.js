/**
 * Importação segura dos presentes para o Firestore.
 *
 * IMPORTANTE:
 * - Não apaga documentos existentes.
 * - Não apaga reservas.
 * - Se um presente já existir, atualiza os dados abaixo usando merge.
 * - O campo "reservado" NÃO é alterado em documentos existentes.
 * - Para um presente novo, "reservado" começa como false.
 *
 * Execute na raiz do projeto:
 *   node scripts/importar-presentes.js
 */

const fs = require("fs");
const path = require("path");

const {
  cert,
  getApps,
  initializeApp,
} = require("firebase-admin/app");

const {
  getFirestore,
} = require("firebase-admin/firestore");

function obterFirebaseAdmin() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const caminhoDaChave = path.join(
    process.cwd(),
    "firebase-service-account.json"
  );

  if (!fs.existsSync(caminhoDaChave)) {
    throw new Error(
      "firebase-service-account.json não foi encontrado na raiz do projeto."
    );
  }

  const serviceAccount = JSON.parse(
    fs.readFileSync(caminhoDaChave, "utf-8")
  );

  return initializeApp({
    credential: cert(serviceAccount),
  });
}

const app = obterFirebaseAdmin();
const db = getFirestore(app);

const presentes = [
  {
    "id": "1",
    "nome": "Afiador de Facas",
    "descricao": "Afiador de facas para a cozinha.",
    "imagem": "/presentes/afiador-facas.jpeg",
    "cor": "Preto",
    "observacao": "Escolher na cor preta.",
    "linkCompra": "https://www.havan.com.br/afiador-de-facas-havan-casa-21-5cm-preto/p"
  },
  {
    "id": "2",
    "nome": "Kit Formas Assadeiras Antiaderente",
    "descricao": "Kit de formas e assadeiras.",
    "imagem": "/presentes/formas.jpeg",
    "cor": "Preto",
    "observacao": "Preferencialmente na cor preta.",
    "linkCompra": "https://shopee.com.br/Kit-2-Formas-Assadeira-Antiaderente-32-e-37cm-Forma-Bolo-Furo-Central-24cm-De-A%C3%A7o-Carbono-Teflon-i.561341313.22099317741?extraParams=%7B%22display_model_id%22%3A199185044392%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "3",
    "nome": "Jogo de Bowls Inox 5 Peças",
    "descricao": "Jogo com 5 bowls de inox.",
    "imagem": "/presentes/bowls.jpeg",
    "cor": "Inox",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/product/1453167610/58213124072?gads_t_sig=gqRjZGVrxHCFomtpsTE0MjUxOnRzc19zZGtfa2V5omt20QACpGFsZ2_SAAAAZKNkZWvAomN0xEAAAAAMaaRlZwa4TmRr35EbRKe45opqqWzquDpxLoPl6a_nP90XlrFndAmj-Eti4LViLnnfxaArnW_92wfHWioVqmNpcGhlcnRleHTEdAAAAAyqAGk1Ck1_pYjyu1qlWONYqaDOYwwISmc6ncnZcBaLUhJ2ASor9B6PZLrO9ZUl9iz0hhnB-ifiecv4kjYFkJqXs8sNPCe5yyqQg81c4B5DKpbU4Jdug9_FxhlmQYJS6Lpaim-E0hTDaX5JKlV6EGpJ&gad_source=4&gad_campaignid=23353217471&gbraid=0AAAAACoEtRk0mzWNtW_6QnFZy6OH7vMgx&gclid=EAIaIQobChMI24mOjb3ElgMVBUZIAB1AxxbaEAQYCCABEgIUEvD_BwE"
  },
  {
    "id": "4",
    "nome": "Batedor manual/fouet",
    "descricao": "Batedor manual para preparos na cozinha.",
    "imagem": "/presentes/fouet.jpeg",
    "cor": "Madeira e Preto",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Batedor-de-Ovos-Fouet-em-Nylon-com-Cabo-em-A%C3%A7o-Inox-30-5cm-para-Misturar-e-Bater-Massas-i.1758121290.58213923619?extraParams=%7B%22display_model_id%22%3A229449018544%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "5",
    "nome": "Centrífuga de salada",
    "descricao": "Centrífuga para lavar e secar saladas.",
    "imagem": "/presentes/centrifuga.jpeg",
    "cor": "Preto",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/product/849977839/20597797252?gads_t_sig=gqRjZGVrxHCFomtpsTE0MjUxOnRzc19zZGtfa2V5omt20QACpGFsZ2_SAAAAZKNkZWvAomN0xEAAAAAMaaRlZwa4TmRr35EbRKe45opqqWzquDpxLoPl6a_nP90XlrFndAmj-Eti4LViLnnfxaArnW_92wfHWioVqmNpcGhlcnRleHTEcgAAAAzE3A9HUOH_rrud62yHt3r06krV7e6Bu_iMPtbHO8yb6mPT0ghcQpsq6gq4Hrk1wbrYIoBU3-tWSnvoytVsRo8btDrR_ZuubmDBMhJjt5MM4qce1gd_rOFroGhhPo2Ygk0BU5YENKXO1GszvF4mVQ&gad_source=4&gad_campaignid=23353217471&gbraid=0AAAAACoEtRk0mzWNtW_6QnFZy6OH7vMgx&gclid=EAIaIQobChMInZHamr_ElgMVX0NIAB3iswEKEAQYBiABEgKtxfD_BwE"
  },
  {
    "id": "6",
    "nome": "Coador Filtro De Café Inox - P",
    "descricao": "Coador de café em inox.",
    "imagem": "/presentes/coador.jpeg",
    "cor": "Inox",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Coador-Filtro-De-Caf%C3%A9-Inox-600-Grades-De-Filtro-Reutiliz%C3%A1vel-Grande-Sem-Uso-De-Papel-i.1005725674.58262857577?extraParams=%7B%22display_model_id%22%3A238808593256%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "7",
    "nome": "Medidores - Colher e Xícara",
    "descricao": "",
    "imagem": "/presentes/Medidores colheres e xicaras.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://www.mercadolivre.com.br/kit-medidores-culinario-colheres-medidoras-xicaras-medidas-10-pecas-para-medir-ingredientes-receitas-we-varejo/p/MLB76226672#polycard_client=search-desktop&be_origin=backend&overlay_label=not_apply&search_layout=grid&position=8&type=product&tracking_id=f0b39ed6-9e5f-437b-8b0a-78062c0abee4&wid=MLB5326459878&sid=search"
  },
  {
    "id": "8",
    "nome": "Kit Utensílios de Silicone - cozinhar",
    "descricao": "",
    "imagem": "/presentes/Kit Utensílios de Silicone - cozinhar.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Kit-Utens%C3%ADlios-de-Silicone-Inteiri%C3%A7o-9-Pe%C3%A7as-Suporte-Em-A%C3%A7o-Inox-Preto-para-Cozinha-Linha-Premium-Escumadeira-Espatula-i.648891786.22593518475?extraParams=%7B%22display_model_id%22%3A238775659807%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "9",
    "nome": "Kit Utensílios para servir",
    "descricao": "",
    "imagem": "/presentes/Kit Utensílios para servir.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Kit-5-Utens%C3%ADlios-de-Cozinha-em-A%C3%A7o-Inox-Polido-%E2%80%93-Concha-Colher-Escumadeira-Esp%C3%A1tula-Vazada-e-Pegador-de-Massa-i.479252498.23498729610?extraParams=%7B%22display_model_id%22%3A239426791947%2C%22model_selection_logic%22%3A3%7D&rModelId=239426791947&vItemId=58206137318&vModelId=209618959981&vShopId=1665239494"
  },
  {
    "id": "10",
    "nome": "Pegador de Sorvete",
    "descricao": "",
    "imagem": "/presentes/Pegador de Sorvete.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://www.mercadolivre.com.br/colher-concha-pegador-sorvete-inox-bola-ejetor-profissional/p/MLB26518510#polycard_client=search-desktop&be_origin=backend&overlay_label=not_apply&search_layout=grid&position=5&type=product&tracking_id=c907f8f6-f705-4a59-81b3-0865fc148f2c&wid=MLB3904311879&sid=search"
  },
  {
    "id": "11",
    "nome": "Copo medidor de vidro",
    "descricao": "",
    "imagem": "/presentes/Copo medidor de vidro.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://www.mercadolivre.com.br/copo-de-vidro-medidor-do-chef-preparo-receitas-415ml-ruvolo/p/MLB36596530#polycard_client=search-desktop&be_origin=backend&overlay_label=not_apply&search_layout=grid&position=5&type=product&tracking_id=7b53b759-2596-4888-8662-f50d415e9c1a&wid=MLB5550654300&sid=search"
  },
  {
    "id": "12",
    "nome": "Cortador de Pizza + Espatula Dupla",
    "descricao": "",
    "imagem": "/presentes/Cortador de Pizza + Espatula Dupla.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://www.mercadolivre.com.br/cortador-de-pizza-carretilha--espatula-dupla-inox-kit/up/MLBU4934089850?pdp_filters=item_id:MLB7500528044#is_advertising=true&searchVariation=MLBU4934089850&backend_model=search-backend&be_origin=backend&position=1&search_layout=grid&type=pad&tracking_id=e962ed87-bc15-48cf-9eee-ac1d30be7518&ad_domain=VQCATCORE_LST&ad_position=1&ad_click_id=OGZkYjFjNzktNjFlYy00ZjI5LWFjY2ItNzdkODQxOTU3ZjIy"
  },
  {
    "id": "13",
    "nome": "Kit de Facas",
    "descricao": "",
    "imagem": "/presentes/Kit de Facas.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Kit-5-Facas-De-Cozinha-Profissional-A%C3%A7o-Inox-Conjunto-Completo-Para-Cozinhar-i.1462021202.58256332891?extraParams=%7B%22display_model_id%22%3A199619100575%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "14",
    "nome": "Descascador",
    "descricao": "",
    "imagem": "/presentes/Descascador.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://www.mercadolivre.com.br/descascador-e-ralador-de-frutas-legumes-aco-inox-excelente/p/MLB29085762#polycard_client=search-desktop&be_origin=backend&overlay_label=not_apply&search_layout=grid&position=6&type=product&tracking_id=bb112c80-2b62-450a-92ca-febafc15fbc9&wid=MLB4227065387&sid=search"
  },
  {
    "id": "15",
    "nome": "Escorredor de Arroz + Massa",
    "descricao": "",
    "imagem": "/presentes/Escorredor de Arroz + Massa.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Kit-Conjunto-Escorredor-De-Massa-e-Macarr%C3%A3o-24cm-com-Al%C3%A7a-Lavador-de-Arroz-26cm-em-Inox-i.1785484295.58263382971?extraParams=%7B%22display_model_id%22%3A199623619220%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "16",
    "nome": "Escumadeira + Amassador de Batata",
    "descricao": "",
    "imagem": "/presentes/Escumadeira + Amassador de Batata.webp",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Kit-2-Utens%C3%ADlios-de-Cozinha-Inox-%E2%80%93-Escumadeira-de-Fritura-Amassador-de-Batata-i.446419842.23494373494?extraParams=%7B%22display_model_id%22%3A219611493645%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "17",
    "nome": "Espremedor de Alho + Espremedor de Limão",
    "descricao": "",
    "imagem": "/presentes/Espremedor de Alho + Espremedor de Limão.webp",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Kit-Espremedor-De-Lim%C3%A3o-E-Alho-Alum%C3%ADnio-Fundido-Color-Cozinha-i.858348018.23718000459?extraParams=%7B%22display_model_id%22%3A213715048370%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "18",
    "nome": "Forma de Gelo Manual",
    "descricao": "",
    "imagem": "/presentes/Forma de Gelo Manual.webp",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Forma-de-Gelo-Manual-com-Coletor-e-Tampa-F%C3%A1cil-de-Desenformar-Grande-Capacidade-i.1171546418.58265124713?extraParams=%7B%22display_model_id%22%3A189624830906%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "19",
    "nome": "Kit Formas Redondas Fundo Removível",
    "descricao": "",
    "imagem": "/presentes/Kit Formas Redondas Fundo Removível.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Conjunto-3-Formas-Redondas-Fundo-Remov%C3%ADvel-Fundo-Falso-Antiaderente-Teflon-Para-Tortas-Bolos-i.774811634.22993935504?extraParams=%7B%22display_model_id%22%3A219174303437%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "20",
    "nome": "Panela Banho Maria 3 Em 1 Preta",
    "descricao": "",
    "imagem": "/presentes/Panela Banho Maria 3 Em 1 Preta.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://www.mercadolivre.com.br/panela-banho-maria-3-em-1-preta-cuscuzeira-forma-para-pudim/up/MLBU733574058#polycard_client=search-desktop&be_origin=backend&overlay_label=not_apply&search_layout=grid&position=6&type=product&tracking_id=ea5a0903-e258-452a-b3b4-17c3e232d59d&wid=MLB1600453959&sid=search"
  },
  {
    "id": "21",
    "nome": "Funil em aço inox",
    "descricao": "",
    "imagem": "/presentes/Funil em aço inox.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://www.mercadolivre.com.br/funil-de-cozinha-em-aco-inox-12-cm-com-alca-para-oleo-e-liquidos/p/MLB66483827?pdp_filters=item_id:MLB6490712562#is_advertising=true&searchVariation=MLB66483827&backend_model=search-backend&be_origin=backend&position=2&search_layout=grid&type=pad&tracking_id=d516cd52-b283-4ffe-9e81-eb732a112770&ad_domain=VQCATCORE_LST&ad_position=2&ad_click_id=N2ZjNjljZTctNDkyMy00Zjg2LWI1MDQtMmQ1ZTVhOTVhYjE5"
  },
  {
    "id": "22",
    "nome": "Leiteira",
    "descricao": "",
    "imagem": "/presentes/Leiteira.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Jarra-Leiteira-De-Vidro-Borossilicato-L%C3%B3tus-300ml-Hauskraft-Para-Caf%C3%A9-e-Mesa-Posta-i.1788001787.58260452653?extraParams=%7B%22display_model_id%22%3A159554177048%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "23",
    "nome": "Luva Termica",
    "descricao": "",
    "imagem": "/presentes/Luva Termica.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Kit-2-Luvas-e-Descanso-de-Panela-Para-Cozinha-T%C3%A9rmica-Forno-Altas-Temperaturas-Forrada-At%C3%A9-300%C2%B0C-i.1506325632.58251144267?extraParams=%7B%22display_model_id%22%3A119729168409%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "24",
    "nome": "Mantegueira",
    "descricao": "",
    "imagem": "/presentes/Mantegueira.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Manteigueira-de-Bambu-com-Tampa-de-Acr%C3%ADlico-Alimentos-Cozinha-casa-mesa-Casa-Armazenamento-Giotto-i.570523049.22294904044?extraParams=%7B%22display_model_id%22%3A179414198854%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "25",
    "nome": "Martelo de Carne",
    "descricao": "",
    "imagem": "/presentes/Martelo de Carne.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Martelo-Amaciador-De-Carne-Para-Cozinha-Color-i.303933654.9357182497?extraParams=%7B%22display_model_id%22%3A65518418626%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "26",
    "nome": "Moedor de Pimenta e Sal",
    "descricao": "",
    "imagem": "/presentes/Moedor de Pimenta e Sal.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Kit-2-Moedor-Triturador-De-Pimenta-Sal-Grosso-Temperos-Em-Acr%C3%ADlico-Moinho-Cer%C3%A2mica-i.395567707.22497644500?extraParams=%7B%22display_model_id%22%3A209596775615%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "27",
    "nome": "Kit Pegadores",
    "descricao": "",
    "imagem": "/presentes/Kit Pegadores.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Utens%C3%ADlios-para-Cozinha-em-Geral-Pegador-de-Macarr%C3%A3o-Alimentos-Churrasco-Salada-Inox-Pin%C3%A7a-Culin%C3%A1ria-i.335282828.20999358094?extraParams=%7B%22display_model_id%22%3A199597872984%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "28",
    "nome": "Kit peneiras",
    "descricao": "",
    "imagem": "/presentes/Kit peneiras.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/3-Pp%C3%A7s-Peneira-Coador-Em-A%C3%A7o-Inox-Para-Cozinha-3-Tamanhos-P-M-G-8-10-12CM-i.569114904.23696140955?extraParams=%7B%22display_model_id%22%3A239376055062%2C%22model_selection_logic%22%3A3%7D&rModelId=239376055062&vItemId=58253313472&vModelId=189616900530&vShopId=1665239494"
  },
  {
    "id": "29",
    "nome": "Coador de Café",
    "descricao": "",
    "imagem": "/presentes/Coador de Café.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://www.mercadolivre.com.br/filtro-permanente-cafe-103-aco-inox-reutilizavel-coador-universal-malha-fina-lavavel-sem-papel-alta-durabilidade-premium/p/MLB75840803#polycard_client=search-desktop&be_origin=backend&overlay_label=not_apply&search_layout=grid&position=10&type=product&tracking_id=36e67f36-9355-4056-a96a-7dc08dac7d92&wid=MLB7285177840&sid=search"
  },
  {
    "id": "30",
    "nome": "Porta Frios",
    "descricao": "",
    "imagem": "/presentes/Porta Frios.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Porta-Frios-para-Geladeira-Empilh%C3%A1vel-Acr%C3%ADlico-Transparente-Tampa-Herm%C3%A9tica-p-Queijo-Presunto-Salame-%E2%80%93-Escolha-o-Kit-i.1453409895.22698343702?extraParams=%7B%22display_model_id%22%3A239418827406%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "31",
    "nome": "Rolo de abrir massa",
    "descricao": "",
    "imagem": "/presentes/Rolo de abrir massa.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Rolo-de-madeira-para-abrir-massa-de-pizza-p%C3%A3o-pastelaria-e-cilindro-de-Mattarello-i.1667498230.48764975899?extraParams=%7B%22display_model_id%22%3A351284076848%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "32",
    "nome": "Kit duas tábuas de corte",
    "descricao": "",
    "imagem": "/presentes/Kit duas tábuas de corte.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Kit-2-T%C3%A1buas-de-Churrasco-em-Madeira-Ideal-para-Cortar-Servir-Carnes-e-Petiscos-i.243982443.18998302160?extraParams=%7B%22display_model_id%22%3A109870079245%2C%22model_selection_logic%22%3A3%7D&rModelId=109870079245&vItemId=58256127692&vModelId=229438780839&vShopId=1665239494"
  },
  {
    "id": "33",
    "nome": "Tesoura de Cozinha",
    "descricao": "",
    "imagem": "/presentes/Tesoura de Cozinha.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://www.mercadolivre.com.br/tesoura-cozinha-multifuncional-para-cortar-frango-carne-peixe-legumes-aco-inoxidavel-resistente-tesoura-para-churrasco-efigen/p/MLB56448991#polycard_client=search-desktop&be_origin=backend&overlay_label=not_apply&search_layout=grid&position=9&type=product&tracking_id=6296dbd1-a36f-4823-b552-0330fd2e317c&wid=MLB5717442778&sid=search"
  },
  {
    "id": "34",
    "nome": "Saleiro e Açucareiro",
    "descricao": "",
    "imagem": "/presentes/Saleiro e Açucareiro.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/A%C3%A7ucareiro-e-Saleiro-de-Cozinha-Vidro-300ml-c-Adesivos-e-Colher-Bambu-Herm%C3%A9tico-i.391703320.55065097745?extraParams=%7B%22display_model_id%22%3A346295083193%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "35",
    "nome": "Taça de Refrigerante",
    "descricao": "",
    "imagem": "/presentes/Taça de Refrigerante.webp",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Jogo-6-Ta%C3%A7as-Diamond-340ml-Transparente-Fum%C3%AA-Azul-Sofisticado-Resistente-Mesa-Posta-Luxo-i.544625199.53515363484?extraParams=%7B%22display_model_id%22%3A311316951343%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "36",
    "nome": "Kit 2 Garrafas de Vidro 1L Água Geladeira",
    "descricao": "",
    "imagem": "/presentes/Kit 2 Garrafas de Vidro 1L Água Geladeira.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Kit-2-Garrafas-de-Vidro-1L-%C3%81gua-Geladeira-Tampa-Inox-Canelada-Scotch-Filete-Quadrada-Herm%C3%A9tica-i.1593863526.46006367449?extraParams=%7B%22display_model_id%22%3A330573716296%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "37",
    "nome": "Jarra de Vidro",
    "descricao": "",
    "imagem": "/presentes/placeholder-presente.svg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Jarra-de-%C3%81gua-de-Vidro-1-9L-Tampa-Inox-Elegante-para-Servir-Sucos-e-Bebidas-Geladas-i.1344056234.54362680201?extraParams=%7B%22display_model_id%22%3A436100958668%2C%22model_selection_logic%22%3A3%7D&sp_atk=36f49e99-9554-4f60-a3e2-ed8e0a151083&xptdk=36f49e99-9554-4f60-a3e2-ed8e0a151083"
  },
  {
    "id": "38",
    "nome": "Porta Palitos de dentes",
    "descricao": "",
    "imagem": "/presentes/Porta Palitos de dentes.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://www.mercadolivre.com.br/ay-dispensador-automatico-de-palillos-higienico-milky-white/p/MLB2105530910#polycard_client=search-desktop&be_origin=backend&overlay_label=not_apply&search_layout=grid&position=38&type=product&tracking_id=14f36fe4-47b5-47c1-a059-cbdb769a3f0f&wid=MLB4968981661&sid=search"
  },
  {
    "id": "39",
    "nome": "Descanso Panela Silicone",
    "descricao": "",
    "imagem": "/presentes/Descanso Panela Silicone.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://www.mercadolivre.com.br/descanso-panela-silicone-fogao-inducao-almofada-protetora-cooktop-4un-sortido/p/MLB75494154?pdp_filters=item_id:MLB7175605578#is_advertising=true&searchVariation=MLB75494154&backend_model=search-backend&be_origin=backend&position=1&search_layout=grid&type=pad&tracking_id=931c0fd7-527c-4d2f-b7e1-1ce9782ee57e&ad_domain=VQCATCORE_LST&ad_position=1&ad_click_id=ZjA5MGU3MTItMDFhYy00ZTQwLWEwMTQtMTIyODQ1OTlmYzZm"
  },
  {
    "id": "40",
    "nome": "Bule",
    "descricao": "",
    "imagem": "/presentes/Bule.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Bule-Preto-N%C2%B0-10-12-Alum%C3%ADnio-Grosso-de-%C3%93tima-Qualidade-i.386982412.58212656591?extraParams=%7B%22display_model_id%22%3A238808424996%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "41",
    "nome": "Lixeira Inox Preta Banheiro - 3L",
    "descricao": "",
    "imagem": "/presentes/Lixeira Inox Preta Banheiro - 3L.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Lixeira-em-Inox-3-ou-5-Litros-Banheiro-Cmm-Pedal-Preta-Branca-ou-Cinza-i.312346174.49665511212?extraParams=%7B%22display_model_id%22%3A311325971664%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "42",
    "nome": "Escova Sanitária Preta",
    "descricao": "",
    "imagem": "/presentes/Escova Sanitária Preta.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Escova-Sanit%C3%A1ria-Serene-Preta-Coza-i.300321309.44961212565?extraParams=%7B%22display_model_id%22%3A391008572111%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "43",
    "nome": "Rodinho de Pia",
    "descricao": "",
    "imagem": "/presentes/Rodinho de Pia.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Rodo-de-Pia-Dobr%C3%A1vel-em-Silicone-com-Cabo-de-Bambu-Ecol%C3%B3gico-Limpa-Diversas-Superf%C3%ADcies-Preto-Branco-i.1828711354.58213869423?extraParams=%7B%22display_model_id%22%3A189191515086%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "44",
    "nome": "Vassoura de Pelo",
    "descricao": "",
    "imagem": "/presentes/Vassoura de Pelo.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Vassoura-Ultra-Pelo-N%C3%A3o-Risca-Porcelanato-com-Cabo-Limpeza-Profissional-i.1542363521.58209984578?extraParams=%7B%22display_model_id%22%3A189188972365%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "45",
    "nome": "Rodo de silicone",
    "descricao": "",
    "imagem": "/presentes/Rodo de silicone.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Rodo-de-Silicone-100cm-Multiuso-para-Piso-e-Vidro-Rodo-M%C3%A1gico-Limpeza-Seco-e-Molhado-i.1443730896.58265004561?extraParams=%7B%22display_model_id%22%3A149555880005%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "46",
    "nome": "Kit Lavabo Banheiro",
    "descricao": "",
    "imagem": "/presentes/Kit Lavabo Banheiro.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Kit-Lavabo-Banheiro-Luxo-Preto-Com-Bandeja-Vasinho-Vareta-de-Fibra-i.402622450.23197169529?extraParams=%7B%22display_model_id%22%3A179394183940%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "47",
    "nome": "Organizador Ármario de Cozinha",
    "descricao": "",
    "imagem": "/presentes/Organizador Ármario de Cozinha.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Organizador-Arm%C3%A1rio-De-Cozinha-Prateleira-Aramado-Cesto-6un-Preto-i.1297489044.18097837421?extraParams=%7B%22display_model_id%22%3A119720479937%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "48",
    "nome": "Cestos Organizadores",
    "descricao": "",
    "imagem": "/presentes/Cestos Organizadores.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Kit-4-Cestos-Organizadores-2-Litros-Multiuso-Cozinha-Sala-Banheiro-Arm%C3%A1rio-Gaveta-i.406061234.22097496181?extraParams=%7B%22display_model_id%22%3A169708281768%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "49",
    "nome": "Cesto Organizador de Guarda Roupas",
    "descricao": "",
    "imagem": "/presentes/Cesto Organizador de Guarda Roupas.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/KIT-2-3-4-5-Cesto-Organizador-de-Guarda-Roupas-Refor%C3%A7ado-Caixa-para-Armazenar-Multiuso-R%C3%ADgido-i.1857165783.58265761223?extraParams=%7B%22display_model_id%22%3A219192833298%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "50",
    "nome": "Kit 5 Potes Herméticos Lavanderia",
    "descricao": "",
    "imagem": "/presentes/Kit 5 Potes Herméticos Lavanderia.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Kit-5-Potes-Herm%C3%A9ticos-BPA-Free-com-Tampa-Medidora-2-5L-Cozinha-Lavanderia-Organizadores-Multiuso-i.1526859620.47912845338?extraParams=%7B%22display_model_id%22%3A376112326829%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "51",
    "nome": "Descanso de Talher",
    "descricao": "",
    "imagem": "/presentes/Descanso de Talher.webp",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Descanso-De-Utens%C3%ADlios-2-Em-1-Suporte-Para-Tampa-De-Panela-Colher-Esp%C3%A1tula-Organizador-De-Cozinha-i.346237504.49013472188?extraParams=%7B%22display_model_id%22%3A351165065378%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "52",
    "nome": "Taça de sobremesa",
    "descricao": "",
    "imagem": "/presentes/Taça de sobremesa.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://www.mercadolivre.com.br/jogo-de-sobremesa-taca-vidro-cameratta--6-unidades/up/MLBU4567069049?pdp_filters=item_id:MLB4993555145#is_advertising=true&searchVariation=MLBU4567069049&backend_model=search-backend&be_origin=backend&position=3&search_layout=grid&type=pad&tracking_id=12c1e687-d78b-4705-9a47-be79ba85980b&ad_domain=VQCATCORE_LST&ad_position=3&ad_click_id=ZDc5ODNjOWMtMmQ3Mi00Zjg2LWE2Y2YtY2FjNzhiMWZjOGZm"
  },
  {
    "id": "53",
    "nome": "Jogo Talheres Faqueiro",
    "descricao": "",
    "imagem": "/presentes/Jogo Talheres Faqueiro.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://www.mercadolivre.com.br/jogo-talheres-faqueiro-buzios-aco-inox-24-pecas-tramontina/p/MLB35092029?product_trigger_id=MLB40543601&picker=true&quantity=1"
  },
  {
    "id": "54",
    "nome": "Pratos de Vidro",
    "descricao": "",
    "imagem": "/presentes/Pratos de Vidro.webp",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://www.mercadolivre.com.br/kit-6-pratos-brancos-martelados-23cm-conjunto-de-louca-para-jantar-refeicao-mesa-posta-cozinha-casa-dia-a-dia-ocasioes-especiais-design-elegante-moderno-para-servir-6-unidades/p/MLB79121826#polycard_client=search-desktop&be_origin=backend&overlay_label=not_apply&search_layout=grid&position=55&type=product&tracking_id=64cc84f9-c420-4b01-8cb4-be34b4a13c9b&wid=MLB7618601348&sid=search"
  },
  {
    "id": "55",
    "nome": "Jogo de Xicaras",
    "descricao": "",
    "imagem": "/presentes/Jogo de Xicaras.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Jogo-de-X%C3%ADcaras-de-Caf%C3%A9-com-Pires-6-pe%C3%A7as-em-vidro-75ml-Transparente-Elegante.-i.386748835.58218197926?extraParams=%7B%22display_model_id%22%3A179419890805%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "56",
    "nome": "Kit Tapete para Banheiro",
    "descricao": "",
    "imagem": "/presentes/Kit Tapete para Banheiro.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/KIT-Tapete-para-Banheiro-3-Pe%C3%A7as-Pel%C3%BAcia-Algod%C3%A3o-Macio-Antiderrapante-GRAFITE-PRETO-i.759023627.23698706385?extraParams=%7B%22display_model_id%22%3A228787478508%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "57",
    "nome": "Balde Retrátil",
    "descricao": "",
    "imagem": "/presentes/Balde Retrátil.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Balde-Dobr%C3%A1vel-Retr%C3%A1til-5Lt-10Lt-Silicone-Pl%C3%A1stico-Camesa-Flex%C3%ADvel-Pr%C3%A1tico-com-Al%C3%A7a-Powermaid-Camesa-i.1278427063.58266250595?extraParams=%7B%22display_model_id%22%3A229448402345%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "58",
    "nome": "Bacia Retrátil",
    "descricao": "",
    "imagem": "/presentes/Bacia Retrátil.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Bacia-Dobr%C3%A1vel-Multiuso-8L-Compacta-com-Gancho-Vonder-i.333540705.23794008455?extraParams=%7B%22display_model_id%22%3A129650457138%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "59",
    "nome": "Fruteira de Mesa",
    "descricao": "",
    "imagem": "/presentes/Fruteira de Mesa.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://www.mercadolivre.com.br/fruteira-de-vidro-com-pe-ruvolo-32cm-redonda-porta-frutas-elegante-para-mesa-cozinha-casa-decoracao/p/MLB26145729#polycard_client=search-desktop&be_origin=backend&overlay_label=not_apply&search_layout=grid&position=6&type=product&tracking_id=45f45d01-aff9-478f-a779-b1107bfb6269&wid=MLB5448400300&sid=search"
  },
  {
    "id": "60",
    "nome": "Varal de Janela",
    "descricao": "",
    "imagem": "/presentes/Varal de Janela.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Varal-Port%C3%A1til-Para-Apartamento-Casa-De-Roupas-Pr%C3%A1tico-Retr%C3%A1til-Para-Janela-Parede-Pet-Util-i.532546866.47512706676?extraParams=%7B%22display_model_id%22%3A331203693322%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "61",
    "nome": "Cabides",
    "descricao": "",
    "imagem": "/presentes/Cabides.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Kit-com-25-Cabides-Aveludados-com-Gancho-360%C2%B0-Preto-i.1325915577.58217797523?extraParams=%7B%22display_model_id%22%3A239449865198%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "62",
    "nome": "Porta azeite e Vinagre",
    "descricao": "",
    "imagem": "/presentes/Porta azeite e Vinagre.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://www.mercadolivre.com.br/kit-2-borrifador-pulverizador-oleo-azeite-vinagre-vidro/up/MLBU4615191105?pdp_filters=item_id:MLB7358404756#is_advertising=true&searchVariation=MLBU4615191105&backend_model=search-backend&be_origin=backend&position=15&search_layout=grid&type=pad&tracking_id=980e526f-9e39-4a98-912f-00e8f8fb4716&ad_domain=VQCATCORE_LST&ad_position=15&ad_click_id=MTZmMjJjNjktZGQyNy00YzQ0LThiZWEtNzczNzFhNDk3MGU4"
  },
  {
    "id": "63",
    "nome": "Porta Sacolinha",
    "descricao": "",
    "imagem": "/presentes/Porta Sacolinha.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Puxa-Saco-Porta-Sacolas-para-gaveta-Organizador-de-Sacolas-Pl%C3%A1sticas-Compacto-Premium-Preto-i.1744243667.58204864328?extraParams=%7B%22display_model_id%22%3A179724936987%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "64",
    "nome": "Pano de Chão de Microfibra",
    "descricao": "",
    "imagem": "/presentes/Pano de Chão de Microfibra.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Kit-4-Panos-M%C3%A1gico-de-Ch%C3%A3o-Grande-Super-Absorvente-de-Microfibra-para-Limpeza-Geral-50x60cm-i.385874672.22297332944?extraParams=%7B%22display_model_id%22%3A209160180690%2C%22model_selection_logic%22%3A3%7D&rModelId=209160180690&vItemId=23694962103&vModelId=169416292508&vShopId=1665239494"
  },
  {
    "id": "65",
    "nome": "Fecha Alimentos",
    "descricao": "",
    "imagem": "/presentes/Fecha Alimentos.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Mini-M%C3%A1quina-Seladora-Port%C3%A1til-2-Em-1-Saco-Pl%C3%A1stico-Embalagen-Carregamento-Usb-El%C3%A9trica-i.1064041485.58200835543?extraParams=%7B%22display_model_id%22%3A179722649901%2C%22model_selection_logic%22%3A3%7D&rModelId=179722649901&vItemId=58200793982&vModelId=109726537420&vShopId=1665239494"
  },
  {
    "id": "66",
    "nome": "Escorredor de Louças",
    "descricao": "",
    "imagem": "/presentes/Escorredor de Louças.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Escorredor-de-Lou%C3%A7as-Rack-A%C3%A7o-Carbono-Organizador-Preto-De-alta-qualidade-i.1813143307.58216274393?extraParams=%7B%22display_model_id%22%3A119730148966%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "67",
    "nome": "Abridor de Latas",
    "descricao": "",
    "imagem": "/presentes/Abridor de Latas.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Abridor-de-Lata-e-Garrafa-em-A%C3%A7o-Inox-9cm-Para-Cozinha-Latas-Bebidas-i.257757607.58250376790?extraParams=%7B%22display_model_id%22%3A179410736998%2C%22model_selection_logic%22%3A3%7D&rModelId=179410736998&vItemId=23594940530&vModelId=129839706232&vShopId=1665239494"
  },
  {
    "id": "68",
    "nome": "Porta Papel Toalha",
    "descricao": "",
    "imagem": "/presentes/Porta Papel Toalha.webp",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Suporte-De-Toalha-De-Papel-Fofo-jerry99-Decora%C3%A7%C3%A3o-De-Dachshund-Para-Bancada-De-Cozinha-Aut%C3%B4noma-De-Animais-Casa-i.1594814006.47061163094?extraParams=%7B%22display_model_id%22%3A307646013087%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "69",
    "nome": "Porta Papel filme + Papel Aluminio",
    "descricao": "",
    "imagem": "/presentes/Porta Papel filme + Papel Aluminio.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Porta-Rolo-Duplo-Organizador-Bambu-Papel-Alum%C3%ADnio-Filme-PVC-Cortador-Dispenser-Cozinha-Suporte-i.392003162.58265147615?extraParams=%7B%22display_model_id%22%3A179729888409%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "70",
    "nome": "Potes Herméticos Geladeira - Alho e Cebola",
    "descricao": "",
    "imagem": "/presentes/Potes Herméticos Geladeira - Alho e Cebola.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Potes-Herm%C3%A9ticos-Geladeira-Porta-Alho-Porta-Cebola-450ml-950ml-Porta-Mantimentos-i.800279532.23294625903?extraParams=%7B%22display_model_id%22%3A189613743468%2C%22model_selection_logic%22%3A3%7D&rModelId=189613743468&vItemId=58256703151&vModelId=189619309771&vShopId=1665239494"
  },
  {
    "id": "71",
    "nome": "Potes Hermetico Organizadores Geladeira",
    "descricao": "",
    "imagem": "/presentes/Potes Hermetico Organizadores Geladeira.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Kit-3-Potes-Hermetico-Organizadores-Geladeira-850ML-1750ML-3300ML-Alimentos-Vegetais-i.1421746197.18199934577?extraParams=%7B%22display_model_id%22%3A219179581106%2C%22model_selection_logic%22%3A3%7D&rModelId=219179581106&vItemId=58206368138&vModelId=149790779054&vShopId=1665239494"
  },
  {
    "id": "72",
    "nome": "Kit Acessórios Para Banheiro",
    "descricao": "",
    "imagem": "/presentes/Kit Acessórios Para Banheiro.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Kit-Acess%C3%B3rios-Para-Banheiro-A%C3%A7o-Inox-2-Porta-Shampoo-Vidro-Reto-6mm-Preto-Fosco-i.1418013764.23193563242?extraParams=%7B%22display_model_id%22%3A209169103046%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "73",
    "nome": "Porta Remédios",
    "descricao": "",
    "imagem": "/presentes/Porta Remédios.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://www.mercadolivre.com.br/maleta-porta-remedios-comprimidos-farmacinha-curativo-objeto/up/MLBU3621630087#polycard_client=search-desktop&float_highlight=last_units&be_origin=backend&overlay_label=not_apply&search_layout=grid&position=23&type=product&tracking_id=2dd8848e-44b3-4bb3-bce8-8e744b6a0f36&wid=MLB4325448227&sid=search"
  },
  {
    "id": "74",
    "nome": "Espanador",
    "descricao": "",
    "imagem": "/presentes/Espanador.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Espanador-280-Cent%C3%ADmetros-2-8-metro-Ajust%C3%A1vel-Telesc%C3%B3pica-Dobra-Duster-Escova-De-Limpeza-De-Poeira-i.1572590305.22798940325?extraParams=%7B%22display_model_id%22%3A139835909540%2C%22model_selection_logic%22%3A3%7D&rModelId=139835909540&vItemId=58210357511&vModelId=159554136485&vShopId=1665239494"
  },
  {
    "id": "75",
    "nome": "Capacho Chaves Kiko (o noivo quer muito)",
    "descricao": "",
    "imagem": "/presentes/Capacho.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Capacho-Chaves-Kiko-Da-Parte-de-Quem-60x40cm-i.297204206.22998050739?extraParams=%7B%22display_model_id%22%3A239413109078%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "76",
    "nome": "Porta Escova de dente",
    "descricao": "",
    "imagem": "/presentes/Porta Escova de dente.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://www.mercadolivre.com.br/porta-escovas-duplo-canelado-para-bancada-organizada-luxuosa-preto/p/MLB73884252#polycard_client=search-desktop&be_origin=backend&overlay_label=not_apply&search_layout=grid&position=49&type=product&tracking_id=3bcade09-3acd-4f86-882b-a23ca6f4ed06&wid=MLB6981254498&sid=search"
  },
  {
    "id": "77",
    "nome": "Passadeira",
    "descricao": "",
    "imagem": "/presentes/Passadeira.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Tapete-Passadeira-Individual-Tecido-grosso-Cozinha-Quarto-Sala-Corredor-algod%C3%A3o-Lav%C3%A1vel-M%C3%A1quina-i.358622066.18798647717?extraParams=%7B%22display_model_id%22%3A238740585542%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "78",
    "nome": "Kit 3 Escovas Limpeza",
    "descricao": "",
    "imagem": "/presentes/Kit 3 Escovas Limpeza.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Kit-3-Escovas-Limpeza-Multiuso-Cantos-Frestas-Janela-Cozinha-Banheiro-Roupas-Rejunte-i.399130985.57816113948?extraParams=%7B%22display_model_id%22%3A351374944831%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "79",
    "nome": "Limpa Box",
    "descricao": "",
    "imagem": "/presentes/Limpa Box.webp",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Kit-Limpa-Box-e-Blindex-Limpador-De-Vidro-Limpeza-de-V%C3%A3os-Cantos-AKORA-i.260115067.22698087641?extraParams=%7B%22display_model_id%22%3A219185775823%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "80",
    "nome": "Rodo Mop Spray Limpa Vidro",
    "descricao": "",
    "imagem": "/presentes/Rodo Mop Spray Limpa Vidro.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Rodo-Mop-Spray-Limpa-Vidro-3-em-1-200ml-Borrifa-Limpa-e-Seca-Limpador-de-Vidros-com-Reservat%C3%B3rio-MN-i.1520942179.44502553323?extraParams=%7B%22display_model_id%22%3A345245190763%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "81",
    "nome": "Kit 2 Suporte de Parede para Capacete",
    "descricao": "",
    "imagem": "/presentes/Kit 2 Suporte de Parede para Capacete.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Kit-2-Suporte-de-Parede-para-Capacete-i.517658309.23898226924?extraParams=%7B%22display_model_id%22%3A219606613727%2C%22model_selection_logic%22%3A3%7D&rModelId=219606613727&vItemId=58206629451&vModelId=149790870280&vShopId=1665239494"
  },
  {
    "id": "82",
    "nome": "Kit 2 Frascos Difusor",
    "descricao": "",
    "imagem": "/presentes/Kit 2 Frascos Difusor.jpg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://shopee.com.br/Kit-2-Frascos-Difusor-Meia-Lua-280ml-Vidro-Aromatizador-Ambientes-com-Varetas-e-Tampa-Luxo-i.906352563.43680815815?extraParams=%7B%22display_model_id%22%3A370910558864%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    "id": "83",
    "nome": "Quadro do Palmeira (o noivo quer muito)",
    "descricao": "",
    "imagem": "/presentes/placeholder-presente.svg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://www.mercadolivre.com.br/quadro-palmeiras-garra-do-verdao-c-vidro-e-moldura-preto/up/MLBU3925112719"
  },
  {
    "id": "84",
    "nome": "Porta Chave do Palmeiras (o noivo quer muito)",
    "descricao": "",
    "imagem": "/presentes/placeholder-presente.svg",
    "cor": "",
    "observacao": "",
    "linkCompra": "https://www.mercadolivre.com.br/porta-chaves-personalizado-de-times-de-futebol--mdf-15mm/up/MLBU4680754962#polycard_client=search-desktop&be_origin=backend&overlay_label=not_apply&search_layout=grid&position=11&type=product&tracking_id=6ae7d25a-82d3-45e1-a9c4-b6205ca293df&wid=MLB7380702962&sid=search"
  }
];

async function importarPresentes() {
  console.log("");
  console.log("==============================================");
  console.log(" IMPORTAÇÃO SEGURA DOS PRESENTES");
  console.log("==============================================");
  console.log("");
  console.log(`Total de presentes na lista: ${presentes.length}`);
  console.log("");

  const referencias = presentes.map((presente) =>
    db.collection("presentes").doc(presente.id)
  );

  const snapshots = await db.getAll(...referencias);

  let existentes = 0;
  let novos = 0;

  const batch = db.batch();

  snapshots.forEach((snapshot, indice) => {
    const presente = presentes[indice];
    const referencia = referencias[indice];

    if (snapshot.exists) {
      existentes++;

      // Atualiza os dados do presente sem alterar "reservado".
      batch.set(
        referencia,
        {
          id: presente.id,
          nome: presente.nome,
          descricao: presente.descricao,
          imagem: presente.imagem,
          cor: presente.cor,
          observacao: presente.observacao,
          linkCompra: presente.linkCompra,
        },
        { merge: true }
      );
    } else {
      novos++;

      batch.set(referencia, {
        id: presente.id,
        nome: presente.nome,
        descricao: presente.descricao,
        imagem: presente.imagem,
        cor: presente.cor,
        observacao: presente.observacao,
        linkCompra: presente.linkCompra,
        reservado: false,
      });
    }
  });

  await batch.commit();

  console.log("");
  console.log("IMPORTAÇÃO CONCLUÍDA!");
  console.log("");
  console.log(`Documentos já existentes atualizados: ${existentes}`);
  console.log(`Documentos novos criados: ${novos}`);
  console.log(`Total processado: ${presentes.length}`);
  console.log("");
  console.log("Nenhuma reserva existente foi apagada.");
  console.log("==============================================");
}

importarPresentes().catch((erro) => {
  console.error("");
  console.error("ERRO DURANTE A IMPORTAÇÃO:");
  console.error(erro);
  console.error("");
  process.exit(1);
});