import express from 'express';
import {CartManager} from '../managers/cartManager.js'
import path from 'path';
import {fileURLToPath} from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '../');

const manager = new CartManager(root + 'db/carts.json');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const {payload: carts} = await manager.getCarts();
        if (!carts) {
            res.status(404).send({ error: 'Carts not found' });
        }
        res.status(200).send(carts);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }
})

router.get('/:cid', async (req, res) => {
    try {
        const id = parseInt(req.params.cid);
        const {payload: cart} = await manager.getCartById(id);
        if (!cart) {
            res.status(404).send({ error: 'Cart not found' });
        } else {
            res.status(200).send(cart);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }
})

router.post('/', async (req, res) => {
    try {
        const {payload: newCart} = await manager.createCart();
        res.status(201).send(newCart);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        const {payload: newProduct} = await manager.addProductToCart(cartId, productId);
        if (!newProduct) {
            res.status(404).send({ error: 'Cart or product not found' });
        } else {
            res.status(201).send(newProduct);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }
})

export {router}