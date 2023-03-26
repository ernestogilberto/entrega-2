const {validateProduct, setId, validateAllowedFields} = require('../helpers/dataHelpers');
const fs = require('fs').promises;

class ProductManager {
    requiredProductFields = ['title', 'description', 'price', 'thumbnail', 'code', 'stock'];

    constructor(path) {
        this.path = path;
    }

    async addProduct(product) {

        const validationResult = validateProduct(product, this.requiredProductFields, await this.getProducts());

        if (validationResult.status === 'failure') {
            return {status: 'failure', payload: validationResult.payload};
        }

        product.id = await setId(await this.getProducts());

        try {
            const productsResult = await this.getProducts();

            if (productsResult.status === 'failure') {
                return {status: 'failure', payload: 'Error getting products'};
            }

            const products = productsResult.payload;

            products.push(product);
            await fs.writeFile(this.path, JSON.stringify(products));
            return {status: 'success', payload: `Product added successfully with id ${product.id}`};

        } catch (error) {
            return {status: 'failure', payload: `Product add error: ${error.message}`};
        }

    }

    async getProducts() {
        try {
            const products = await fs.readFile(this.path, 'utf8');
            return {status: 'success', payload: JSON.parse(products)};
        } catch (error) {
            if (error.code === 'ENOENT') {
                return {status: '404', payload: []}
            }
            return {status: 'failure', payload: error.message}
        }
    }

    async getProductById(id) {
        if (!id) {
            return {status: 'failure', payload: 'Id is required'};
        }
        try {
            const productsResult = await this.getProducts();

            if (productsResult.status === 'failure') {
                return {status: 'failure', payload: 'Error getting products'};
            }

            const products = productsResult.payload;
            const product = products.find(product => product.id === id);
            return product ? {status: 'success', payload: product} : {status: 'failure', payload: 'Product not found'};

        } catch (error) {
            return `Product get error: ${error.message}`;
        }
    }

    async updateById(id, data) {
        if (!id) {
            return {status: 'failure', payload: 'Id is required'};
        }

        if (data.id) {
            return {status: 'failure', payload: 'Id cannot be updated'};
        }

        const allowedFieldsResult = validateAllowedFields(data, this.requiredProductFields);

        if (allowedFieldsResult.status === 'failure') {
            return {status: 'failure', payload: allowedFieldsResult.payload};
        }

        try {
            const productsResult = await this.getProducts();

            if (productsResult.status === 'failure') {
                return {status: 'failure', payload: 'Error getting products'};
            }

            const products = productsResult.payload;
            const index = products.findIndex(product => product.id === id)
            if (index === -1) {
                return {status: 'failure', payload: 'Product not found'};
            }

            const product = products[index];
            products[index] = {...product, ...data};
            await fs.writeFile(this.path, JSON.stringify(products));
            return {status: 'success', payload: 'Product updated successfully'};


        } catch (error) {
            return {status: 'failure', payload: `Product update error: ${error.message}`};
        }
    }

    async deleteById(id) {
        if (!id) {
            return {status: 'failure', payload: 'Id is required'}
        }
        try {
            const productsResult = await this.getProducts();

            if (productsResult.status === 'failure') {
                return {status: 'failure', payload: 'Error getting products'};
            }

            const products = productsResult.payload;
            const index = products.findIndex(product => product.id === id)
            if (index === -1) {
                return {status: 'failure', payload: 'Product not found'};
            }

            products.splice(index, 1)

            await fs.writeFile(this.path, JSON.stringify(products));
            return {status: 'success', payload: 'Product deleted successfully'};

        } catch (error) {
            return {status: 'failure', payload: `Product delete error: ${error.message}`};
        }
    }
}

module.exports = ProductManager;