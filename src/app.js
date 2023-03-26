const express = require("express")
const ProductManager = require("./managers/productManager")
let manager = new ProductManager("./db/products.json")

const app = express()
const PORT = 8080

app.use(express.urlencoded({extended:true}))

app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`)
});

app.get("/",(req,res) => {
    res.send ("Musical Instruments")
})

app.get("/products/",async(req,res) => {
    let {limit} = req.query;
    const {payload} = await manager.getProducts();

    res.send(limit ? payload.slice(0, limit) : payload);
});

app.get("/products/:pid",async(req,res)=>{
    let id=parseInt(req.params.pid)
    const {payload} = await manager.getProductById(id);
    res.send(payload);
});