import {promises as fs} from 'fs'
import {setId} from '../helpers/dataHelpers.js'

class CartManager {
    constructor(path) {
        this.path = path;
    }

    // Method to get all carts from the file
    async getCarts () {
        try {
            // Reading the file and parsing the JSON to an array of objects (carts)
            const carts = await fs.readFile(this.path, 'utf-8')
            return {payload: JSON.parse(carts)}
        } catch (error) {
            // If the file doesn't exist, returning an empty array
            if (error.code === 'ENOENT') {
                return {payload: []}
            }
            throw new Error(`Error getting carts: ${error.message}`)
        }
    }

    async getCartById(id) {
        // If the ID is not specified, returning an error
        if (!id) {
            return {error: 'Id is required'}
        }

        try {
            // Getting all carts
            const {payload: carts} = await this.getCarts()

            // If there is an error getting the carts, returning an error
            if (!carts) {
                return {error: 'Error getting carts'}
            }

            // Finding the cart with the specified ID and returning it if it exists
            const cart = carts.find(cart => cart.id === id)
            return cart ? {payload: cart.products} : {error: 'Cart not found'}

        } catch (error) {
            throw new Error(`Error getting cart by id: ${error.message}`)
        }
    }

    async createCart() {

        // Setting the cart's ID using the setId helper function and creating an empty products array
        const cart = {
            products: []
        }

        try {
            // Getting all carts and adding the new cart to the carts array
            const {payload: carts} = await this.getCarts()
            cart.id = await setId(carts)
            carts.push(cart)
            await fs.writeFile(this.path, JSON.stringify(carts), null)

            // Returning the cart's ID
            return {payload: `Cart created successfully with id ${cart.id}`}

        } catch (error) {
            throw new Error(`Error creating cart: ${error.message}`)
        }
    }

    async addProductToCart(id, productId) {
        // Setting the quantity to 1 and creating the product object
        const quantity = 1
        const product = {id: productId, quantity}

        // If the ID is not specified, returning an error
        if (!id) {
            return {error: 'Id is required'}
        }
        // If the product ID is not specified, returning an error
        if (!productId) {
            return {error: 'Product is required'}
        }

        try {
            // Getting all carts and finding the cart with the specified ID
            const {payload: carts} = await this.getCarts()
            const cart = carts.find(cart => cart.id === id)
            // If the cart doesn't exist, returning an error
            if (!cart) {
                return {error: 'Cart not found'}
            }
            // Finding the product in the cart's products array
            const productIndex = cart.products.findIndex(currentProduct => currentProduct.id === product.id)

            // If the product doesn't exist in the cart's products array, adding it to the array
            if (productIndex === -1) {
                cart.products.push(product)
            }
            // If the product exists in the cart's products array, incrementing the quantity
            else {
                cart.products[productIndex].quantity++
            }

            // Writing the updated carts array to the file
            await fs.writeFile(this.path, JSON.stringify(carts), null)

            return {payload: 'Product added to cart successfully'}
        } catch (error) {
            throw new Error(`Error adding product to cart: ${error.message}`)
        }
    }
}

export {CartManager}