import { PlaywrightCrawler } from 'crawlee';
import fs from 'fs';

let productCount = 0;
const maxProducts = 6; // Selecione a quantidade de produtos que deseja coletar (Maximo de 6, pois o 7º precisava de uma validação para continuar e acabei não implementando)
const productDataArray = [];

// Função para processar os ingredientes
function processIngredients(ingredients) {
    const cleanedIngredients = ingredients
        .replace(/Ingredientes:\s*/i, '') // Remove "Ingredientes:"
        .replace(/COMPOSIÇÃO:\s*/i, '') // Remove "COMPOSIÇÃO:"
        .replace(/Pode Conter\s*\(\+\/-\)\s*:\s*/i, ', ') // Remove "Pode Conter (+/-):" e substitui por vírgula
        .replace(/•/g, '') // Remove marcadores
        .split(/,\s*|\.\s*/) // Separa ingredientes por vírgula ou ponto
        .map(line => line.trim())
        .map(line => line.split(':')[0].trim()) // Remove descrições após ":" (caso existam)
        .filter(line => line); // Filtra linhas vazias

    return cleanedIngredients.join(', '); // Junta os ingredientes em uma string
}

// Configuração do crawler
const crawler = new PlaywrightCrawler({
    headless: true, // Alterar para FALSE para visualizar o navegador
    maxConcurrency: 1, // Garante que apenas 1 link seja aberto por vez
    async requestHandler({ page, request, enqueueLinks, crawler }) {
        const url = request.url;

        if (url === 'https://www.sephora.com.br/skincare/') { 
            // Enfileira os links dos produtos automaticamente
            await enqueueLinks({
                selector: '#search-result-items li a',
                globs: ['https://www.sephora.com.br/*'],
                label: 'product',
            });
        }

        if (request.label === 'product' && productCount < maxProducts) {
            const productName = await page.$eval('h1.product-name', el => el.innerText.trim()).catch(() => 'Nome não encontrado'); // Tenta pegar o nome do produto
            const productImage = await page.$eval('a.product-image.main-image img.primary-image', img => img.src).catch(() => 'Imagem não encontrada'); // Tenta pegar a imagem do produto

            await page.click('a[aria-controls="panel5"]'); // Clica na aba de "Especificações"

            let ingredientsRaw;

            // Tenta localizar paragrafos com as palavras "Água", "AQUA", "WATER" e "Glucomannan"
            try {
                ingredientsRaw = await page.$$eval('#panel5 p', paragraphs => {
                    return paragraphs
                        .map(p => p.innerText)
                        .filter(text => /Água|AQUA|WATER|Glucomannan/i.test(text))
                        .join('\n');
                });
            } catch (error) {
                console.error('Erro ao coletar ingredientes:', error);
            }
            
            // Se não encontrou ingredientes com os filtros, busca registros que tenham ":"
            if (!ingredientsRaw || !ingredientsRaw.trim()) {
                try {
                    ingredientsRaw = await page.$$eval('#panel5 p', paragraphs => {
                        return paragraphs
                            .map(p => p.innerText)
                            .filter(text => /:/i.test(text)) // Filtra textos que contêm ":"
                            .map(text => {
                                const parts = text.split(':');
                                const ingredientCandidate = parts[0].trim(); // Pega a parte antes do ":"
                                return ingredientCandidate.endsWith(':') ? '' : ingredientCandidate; // Ignora se terminar com ":"
                            })
                            .filter(text => text.length > 0) // Filtra entradas vazias
                            .join(', '); // Junta os ingredientes encontrados
                    });
                } catch (error) {
                    console.error('Erro ao buscar ingredientes alternativos:', error);
                    ingredientsRaw = ''; // Caso ocorra erro, faz com que a variável seja vazia
                }
            }
            
            // Se não encontrou ingredientes, exibe mensagem e passa para o próximo produto
            if (!ingredientsRaw.trim()) {
                console.log(`Ingredientes do produto "${productName}" não encontrados. Passando para o próximo produto.`);
                return;
            }

            const cleanIngredients = processIngredients(ingredientsRaw);

            // Se encontrou ingredientes, salva os dados do produto
            if (cleanIngredients) {
                const productData = {
                    'Link da página': request.url,
                    'Nome do Produto': productName,
                    'Link da Imagem': productImage,
                    'Ingredientes': cleanIngredients
                };

                // Adiciona ao array de produtos
                productDataArray.push(productData);
                productCount++;

                // Verifica se já foi coletado a quantidade de produtos desejada
                if (productCount === maxProducts) {
                    fs.writeFileSync('produtos.json', JSON.stringify(productDataArray, null, 2), 'utf-8');
                    console.log('Campos em JSON: ', productDataArray);
                    await crawler.autoscaledPool.abort(); // Interrompe o crawler
                }
            }
        }
    },
});

// Inicia o crawler na página principal
await crawler.run(['https://www.sephora.com.br/skincare/']);
