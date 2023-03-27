const {validateProduct, setId, validateAllowedFields} = require('../helpers/dataHelpers');
const fs = require('fs').promises;

class ProductManager {
    requiredProductFields = ['title', 'description', 'price', 'thumbnail', 'code', 'stock'];

    constructor(path) {
        this.path = path;
    }

    // Method to get all products from the file
    async getProducts() {
        try {
            // Reading the file containing the products
            const products = await fs.readFile(this.path, 'utf8');

            // Parsing the contents of the file and returning an object with a status of 'success' and the products
            return {status: 'success', payload: JSON.parse(products)};

        } catch (error) {
            // If the file is not found, returning an object with a status of '404' and an empty array
            if (error.code === 'ENOENT') {
                return {status: '404', payload: []}
            }
            // If there is an error, returning an object with a status of 'failure' and the error message
            return {status: 'failure', payload: error.message}
        }
    }

    // Method to add a product to the file
    async addProduct(product) {

        // Validating the product's fields using the validateProduct helper function
        const validationResult = validateProduct(product, this.requiredProductFields, await this.getProducts());

        // If validation fails, returning an object with a status of 'failure' and the validation payload
        if (validationResult.status === 'failure') {
            return {status: 'failure', payload: validationResult.payload};
        }

        // Setting the product's ID using the setId helper function
        product.id = await setId(await this.getProducts());

        try {
            // Getting all products
            const productsResult = await this.getProducts();

            // If there is an error, returning an object with a status of 'failure' and an error message
            if (productsResult.status === 'failure') {
                return {status: 'failure', payload: 'Error getting products'};
            }

            // Adding the new product to the products array and writing to the file
            const products = productsResult.payload;
            products.push(product);
            await fs.writeFile(this.path, JSON.stringify(products));

            // Returning an object with a status of 'success' and a success message
            return {status: 'success', payload: `Product added successfully with id ${product.id}`};

        } catch (error) {
            return {status: 'failure', payload: `Product add error: ${error.message}`};
        }
    }

    // Method to get a product by its ID
    async getProductById(id) {
        // If no ID is provided, returning an object with a status of 'failure' and a message
        if (!id) {
            return {status: 'failure', payload: 'Id is required'};
        }
        try {
            // Getting all products
            const productsResult = await this.getProducts();

            // If there is an error, returning an object with a status of 'failure' and a message
            if (productsResult.status === 'failure') {
                return {status: 'failure', payload: 'Error getting products'};
            }

            // Finding the product with the specified ID and returning an object with a status of 'success' and the product
            const products = productsResult.payload;
            const product = products.find(product => product.id === id);
            return product ? {status: 'success', payload: product} : {status: 'failure', payload: 'Product not found'};

        } catch (error) {
            return `Product get error: ${error.message}`;
        }
    }

    // Define a method to update a product by its id
    async updateById(id, data) {
        // If no ID is provided, returning an object with a status of 'failure' and a message
        if (!id) {
            return {status: 'failure', payload: 'Id is required'};
        }

        // If the ID is provided in the data, returning an object with a status of 'failure' and a message
        if (data.id) {
            return {status: 'failure', payload: 'Id cannot be updated'};
        }

        // Validating the product's fields using the validateProduct helper function
        const allowedFieldsResult = validateAllowedFields(data, this.requiredProductFields);

        // If validation fails, returning an object with a status of 'failure' and the validation payload
        if (allowedFieldsResult.status === 'failure') {
            return {status: 'failure', payload: allowedFieldsResult.payload};
        }

        try {
            // Getting all products
            const productsResult = await this.getProducts();

            // If getProducts method fails, return failure with an error message
            if (productsResult.status === 'failure') {
                return {status: 'failure', payload: 'Error getting products'};
            }

            // Finding the product with the specified ID and updating it
            const products = productsResult.payload;
            const index = products.findIndex(product => product.id === id)

            // If the product is not found, returning an object with a status of 'failure' and a message
            if (index === -1) {
                return {status: 'failure', payload: 'Product not found'};
            }

            // Updating the product and writing to the file
            const product = products[index];
            products[index] = {...product, ...data};
            await fs.writeFile(this.path, JSON.stringify(products));
            return {status: 'success', payload: 'Product updated successfully'};


        } catch (error) {
            return {status: 'failure', payload: `Product update error: ${error.message}`};
        }
    }

    // Define a method to delete a product by its id
    async deleteById(id) {
        // If no ID is provided, returning an object with a status of 'failure' and a message
        if (!id) {
            return {status: 'failure', payload: 'Id is required'}
        }
        try {
            // Call getProducts method
            const productsResult = await this.getProducts();

            // If getProducts method fails, return failure with an error message
            if (productsResult.status === 'failure') {
                return {status: 'failure', payload: 'Error getting products'};
            }

            // Find the product with the specified ID and delete it
            const products = productsResult.payload;
            const index = products.findIndex(product => product.id === id)

            // If the product is not found, returning an object with a status of 'failure' and a message
            if (index === -1) {
                return {status: 'failure', payload: 'Product not found'};
            }

            // Deleting the product and writing to the file
            products.splice(index, 1)

            await fs.writeFile(this.path, JSON.stringify(products));
            return {status: 'success', payload: 'Product deleted successfully'};

        } catch (error) {
            return {status: 'failure', payload: `Product delete error: ${error.message}`};
        }
    }
}

module.exports = ProductManager;