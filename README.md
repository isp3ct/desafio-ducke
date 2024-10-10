# Web Scraper V2 para Produtos de Skincare da Sephora

Este projeto é uma versão aprimorada de um web scraper desenvolvido para capturar informações de produtos da seção de Skincare do site da Sephora. Nesta versão, a coleta de dados foi otimizada para melhorar a precisão e a robustez das informações obtidas.

## Funcionalidades

- Coleta as seguintes informações de cada produto:
  - Nome do produto
  - URL da imagem do produto
  - Link da página do produto
  - Ingredientes (separados por vírgula)

- Os resultados são exibidos no console/terminal e salvos em um arquivo `produtos.json`.

## Novidades na V2

- **Melhoria na Coleta de Ingredientes**: A lógica de coleta foi aprimorada para tentar localizar ingredientes que contêm palavras-chave relevantes, como "Água", "AQUA", "WATER" e "Glucomannan". Se não forem encontrados, uma busca alternativa é realizada para capturar ingredientes que tenham descrições associadas.

- **Tratamento de Erros**: Mensagens de erro são exibidas caso ocorra algum problema na coleta de ingredientes, garantindo que o scraper não falhe completamente em casos de erro.

- **Validação de Coleta**: O scraper agora limita a coleta a um máximo de 6 produtos, permitindo que você escolha a quantidade desejada. O sétimo produto necessitaria de validação adicional, que não foi implementada nesta versão.

## Tecnologias Utilizadas

- [Crawlee](https://crawlee.dev/) - Uma biblioteca para automação de scraping.
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
- Para visualizar o navegador durante a execução, altere o parâmetro `headless` para `false` na configuração do crawler no código.
- Este projeto foi desenvolvido em Crawlee para demonstrar uma linguagem alternativa, permitindo que os recrutadores escolham qual a melhor e em qual devo melhorar.
