import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
    const browser = await chromium.launch({ headless: true });  // Alterar para FALSE para visualizar o navegador
    const page = await browser.newPage();

    await page.goto('https://www.sephora.com.br/skincare/');

    const productLinks = await page.$$eval('#search-result-items li a', links => {
        return links.map(link => link.href).filter(href => href.endsWith('.html'));
    });

    const uniqueLinks = Array.from(new Set(productLinks)); // Converte para Array
    const productData = [];
    
    // Loop para acessar todos os links de produtos
    for (const productLink of uniqueLinks) {
        await page.goto(productLink);

        const productName = await page.$eval('h1.product-name', el => el.innerText.trim()).catch(() => 'Nome não encontrado');
        const productImage = await page.$eval('a.product-image.main-image img.primary-image', img => img.src).catch(() => 'Imagem não encontrada');

        await page.click('a[aria-controls="panel5"]');

        // Filtro para pegar todos os parágrafos que contenham "Água", "AQUA", "WATER" ou "Glucomannan"
        const ingredientsRaw = await page.$$eval('#panel5 p', paragraphs => {
            return paragraphs
                .map(p => p.innerText)
                .filter(text => /Água|AQUA|WATER|Glucomannan/i.test(text))
                .join('\n'); // Junta os textos dos parágrafos que contêm os ingredientes
        }).catch(() => 'Ingredientes não encontrados');

        // Verifica se existem ingredientes válidos
        if (!ingredientsRaw.trim()) {
            console.log(`Ingredientes do produto "${productName}" não encontrados. Passando para o próximo produto.`);
            continue; // Pula para o próximo produto
        }

        const cleanIngredients = processIngredients(ingredientsRaw);

        // Adiciona os dados
        if (cleanIngredients) {
            productData.push({
                'Link da página': productLink,
                'Nome do Produto': productName,
                'Link da Imagem': productImage,
                'Ingredientes': cleanIngredients
            });

            // Sai do loop se já tiver coletado 5 produtos COM ingredientes
            if (productData.length === 5) {
                break; 
            }
        }
    }

    // Verifica se conseguiu localizar 5 produtos válidos
    if (productData.length < 5) {
        console.log('Menos de 5 produtos válidos encontrados.');
    }

    // Salva os dados em produtos.json
    fs.writeFileSync('produtos.json', JSON.stringify(productData, null, 2), 'utf-8');
    console.log('Dados salvos em produtos.json');
    console.log(JSON.stringify(productData, null, 2)); // Exibe os dados no console em formato JSON
    await browser.close();
})();

function processIngredients(ingredients) {
    const cleanedIngredients = ingredients
        .replace(/Ingredientes:\s*/i, '') // Remove "Ingredientes:"
        .replace(/COMPOSIÇÃO:\s*/i, '') // Remove "COMPOSIÇÃO:"
        .replace(/Pode Conter\s*\(\+\/-\)\s*:\s*/i, ', ') // Remove "Pode Conter (+/-):" e substitui por vírgula
        .replace(/•/g, '') // Remove marcadores
        .split(/,\s*|\.\s*/) // Separa ingredientes por vírgula ou ponto
        .map(line => line.trim())
        .map(line => line.split(':')[0].trim()) // Remove descrições após ":" (caso exista)
        .filter(line => line); // Filtra linhas vazias

    return cleanedIngredients.join(', '); // Junta os ingredientes em uma string
}
