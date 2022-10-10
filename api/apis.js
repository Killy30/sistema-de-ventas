const Product = require('../models/products')
const User = require('../models/user')
const Sale = require('../models/sales')
const Cashier = require('../models/cashiers')
const yesId = require('../yesId')
const { findById } = require('../models/products')

module.exports = (app) =>{

    app.get('/get-products', async(req, res) =>{
        const user = req.user
        const products = await User.findById({_id: user._id}).populate('products')
        let my_products = products.products

        res.json({my_products})
    })

    app.get('/get-user', async(req, res) =>{
        const _user = req.user;
        const user = await User.findOne({_id: _user._id}).populate('cashiers')
        
        res.json({data:user})
    })
    
    app.get('/get-sales', async(req, res) =>{
        const user = req.user
        const sales = await Sale.find({user: user._id})

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
        const user = req.user
        let product = await Product.findByIdAndDelete({_id:id})
        let p_id = user.products.indexOf(id)

        if(p_id >= 0){
            user.products.splice(p_id, 1)
            await user.save()
        }
        res.json({msg:"Producto eliminado"})
    })
    
    app.get('/update-product/:id', async(req, res) =>{
        let id = req.params.id
        let product = await Product.findById({_id:id})
        res.json({product})
    })
    
    app.get('/get-product-by-code/:code', async(req, res) =>{
        const _user = req.user
        let code = req.params.code

        let user = await User.findById({_id: _user._id}).populate('products')

        let product = user.products.find((product)=> product.idcode == code)
    
        if(product == null){
            return res.json({status: false, msg: `Este codigo ${code} no existe en la base de datos`})
        }else{
            return res.json({product})
        }
    })
    
    app.post('/new-product', async(req, res)=>{
        let data = req.body

        const user = req.user
        const newProduct = new Product()
    
        newProduct.idcode = data.idcode
        newProduct.name = data.name
        newProduct.price = data.price
        newProduct.description = data.description
        newProduct.category = data.category
        newProduct.user = user
        user.products.push(newProduct)
    
        await newProduct.save()
        await user.save()
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
        const user = req.user
        let data = req.body
        const sales = await Sale.find()
    
        function getCode() {
            if(sales.some(sale => sale.code === yesId(10))){
                return getCode()
            }
            return yesId(10)
        }    

        let cashier_id;
        const cashiers = await User.findById({_id: user._id}).populate('cashiers')
        cashiers.cashiers.forEach(async(cashier) =>{
            if(cashier.active === true){
                cashier_id = cashier._id
            }
        })
    
        const newSale = new Sale()
        newSale.code = getCode()
        newSale.totalPrice = data.totalPrice
        newSale.pay = data.pago
        newSale.cambio = data.cambio
        newSale.user = user
    
        data.products.forEach(element => {
            newSale.products.push(element)
        });

        if(cashier_id !== undefined){
            const cashier = await Cashier.findOne({_id: cashier_id})
            newSale.cashier = cashier
            cashier.sales.push(newSale)
            await cashier.save()
        }

        await newSale.save()
        await user.save()
        res.json({status:true, id:newSale._id, msg:'La venta se completo exitosamente'})
    })

    app.post('/new-cashier', async(req, res) =>{

        let data = req.body
        const user = req.user
        const cashier = await Cashier.find()

        function getCodeId() {
            if(cashier.some(cashier => cashier.id_code === yesId(6))){
                return getCodeId()
            }
            return yesId(6)
        }
    
        const newCashier = new Cashier()
        newCashier.name = data.name
        newCashier.lastName = data.lastName
        newCashier.id_document = data.id_document
        newCashier.id_code = getCodeId()
        newCashier.user = user
        user.cashiers.push(newCashier)

        await user.save()
        await newCashier.save()

        res.json({msg:'usuario agregado exitosamente'})
    })

    app.post('/delete-cashier', async(req, res)=>{
        let data = req.body
        try {
            await Cashier.findByIdAndDelete({_id: data.id})
            return res.json({msg: 'El cajero/a fue eliminado'})
        } catch (error) {
            console.log(error);
            res.json({msg: 'Un problema ha ocurrido'})
        }
        
    })

    app.post('/user-active', async(req, res) =>{
        let user = req.user
        let id = req.body.id
        const cashiers = await User.findById({_id: user._id}).populate('cashiers')
        cashiers.cashiers.forEach(async(cashier) =>{
            if(cashier.active === true){
                cashier.active = false
                await cashier.save()
            }
        })
        if(id !== 'no_data'){
            const cashier = await Cashier.findOne({_id: id})
            cashier.active = true
            await cashier.save()
        }
        res.json({msg:'good'})
    })

    app.post('/store-name', async(req, res) =>{
        const user = req.user
        const data = req.body

        user.storeName = data.name
        user.storeAddress = data.address

        await user.save()
        res.json({user})
    })
}