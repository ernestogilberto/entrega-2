const fs = require('fs').promises;

class ProductManager {
    requiredProductFields = ['title', 'description', 'price', 'thumbnail', 'code', 'stock'];

    constructor(path) {
        this.path = path;
        this.nextId = 1;
    }

    async validateProduct(product) {

        if (!product) {
            return {status: 'failure', payload: 'Product is required'};
        }

        for (const field of this.requiredProductFields) {
            const {[field]: value} = product;
            if (!value) {
                return {status: 'failure', payload: `Product ${field} is required`};
            }
        }

        const productKeys = Object.keys(product);
        for (const key of productKeys) {
            if (!this.requiredProductFields.includes(key)) {
                return {status: 'failure', payload: `Product property ${key} is not allowed`};
            }
        }

        try {
            const productsResult = await this.getProducts();
            if (productsResult.status === 'failure') {
                return {status: 'failure', payload: 'Error getting products'};
            }

            if (productsResult.status === '404') {
                return {status: 'success', payload: []};
            }

            const products = productsResult.payload;
            const productFound = products.find(p => p.code === product.code);

            if (productFound) {
                return {status: 'failure', payload: `Product with code ${product.code} already exists`};
            }

            return {status: 'success', payload: []};
        } catch (error) {
            return {status: 'failure', payload: `Product validation error: ${error.message}`};
        }
    }

    async addProduct(product) {

        const validationResult = await this.validateProduct(product);
        if (validationResult.status === 'failure') {
            return {status: 'failure', payload: validationResult.payload};
        }

        product.id = this.nextId++;

        try {
            const productsResult = await this.getProducts();

            if (productsResult.status === 'failure') {
                return {status: 'failure', payload: 'Error getting products'};
            }

            const products = productsResult.payload;

            products.push(product);
            await fs.writeFile(this.path, JSON.stringify(products), null, 2);
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

        const productKeys = Object.keys(data);
        for (const key of productKeys) {
            if (!this.requiredProductFields.includes(key)) {
                return {status: 'failure', payload: `Product property ${key} is not allowed`};
            }
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
            await fs.writeFile(this.path, JSON.stringify(products), null, 2);
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

            await fs.writeFile(this.path, JSON.stringify(products), null, 2);
            return {status: 'success', payload: 'Product deleted successfully'};

        } catch (error) {
            return {status: 'failure', payload: `Product delete error: ${error.message}`};
        }
    }

}

module.exports = ProductManager;