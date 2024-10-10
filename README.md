# Web Scraper para Produtos de Skincare da Sephora

Este projeto é um web scraper desenvolvido utilizando a biblioteca Crawlee, com o objetivo de capturar informações de produtos da seção de Skincare do site da Sephora. O scraper coleta detalhes sobre os primeiros 5 produtos que possuem ingredientes listados e exibe os resultados em formato JSON.

Este projeto foi criado para demonstrar uma abordagem alternativa em relação ao desenvolvimento do scraper anterior, permitindo que os recrutadores escolham a melhor solução e identifiquem áreas de melhoria.

## Funcionalidades

- Captura as seguintes informações de cada produto:
  - Nome do produto
  - URL da imagem do produto
  - Link da página do produto
  - Ingredientes (separados por vírgula)

- Os resultados são exibidos no console/terminal e salvos em um arquivo `produtos.json`.

## Tecnologias Utilizadas

- [Crawlee](https://crawlee.dev/) - Uma biblioteca para automação de web scraping.
- Node.js - Ambiente de execução para JavaScript.

## Pré-requisitos

Antes de executar o projeto, você precisa ter o Node.js instalado. Você pode baixá-lo [aqui](https://nodejs.org/).

## Instalação

1. Clone este repositório para sua máquina local:
   ```bash
   git clone https://github.com/isp3ct/desafio-ducke.git
   ```

2. Navegue até o diretório do projeto:
   ```bash
   cd pasta_do_projeto
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

## Execução

Para iniciar o scraper, execute o seguinte comando no terminal:
```bash
npm start
```

O scraper abrirá um navegador em modo headless e coletará as informações dos produtos, exibindo os resultados no console e salvando-os em `produtos.json`.

## Observações

- O código está autoexplicativo, mas se houver qualquer dúvida, sinta-se à vontade para entrar em contato.
- Para visualizar o navegador durante a execução, altere o parâmetro `headless` para `false` na configuração do crawler.
- Existem outras branches disponíveis neste repositório que podem ser exploradas para obter diferentes implementações e abordagens do projeto.

Este projeto foi desenvolvido para mostrar uma abordagem diferente ao problema proposto, permitindo que os recrutadores avaliem qual implementação se adequa melhor às suas necessidades e em qual área eu poderia melhorar.
