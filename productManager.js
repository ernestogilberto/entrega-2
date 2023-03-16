const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    static id = 1;

    validateProduct = async (product) => {

        const productKeys = ['title', 'description', 'price', 'thumbnail', 'code', 'stock'];
        if (!product) {
            return 'Product is required';
        }
        for (const key of productKeys) {
            if (!product[key]) {
                return `Product ${key} is required`;
            }
        }

        try {
            const products = await this.getProducts();
            if (products === 'file not found') {
                return 'Success';
            }
            const productFound = products.find(p => p.code === product.code);
            if (productFound) {
                const code = productFound.code;
                return `Product with code ${code} already exists`;
            }
        } catch (error) {
            return `Product validation error: ${error}`
        }
        return 'Success';
    }

    addProduct = async (product) => {
        const validationResult = await this.validateProduct(product).then(result => result);
        if (validationResult !== 'Success') {
            return validationResult;
        } else {
            product.id = ProductManager.id++;

            try {
                if (product.id === 1) {
                    await fs.promises.writeFile(this.path, JSON.stringify([product]), null);
                } else {
                    let products = await this.getProducts().then(data => data);
                    products.push(product);
                    await fs.promises.writeFile(this.path, JSON.stringify(products), null);

                }
                return 'Product added successfully';
            } catch (error) {
                return `Product add error: ${error}`;
            }
        }
    }

    getProducts = async () => {
        if (!fs.existsSync(this.path)) {
            return 'file not found';
        }

        try {
            const data = await fs.promises.readFile(this.path, 'utf8').then(data => data);
            return JSON.parse(data);
        } catch (error) {
            return error;
        }
    }

    getProductById = async (id) => {
        if (!id) {
            return 'Id is required';
        }
        try {
            const products = await this.getProducts().then(products => products);
            if (products !== 'file not found') {
                const product = products.find(product => product.id === id);
                return product ? product : 'Product not found';
            }
        } catch (error) {
            return `Product get error: ${error}`;
        }
    }

    updateById = async (id, data) => {
        if (!id) {
            return 'Id is required';
        }

        if(data.id){
            return 'Id cannot be modified';
        }
        try {
            const products = await this.getProducts().then(products => products);
            if (products !== 'file not found') {
                const product = products.find(product => product.id === id);
                const index = products.indexOf(product);
                if (index === -1) {
                    return 'Product not found';
                }

                products[index] = {...product, ...data};
                await fs.promises.writeFile(this.path, JSON.stringify(products), null);
                return 'Product updated successfully';
            }
        } catch (error) {
            return `Product update error: ${error}`
        }
    }

    deleteById = async (id) => {
        if (!id) {
            return 'Id is required';
        }
        try {
            let data = await this.getProducts().then(products => products);
            if (data!== 'file not found') {
                const products = data.filter(product => product.id !== id);
                if (products.length === data.length) {
                    return 'Product not found';
                }

                await fs.promises.writeFile(this.path, JSON.stringify(products), null);
                return 'Product deleted successfully';
            }
        } catch (error) {
            return `Product delete error: ${error}`;
        }
    }

}

module.exports = ProductManager;