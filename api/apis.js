const Product = require('../models/products')
const User = require('../models/user')
const Sale = require('../models/sales')
const Cashier = require('../models/cashiers')
const PlanPro = require('../models/proPlan')
const Client = require('../models/clients')
const yesId = require('../yesId')


module.exports = (app) =>{

    //this function receives a date and returns a new date calculating 31 days after
    function nextMonth(date){
        let dayCount = 31;
        let days = dayCount * (1000 * 3600 * 24);
        let newDate = date.getTime() + days;
        return new Date(newDate);
    }

    async function removeUserToPlanPro(){
        const allInPlanPro = await PlanPro.find()
        let _time = 43200000;

        setInterval(() =>{
            allInPlanPro.forEach(async(user, index) =>{
                let currentD = new Date()
                let endD = new Date(user.endDate)
                let endDate = `${endD.getMonth()}${endD.getDate()}${endD.getFullYear()}`
                let currentDate = `${currentD.getMonth()}${currentD.getDate()}${currentD.getFullYear()}`
    
                if(endDate === currentDate){
                    let userd = await User.findOne({_id: user.userId})
                    userd.planPro = false
                    allInPlanPro.splice(index,1)
                    await allInPlanPro.save()
                    await userd.save()
                }
            })
        }, _time)
    }
    removeUserToPlanPro()

    app.post('add-user-to-planPro/:id', async(req, res) =>{
        const user = req.user;

        if(req.params.id == user._id){
            const addUser = new PlanPro()
            addUser.initialDate = new Date()
            addUser.endDate = nextMonth(new Date())
            addUser.userId = req.params.id
            user.planPro = true;

            await addUser.save()
            await user.save()
            return res.json({msg: 'Ya eres parte de nuestro plan Pro, ya puedes disfrutar de las funciones adicionales'})
        }
        res.json({status: false})
    })

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
        const user = req.user
        let data = req.body
        let limit = user.planPro ? 100 : 25;

        const myUser = await User.findOne({_id: user._id}).populate('products')

        if(myUser.products.length < limit){
            let _itbis_ = data.itbis || 0.00;
            let sum_price = (parseFloat(data.price) + parseFloat(_itbis_))
        
            const newProduct = new Product()
            newProduct.idcode = data.idcode
            newProduct.name = data.name
            newProduct.buy_price = data.buy_price
            newProduct.price = data.price
            newProduct.sum_price = sum_price
            newProduct.description = data.description
            newProduct.category = data.category
            newProduct.itbis = _itbis_
            newProduct.user = user
            user.products.push(newProduct)
        
            await newProduct.save()
            await user.save()
            return res.json({status:true})
        }
        return res.json({
            msg: 'Ha llegado a su limite de productos, si desea agregar mas productos por favor comuniquense con nosotros a través de nuestro correo killycenecharles30@gmail.com'
        })
    })
    
    app.put('/update-product', async(req, res) =>{
        let data = req.body
        let _itbis_ = data.itbis || 0.00

        await Product.updateOne({_id: data._id}, {
            $set: {
                idcode: data.idcode,
                name: data.name,
                buy_price: data.buy_price,
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
            if(user_data.sales.some(sale => sale.code === yesId(9,'100'))){
                return getCode()
            }
            return yesId(9, '100')
        }   

        const newSale = new Sale()
        newSale.code = getCode()
        newSale.totalPrice = data.totalPrice
        newSale.subTotal = data.subTotal
        newSale.itbis = data.itbis
        newSale.pay = data.pago
        newSale.cambio = data.cambio
        newSale.useItbis = user.system_control.sale_with_ITBIS ? true : false
        newSale.user = user

        data.products.forEach(product => {
            let prod =  {
                productCode: product.idcode, 
                buy_price: product.buy_price, 
                price:product.price,
                itbis: user.system_control.sale_with_ITBIS ? product.itbis : 0
            }  
            newSale.products.push(product)
            newSale.productsSold.push(prod)
        });
        
        if(data.cashier_id !== null){
            const cashier = await Cashier.findOne({_id: data.cashier_id})
            newSale.cashier = cashier
            cashier.sales.push(newSale)
            await cashier.save()
        }

        if(data.client_id !== null){
            const client = await Client.findOne({_id: data.client_id})
            newSale.client = client
            client.sales.push(newSale)
            await client.save()
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
        const user = req.user
        const myUser = await User.findOne({_id: user._id}).populate('cashiers')
        let limit = user.planPro ? 4 :  1
        let data = req.body
        try {
            let cashier = await Cashier.findById({_id: data.id})
            let activeCashier = myUser.cashiers.filter(cashier => cashier.status == true)

            if(cashier.status){
                cashier.status = false
                await cashier.save()
                return res.json({msg: 'El estado del cajero/a fue actualizado'})
            }
            if(activeCashier.length < limit){
                if(!cashier.status){
                    cashier.status = true
                    await cashier.save()
                    return res.json({msg: 'El estado del cajero/a fue actualizado'})
                }
            }

            return res.json({
                msg: 'Ha llegado a su limite de cajeros activos, si desea activar mas cajeros por favor comuniquense con nosotros a través de nuestro correo killycenecharles30@gmail.com'
            })
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
        user.storeNumber = data.storeNumber || user.storeNumber;
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
        if(data.x == '3'){
            if(data.value){
                user.system_control.sale_with_ITBIS = true
            }else{
                user.system_control.sale_with_ITBIS = false
            }
        }

        await user.save()
        res.json(data)
    })

    app.post('/create-client', async(req, res)=>{
        const user = req.user;
        const data = req.body;
        let limit = user.planPro ? 100 :  15

        const user_client = await User.findById({_id: user._id}).populate('clients')

        function getCodeId() {
            if(user_client.clients.some(client => client.id_client === yesId(5, '12'))){
                return getCodeId()
            }
            return yesId(5, '12')
        }

        try {
            if(user_client.clients.length < limit){
                const newClient = new Client()
                newClient.name = data.name;
                newClient.lastName = data.lastName;
                newClient.tel = data.tel;
                newClient.id_doc = data.doc_id;
                newClient.email = data.email;
                newClient.id_client = data.id_client || getCodeId()
                newClient.user = user
        
                user.clients.push(newClient)
        
                await user.save()
                await newClient.save()
                return res.json({status:true})
            }
            return res.json({
                msg: 'Ha llegado al limite de clientes permitidos por este plan, si desea agregar mas clientes por favor comuniquense con nosotros a través de nuestro correo killycenecharles30@gmail.com'
            })
        } catch (error) {
            console.log(error);
        }
    })

    app.get('/get-clients', async(req, res)=>{
        const user = req.user
        const clients = await Client.find({user: user._id}).populate('sales')
        const my_user = User.findOne({_id: user._id}).populate('clients')

        res.json({data: clients})
    })
}