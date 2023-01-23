const Product = require('../models/products')
const User = require('../models/user')
const Sale = require('../models/sales')
const Cashier = require('../models/cashiers')
const yesId = require('../yesId')


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
    
    app.get('/change-status-product/:id', async(req, res) =>{
        let id = req.params.id
        
        try {
            let product = await Product.findById({_id: id})

            if(product.status){
                product.status = false
            }else{
                product.status = true
            }

            await product.save()
            res.json({msg:"El estado del producto fue actualizado"})
        } catch (error) {
            console.log(error);
            res.json({msg:"Un problema ha ocurrido"})
        }
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

        let product = user.products.find(product => product.idcode == code)
    
        if(product == null || product.status == false){
            return res.json({status: false, msg: `Este producto ${code} no existe en la base de datos o esta desactivado`})
        }else{
            return res.json({product})
        }
    })
    
    app.post('/new-product', async(req, res)=>{
        let data = req.body
        const user = req.user
        const newProduct = new Product()

        let _itbis_ = data.itbis || 0.00;
        let sum_price = (parseFloat(data.price) + parseFloat(_itbis_))
    
        newProduct.idcode = data.idcode
        newProduct.name = data.name
        newProduct.price = data.price
        newProduct.sum_price = sum_price
        newProduct.description = data.description
        newProduct.category = data.category
        newProduct.itbis = _itbis_
        newProduct.user = user
        user.products.push(newProduct)
    
        await newProduct.save()
        await user.save()
        res.json({status:true})
    })
    
    app.put('/update-product', async(req, res) =>{
        let data = req.body
    
        let _itbis_ = data.itbis || 0.00

        await Product.updateOne({_id: data._id}, {
            $set: {
                idcode: data.idcode,
                name: data.name,
                price: data.price,
                sum_price: (parseFloat(data.price) + parseFloat(_itbis_)),
                description: data.description,
                category: data.category,
                itbis: _itbis_
            }
        })
        res.json({msg:'El producto fue actualizado correctamente'})
    })
    
    app.post('/new-sale', async(req, res) =>{
        const user = req.user
        let data = req.body

        const user_data = await User.findById({_id: user._id}).populate('sales')
    
        function getCode() {
            if(user_data.sales.some(sale => sale.code === yesId(9,'10'))){
                return getCode()
            }
            return yesId(9, '10')
        }   

        const newSale = new Sale()
        newSale.code = getCode()
        newSale.totalPrice = data.totalPrice
        newSale.subTotal = data.subTotal
        newSale.itbis = data.itbis
        newSale.pay = data.pago
        newSale.cambio = data.cambio
        newSale.user = user
        data.products.forEach(product => {
            let prod =  {productCode: product.idcode, price:product.price}  
            newSale.products.push(product)
            newSale.productsSold.push(prod)
        });
        
        if(data.cashier_id !== null){
            const cashier = await Cashier.findOne({_id: data.cashier_id})
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
        const user_cashier = await User.findById({_id: user._id}).populate('cashiers')

        

        function getCodeId() {
            if(user_cashier.cashiers.some(cashier => cashier.id_code === yesId(5))){
                return getCodeId()
            }
            return yesId(5)
        }
    
        const newCashier = new Cashier()
        newCashier.name = data.name
        newCashier.lastName = data.lastName
        newCashier.id_document = data.id_document
        newCashier.tel = data.tel
        newCashier.email = data.email
        newCashier.id_code = getCodeId()
        newCashier.user = user
        user.cashiers.push(newCashier)

        await user.save()
        await newCashier.save()

        return res.json({msg:'Cajeros agregado exitosamente', conFirm: true})
    })

    app.post('/status-cashier', async(req, res)=>{
        let data = req.body
        try {
            let cashier = await Cashier.findById({_id: data.id})
            if(cashier.status){
                cashier.status = false
            }else{
                cashier.status = true
            }
            
            await cashier.save()
            return res.json({msg: 'El estado del cajero/a fue actualizado'})
        } catch (error) {
            console.log(error);
            res.json({msg: 'Un problema ha ocurrido'})
        }
        
    })

    app.get('/cashier-detail/:id', async(req, res) =>{
        let id = req.params.id
        const cashier = await Cashier.findById({_id: id})
        res.json({cashier})
    })

    app.post('/store-info', async(req, res) =>{
        const user = req.user
        const data = req.body

        user.storeName = data.name || user.storeName;
        user.storeAddress = data.address || user.storeAddress;
        user.footText = data.footText || user.footText;
        user.typeStore = data.typeStore || user.typeStore;
        user.system_control.typePrint = data.typePrint || user.system_control.typePrint;

        await user.save()
        res.json({user})
    })

    app.post('/accept-itbis', async(req, res) =>{
        let user = req.user
        let data = req.body

        if(data.x == '1'){
            if(data.value){
                user.system_control.acceptITBIS = true
            }else{
                user.system_control.acceptITBIS = false
            }
        }
        if(data.x == '2'){
            if(data.value){
                user.system_control.add_N_C_receipt = true
            }else{
                user.system_control.add_N_C_receipt = false
            }
        }

        await user.save()
        res.json(data)
    })
}