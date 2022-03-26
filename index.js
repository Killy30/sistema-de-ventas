const express = require('express')
const path = require('path')
const Product = require('./models/products')
const Sale = require('./models/sales')
const yesId = require('./yesId')

const app = express()

require('./dataBase/config')
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname, './public/html/main.html'))
})

app.get('/productos', (req, res)=>{
    res.sendFile(path.join(__dirname, './public/html/products.html'))
})

app.get('/ventas', (req, res)=>{
    res.sendFile(path.join(__dirname, './public/html/sales.html'))
})

app.get('/factura/:id', async(req, res)=>{
    const sale = await Sale.findById({_id: req.params.id})
    res.sendFile(path.join(__dirname, './public/html/factura.html'))
})


app.get('/get-products', async(req, res) =>{
    const products = await Product.find()
    res.json({products})
})

app.get('/get-sales', async(req, res) =>{
    const sales = await Sale.find()

    const sales_today = sales.filter( sale => {
        let today = new Date(Date.now())
        let date = new Date(sale.date)
        let fullToday = `${today.getDate()}/${today.getMonth()+1}/${today.getFullYear()}`
        let fulldate = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
        return fullToday == fulldate
    })
    res.json({sales_today, sales})
})

app.get('/get-sale/:id', async(req, res) =>{
    const sale = await Sale.findById({_id: req.params.id}).populate('products')
    res.json({sale})
})


app.get('/delete-product/:id', async(req, res) =>{
    let id = req.params.id
    let product = await Product.findByIdAndDelete({_id:id})
    res.json({msg:"Producto eliminado"})
})

app.get('/update-product/:id', async(req, res) =>{
    let id = req.params.id
    let product = await Product.findById({_id:id})
    res.json({product})
})

app.get('/get-product-by-code/:code', async(req, res) =>{
    let code = req.params.code

    let product = await Product.findOne({idcode:code})

    if(product == null){
        return res.json({status: false, msg: `Este codigo ${code} no existe en la base de datos`})
    }else{
        return res.json({product})
    }
})


app.post('/new-product', async(req, res)=>{
    let data = req.body
    const newProduct = new Product()

    newProduct.idcode = data.idcode
    newProduct.name = data.name
    newProduct.price = data.price
    newProduct.description = data.description
    newProduct.category = data.category

    await newProduct.save()
    res.json({newProduct})
})

app.post('/update-product', async(req, res) =>{
    let data = req.body
    const products = await Product.find()

    await Product.updateOne({_id: data._id}, {
        $set: {
            idcode: data.idcode,
            name: data.name,
            price: data.price,
            description: data.description,
            category: data.category
        }
    })

    res.json({msg:'El producto fue actualizado correctamente'})
})

app.post('/new-sale', async(req, res) =>{
    
    let data = req.body

    const sales = await Sale.find()

    function getCode() {
        if(sales.some(sale => sale.code === yesId(10))){
            return getCode()
        }
        return yesId(10)
    }    

    const newSale = new Sale()
    newSale.code = getCode()
    newSale.totalPrice = data.totalPrice
    newSale.pay = data.pago
    newSale.cambio = data.cambio

    data.products.forEach(element => {
        newSale.products.push(element)
    });

    await newSale.save()
    res.json({status:true, id:newSale._id, msg:'La venta se completo exitosamente'})
})


app.listen(80, ()=>{
    console.log('app listening at http://%s:%s');
})