const setId = (data) => {
    try {
        if (data.status !== 'success') {
            return 1;
        } else {
            const products = data.payload;
            const id = products[products.length - 1].id;
            return id + 1;
        }
    } catch (error) {
        return error;
    }
};

const validateProduct = (product, requiredProductFields, productsResult) =>{

    if (!product) {
        return {status: 'failure', payload: 'Product is required'};
    }

    for (const field of requiredProductFields) {
        const {[field]: value} = product;
        if (!value) {
            return {status: 'failure', payload: `Product ${field} is required`};
        }
    }

    const allowedFieldsResult = validateAllowedFields(product, requiredProductFields);
    if (allowedFieldsResult.status === 'failure') {
        return {status: 'failure', payload: allowedFieldsResult.payload};
    }

    try {
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

const validateAllowedFields = (data, requiredProductFields) => {
    const productKeys = Object.keys(data);
    for (const key of productKeys) {
        if (!requiredProductFields.includes(key)) {
            return {status: 'failure', payload: `Product property ${key} is not allowed`};
        }
    }
    return {status: 'success'};
}

module.exports = { setId, validateProduct, validateAllowedFields };