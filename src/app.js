import express from "express"
import {router as productsRouter} from "./routes/products.js"
import {router as cartsRouter} from "./routes/carts.js"


const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`)
})