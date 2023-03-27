// Function to set ID of a product
const setId = (data) => {
    try {
        // If the status of the response is not 'success', set ID to 1
        if (data.status !== 'success') {
            return 1;
        } else {
            // Get the list of products from the response and set ID to last product's ID + 1
            const products = data.payload;
            const id = products[products.length - 1].id;
            return id + 1;
        }
    } catch (error) {
        return error;
    }
};

// Function to validate a product
const validateProduct = (product, requiredProductFields, productsResult) =>{
    // Check if the product exists, if not, return error
    if (!product) {
        return {status: 'failure', payload: 'Product is required'};
    }

    // Check if all required fields of the product exist, if not, return error
    for (const field of requiredProductFields) {
        const {[field]: value} = product;
        if (!value) {
            return {status: 'failure', payload: `Product ${field} is required`};
        }
    }

    // Check if any fields of the product are not allowed, if not, return error
    const allowedFieldsResult = validateAllowedFields(product, requiredProductFields);
    if (allowedFieldsResult.status === 'failure') {
        return {status: 'failure', payload: allowedFieldsResult.payload};
    }

    try {
        // If there is an error getting the products, return error
        if (productsResult.status === 'failure') {
            return {status: 'failure', payload: 'Error getting products'};
        }

        // If there are no products, return an empty array
        if (productsResult.status === '404') {
            return {status: 'success', payload: []};
        }

        // Check if a product with the same code exists, if so, return error
        const products = productsResult.payload;
        const productFound = products.find(p => p.code === product.code);

        if (productFound) {
            return {status: 'failure', payload: `Product with code ${product.code} already exists`};
        }

        // If everything is successful, return a status of 'success'
        return {status: 'success'};
    } catch (error) {
        return {status: 'failure', payload: `Product validation error: ${error.message}`};
    }
}

// Function to validate if all fields of a product are allowed
const validateAllowedFields = (data, requiredProductFields) => {
    const productKeys = Object.keys(data);
    for (const key of productKeys) {
        if (!requiredProductFields.includes(key)) {
            return {status: 'failure', payload: `Product property ${key} is not allowed`};
        }
    }
    // If everything is successful, return a status of 'success'
    return {status: 'success'};
}

module.exports = { setId, validateProduct, validateAllowedFields };