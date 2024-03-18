const fs = require('fs');

async function getAllProductsFromJson() {
    const productsData = [];

    const jsonData = fs.readFileSync(__dirname + '/products.json', 'utf-8');
    const products = JSON.parse(jsonData);

    productsData.push(...products);

    return productsData;
}

module.exports = { getAllProductsFromJson };