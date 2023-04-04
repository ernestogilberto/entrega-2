import express from 'express';
import {ProductManager} from '../managers/productManager.js'
import path from 'path';
import {fileURLToPath} from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '../');

const manager = new ProductManager(root + 'db/products.json');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        let {limit} = req.query;
        const {payload: products, error} = await manager.getProducts();
        if (error) {
            res.status(400).send(error);
        }
        res.status(200).send(limit ? products.slice(0, limit) : products);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
})

router.get('/:pid', async (req, res) => {
    try {
        let id = parseInt(req.params.pid);
        const {payload: product, error} = await manager.getProductById(id);
        if (error) {
            res.status(400).send(error);
        } else {
            res.status(200).send(product);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
})

router.post('/', async (req, res) => {
    try {
        const product = req.body;
        const {payload: addProductResult, error} = await manager.addProduct(product);
        if (error) {
            res.status(400).send(error);
        } else {
            res.status(201).send(addProductResult);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
})

router.put('/:pid', async (req, res) => {
    try {
        let id = parseInt(req.params.pid);
        const product = req.body;
        const {payload: updatedProduct, error} = await manager.updateById(id, product);
        if (error) {
            res.status(400).send(error);
        } else {
            res.status(200).send(updatedProduct);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
})

router.delete('/:pid', async (req, res) => {
    try {
        let id = parseInt(req.params.pid);
        const {payload: deletedProduct, error} = await manager.deleteById(id);
        if (error) {
            res.status(400).send(error);
        }
        res.status(200).send(deletedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
})

export {router}