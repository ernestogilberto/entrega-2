const ProductManager = require('./productManager');

const manager = new ProductManager('./products.json');

function guardar(product) {
    manager.addProduct(product).then((result) => console.log(result));
}

function obtenerPorId(id) {
    manager.getProductById(id).then((result) => console.log(result));
}

function obtenerTodos() {
    manager.getProducts().then((result) => console.table(result));
}

function borrarPorId(id) {
    manager.deleteById(id).then((result) => console.log(result));
}

function actualizarPorId(id, info) {
    manager.updateById(id, info).then((result) => console.log(result));
}

setTimeout(guardar, 50)
setTimeout(guardar, 100,{
    title: 'Producto 1',
    description: 'Descripción del producto 1',
    price: 100,
    thumbnail: 'imagen1.jpg',
    code: '123456',
    stock: 10
})
setTimeout(guardar, 150,{
    title: 'Producto 1',
    description: 'Descripción del producto 1',
    price: 100,
    thumbnail: 'imagen1.jpg',
    code: '123456',
    stock: 10
})

setTimeout(guardar, 200, {
    title: 'Producto 2',
    description: 'Descripción del producto 2',
    price: 100,
    thumbnail: 'imagen2.jpg',
    code: '123452',
    stock: 12
})

setTimeout(guardar, 250, {
    title: 'Producto 3',
    description: 'Descripción del producto 3',
    price: 100,
    thumbnail: 'imagen3.jpg',
    code: '123453',
    stock: 13
})

setTimeout(guardar, 300, {title: 'Producto 4',
    price: 100,
    thumbnail: 'imagen4.jpg',
    code: '123454',
    stock: 14
})

setTimeout(guardar, 350, {
    title: 'Producto 1',
    description: 'Descripción del producto 1',
    price: 100,
    thumbnail: 'imagen1.jpg',
    code: '23456'
})

setTimeout(obtenerTodos, 400)

setTimeout(obtenerPorId, 500, 8);

setTimeout(obtenerPorId, 600);

setTimeout(obtenerPorId, 700,2);

setTimeout(actualizarPorId, 800, 2, {title: 'Producto alterado', price: 111, id: 34});
setTimeout(obtenerTodos, 825)
setTimeout(actualizarPorId, 850, 2, {title: 'Producto cambiado', price: 999});

setTimeout(obtenerTodos, 900)

setTimeout(borrarPorId, 950, 2);

setTimeout(obtenerTodos, 1000)