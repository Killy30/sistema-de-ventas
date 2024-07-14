const Product = require('../models/products')
const User = require('../models/user')
const Sale = require('../models/sales')
const Cashier = require('../models/cashiers')
const Plan = require('../models/plan')
const Client = require('../models/clients')
const Checkout = require('../models/checkout')
const yesId = require('../yesId')
const control_months = require('../functions/control_months')
const planData = require('../functions/planData')
const os = require('os')

const changePlanStatus = require('./planStatus')
const pagination = require('./pagination')
const checkPlanStatus = require('../functions/checkPlanStatus')



module.exports = (app) =>{
    
    const timeOut = 43200000;
    const OUREMAIL = 'killycenecharles30@gmail.com'
    const APIBASE = '/data-apis'

    setInterval(()=> changePlanStatus(), timeOut)

    function isAuthenticated(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        return res.json({message:'you are enable to access to this api'})
    } 

    app.get(APIBASE + '/check-plan-status', isAuthenticated, (req, res) =>{
        const user = req.user;
        let msg = 'Su cuenta ha sido dessavilidata'
        checkPlanStatus(user._id)
        return res.json({status: true, msg:msg, color: 'alert alert-danger'})
    })

    app.post(APIBASE + '/add-user-to-plan/:id', isAuthenticated, async(req, res) =>{
        const user = req.user;
        let data = req.body;

        if(req.params.id == user._id){
            let cut_date = control_months(new Date(), null, 5)
            const plan = await Plan.findOne({user: user._id})

            plan.planType = data.planType;
            plan.currentPlanId = yesId(8,`${data.planType}-${new Date().getTime()}`)
            plan.cutOffDate = cut_date;
            plan.planData = (data.planType == 'pro')? planData.pro : planData.premum
            plan.payHistory.push({
                planId: plan.currentPlanId,
                initialDate: new Date(),
                endDate: cut_date
            })
            user.planType = data.planType;
            
            await addUser.save()
            await user.save()
            return res.json({msg: `Ya eres parte de nuestro plan ${data.planType}, ya puedes disfrutar de las funciones adicionales`})
        }
        return res.json({status: false})
    })


    app.get(APIBASE + '/get-products', isAuthenticated, async(req, res) =>{
        try {
            const user = req.user;
            const products = await Product.find({user: user._id});
            let my_products = products

            res.json({my_products})
        } catch (error) {
            console.log(error);
        }
    })

    app.get(APIBASE + '/products-pagination/:index', isAuthenticated, async(req, res) => {
        try {
            let index = req.params.index;
            const user = req.user;
            const products = await Product.find({user: user._id}).sort({date: -1});
            let my_products = pagination(products, 30, index)
            res.json(my_products)
        } catch (error) {
            console.log(error);
        }
    })

    app.get(APIBASE + '/sales-pagination/:index', isAuthenticated, async(req, res) => {
        try {
            let index = req.params.index;
            const user = req.user;
            const sales = await Sale.find({user: user._id}).sort({date: -1})
            let my_sales = pagination(sales, 30, index)
            res.json(my_sales)
        } catch (error) {
            console.log(error);
        }
    })

    app.get(APIBASE + '/sales-date-pagination/:data', isAuthenticated, async(req, res) => {
        try {
            let data = JSON.parse(req.params.data) 
            let index = data.pageIndex
            const user = req.user;
            const sales = await Sale.find({user: user._id})

            const sales_day = sales.filter( sale => {
                let date = new Date(sale.date)
                let month = ((date.getMonth()+1) > 9) ? (date.getMonth()+1) : `${0}${(date.getMonth()+1)}`;
                let day = (date.getDate() > 9) ? date.getDate() : `${0}${date.getDate()}`;
                let year = date.getFullYear()

                
                if(data.searchType == 'day'){
                    if(data.cashier_id == undefined || data.cashier_id == '404') return data.textDate == `${year}-${month}-${day}`
                    if(data.cashier_id != undefined || data.cashier_id != '404') return data.textDate == `${year}-${month}-${day}` && sale.cashier == data.cashier_id
                } 
                
                if(data.searchType == 'month'){
                    if(data.cashier_id == undefined || data.cashier_id == '404') return data.textDate == `${year}-${month}`
                    if(data.cashier_id != undefined || data.cashier_id != '404') return data.textDate == `${year}-${month}` && sale.cashier == data.cashier_id
                } 

                if(data.searchType == 'all') return sale.cashier == data.cashier_id
                if(data.searchType == 'code') return data.textDate == sale.code
            })
            
            let my_sales = pagination(sales_day, 30, index)
            res.json(my_sales)
        } catch (error) {
            console.log(error);
        }
    })

    app.get(APIBASE + '/get-user', isAuthenticated, async(req, res) =>{
        try {
            const _user = req.user;
            const user = await User.findById({_id: _user._id})

            res.json({data:user})
        } catch (error) {
            console.log(error);
        }
    })

    app.get(APIBASE + '/users-pagination/:index', isAuthenticated, async(req, res) =>{
        try {
            const _user = req.user;
            const index = req.params.index;
            const cashier = await Cashier.find({user: _user._id}).sort({date: -1})    
            const cashier_page = pagination(cashier, 20, index)
            res.json(cashier_page)
        } catch (error) {
            console.log(error);
        }
    })

    app.get(APIBASE + '/get-cashiers', isAuthenticated, async(req, res) =>{
        try {
            const user = req.user;
            const cashiers = await Cashier.find({user: user._id})
            res.json(cashiers)
        } catch (error) {
            console.error(error);
        }
    })

    app.get(APIBASE + '/get-checkouts', isAuthenticated, async(req, res) =>{
        try {
            const user = req.user;
            const checkout = await Checkout.find({user: user._id})
            res.json({checkout})
        } catch (error) {
            console.log(error);
        }
    })
    
    app.get(APIBASE + '/get-sales', isAuthenticated, async(req, res) =>{
        try {
            // console.log(os.platform());
            // console.log(os.release());
            // console.log(os.type());
            // console.log(os.machine());
            // console.log(os.hostname());
            // console.log(os.homedir());
            // console.log(os.EOL);
            const user = req.user
            const sales = await Sale.find({user: user._id})

            const sales_today = sales.filter( sale => {
                let today = new Date(Date.now())
                let date = new Date(sale.date)
                let fullToday = `${today.getDate()}/${today.getMonth()+1}/${today.getFullYear()}`
                let fulldate = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
                return fullToday == fulldate
            })

            return res.json({sales_today, sales})
        } catch (error) {
            console.log(error);
        }
    })
    
    app.get(APIBASE + '/get-sale/:id', isAuthenticated, async(req, res) =>{
        try {
            const sale = await Sale.findById({_id: req.params.id}).populate('products')
            return res.json({sale})
        } catch (error) {
            console.log(error);
        }
    })

    app.get(APIBASE + '/get-clients', isAuthenticated, async(req, res)=>{
        try {
            const user = req.user
            const clients = await Client.find({user: user._id}).populate('sales')
            const my_user = User.findOne({_id: user._id}).populate('clients')

            return res.json({data: clients})
        } catch (error) {
            console.log(error);
        }
    })

    app.get(APIBASE + '/clients-pagination/:index', isAuthenticated, async(req, res)=>{
        try {
            const user = req.user
            let index = req.params.index
            const clients = await Client.find({user: user._id}).populate('sales')
            const clients_page = pagination(clients, 30, index)

            return res.json(clients_page)
        } catch (error) {
            console.log(error);
        }
    })
    
    app.get(APIBASE + '/change-status-product/:id', isAuthenticated, async(req, res) =>{
        let id = req.params.id
        
        try {
            let product = await Product.findById({_id: id})

            if(product.status){
                product.status = false
            }else{
                product.status = true
            }

            await product.save()
            return res.json({msg:"El estado del producto fue actualizado"})
        } catch (error) {
            console.log(error);
            res.json({msg:"Un problema ha ocurrido"})
        }
    })
    
    app.get(APIBASE + '/update-product/:id', isAuthenticated, async(req, res) =>{
        try {
            let id = req.params.id
            let product = await Product.findById({_id:id})
            return res.json({product})
        } catch (error) {
            console.log(error);
        }  
    })
    
    app.get(APIBASE + '/get-product-by-code/:code', isAuthenticated, async(req, res) =>{
        try {
            const _user = req.user
            let code = req.params.code
    
            let user = await User.findById({_id: _user._id}).populate('products')
    
            let product = user.products.find(product => product.idcode == code)
        
            if(product == null || product.status == false){
                return res.json({status: false, msg: `Este producto ${code} no existe en la base de datos o esta desactivado`})
            }else{
                return res.json({product})
            }
        } catch (error) {
            console.log(error);
        }
    })

    //search elements 
    app.get(APIBASE + '/search-elements/:data', isAuthenticated, async (req, res) =>{
        try {
            const user = req.user;
            const data = JSON.parse(req.params.data);
            
            let text = data.text.toLowerCase();

            //search clients
            if(data.element == 'clients'){
                const clients = await Client.find({user: user._id});

                let clientsSearch = clients.filter(client => {
                    let name = client.name.toLowerCase()
                    let lastName = client.lastName.toLowerCase()
                    let id_client = client.id_client.toLowerCase()
                    let id_doc = client.id_doc.toLowerCase()
                    // let tel = client.tel.toString()

                    return name.indexOf(text) !== -1 || lastName.indexOf(text) !== -1 
                    || id_client.indexOf(text) !== -1 || id_doc.indexOf(text) !== -1 
                })

                const outputClient = pagination(clientsSearch, 30, data.index)
                return res.json(outputClient)
            }
            
            //search products
            if(data.element == 'products'){
                const products = await Product.find({user: user._id});

                let clientsSearch = products.filter(product => {
                    let name = product.name.toLowerCase()
                    let idcode = product.idcode.toString()
                    let category = product.category.toLowerCase()

                    return name.indexOf(text) !== -1 || idcode.indexOf(text) !== -1 || category.indexOf(text) !== -1
                })

                const outputClient = pagination(clientsSearch, 30, data.index)
                return res.json(outputClient)
            }

            //search users
            if(data.element == 'users'){
                const users = await Cashier.find({user: user._id});
                

                let clientsSearch = users.filter(cashier => {
                    let name = cashier.name.toLowerCase()
                    let lastName = cashier.lastName.toLowerCase()
                    let id_code = cashier.id_code.toString()
                    let id_document = cashier.id_document.toLowerCase()

                    return id_code.indexOf(text) !== -1 || id_document.indexOf(text) !== -1
                    || name.indexOf(text) !== -1 || lastName.indexOf(text) !== -1
                })

                const outputClient = pagination(clientsSearch, 30, data.index)
                return res.json(outputClient)
            }
        } catch (error) {
            console.log(error);
        }
    })

    app.post(APIBASE + '/new-category', isAuthenticated, async(req, res) =>{
        try {
            const user = req.user;
            let data = {category: req.body.data}
            user.prod_category.push(data)

            await user.save()
            return res.json({msg: 'Nueva categoria ha sido agregada exitosamente'})
        } catch (error) {
            console.log(error);
        }
    })
    
    app.post(APIBASE + '/new-product', isAuthenticated, async(req, res)=>{
        try {
            const user = req.user
            checkPlanStatus(user._id) // check if the user is active

            const plan = await Plan.findOne({user: user._id})
            const myUser = await User.findOne({_id: user._id}).populate('products')

            let data = req.body
            let limit = plan.planData.products;
    
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
        } catch (error) {
            
        }
    })
    
    app.put(APIBASE + '/update-product', isAuthenticated, async(req, res) =>{
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
        return res.json({msg:'El producto fue actualizado correctamente'})
    })
    
    app.post(APIBASE + '/new-sale', isAuthenticated, async(req, res) =>{
        const user = req.user
        let data = req.body

        try {
            checkPlanStatus(user._id) // check if the user is active

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
            
            const checkout = await Checkout.findOne({idConnection: data.connection_checkout_id})
            const cashier = await Cashier.findOne({idConnection: data.connection_cashier_id})

            newSale.checkout = checkout
            newSale.cashier = cashier
            checkout.sales.push(newSale)
            cashier.sales.push(newSale)
            
            if(data.client_id !== null){
                const client = await Client.findOne({_id: data.client_id})
                newSale.client = client
                client.sales.push(newSale)
                await client.save()
            }

            await newSale.save()
            await user.save()
            await checkout.save()
            await cashier.save()
            return res.json({status:true, id:newSale._id, msg:'La venta se completo exitosamente'})
        } catch (error) {
            console.error(error);
        }
    })

    app.post(APIBASE + '/new-cashier', isAuthenticated, async(req, res) =>{
        try {
            const user = req.user
            checkPlanStatus(user._id) // check if the user is active

            let data = req.body
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
        } catch (error) {
            console.log(error);
        }
    })

    app.post(APIBASE + '/status-cashier', isAuthenticated, async(req, res)=>{
        const user = req.user
        const myUser = await User.findOne({_id: user._id}).populate('cashiers')
        const plan = await Plan.findOne({user: user._id})
        let data = req.body
        let limit = plan.planData.users;

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

    app.get(APIBASE + '/cashier-detail/:id', isAuthenticated, async(req, res) =>{
        try {
            let id = req.params.id
            const cashier = await Cashier.findById({_id: id})
            return res.json({cashier})
        } catch (error) {
            console.log(error);
        }
    })

    app.post(APIBASE + '/cashier-connected/:id', isAuthenticated, async (req, res) =>{
        const id = req.params.id;
        try {
            const casheir = await Cashier.findById({_id: id})
            const checkout = await Checkout.findById({_id: req.body.checkout_id})
    
            if(!casheir.connect){
                casheir.connect = true;
                casheir.idConnection = yesId(17, 'CA-')
                checkout.cashier = `${casheir.name} ${casheir.lastName}`
    
                await casheir.save()
                await checkout.save()
                return res.json({
                    msg: `Su usuario ha sido conectado ecxitosamente`, 
                    color:'alert alert-success',
                    idConnection: casheir.idConnection,
                    code: casheir.id_code
                })
            }
            return res.json({msg:`Su usuario ya se encuatra conectado en otro dispositivo`, color:'alert alert-warning'})
            
        } catch (error) {
            console.log(error);
        }
    })

    app.post(APIBASE + '/cashier-disconnected/:id', isAuthenticated, async (req, res)=>{
        const id = req.params.id;
        try {
            const casheir = await Cashier.findById({_id: id})
            
            if(casheir.connect){
                casheir.connect = false;
                casheir.idConnection = ''
                
                if(req.body.checkout_id){
                    const checkout = await Checkout.findById({_id: req.body.checkout_id})

                    checkout.cashier = ''
                    await checkout.save()
                }

                await casheir.save()
                return res.json({
                    msg: `Su usuario ha sido deconectado`, 
                    color:'alert alert-success',
                    idConnection: casheir.idConnection 
                })
            }
        } catch (error) {
            console.log(error);
        }
    })

    app.post(APIBASE + '/store-info', isAuthenticated, async(req, res) =>{
        const user = req.user
        const data = req.body

        user.storeName = data.name || user.storeName;
        user.storeNumber = data.storeNumber || user.storeNumber;
        user.storeAddress = data.address || user.storeAddress;
        user.footText = data.footText || user.footText;
        user.typeStore = data.typeStore || user.typeStore;
        user.system_control.typePrint = data.typePrint || user.system_control.typePrint;

        await user.save()
        return res.json({user})
    })

    app.post(APIBASE + '/accept-itbis', isAuthenticated, async(req, res) =>{
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
        return res.json(data)
    })

    app.post(APIBASE + '/create-client', isAuthenticated, async(req, res)=>{
        const user = req.user;
        const plan = await Plan.findOne({user: user._id})
        const data = req.body
        const limit = plan.planData.clients;

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

    app.post(APIBASE + '/new-checkout', isAuthenticated, async(req, res) =>{
        try {
            const user = req.user
            checkPlanStatus(user._id) // check if the user is active

            const checkout = await Checkout.find({user: user._id})
            const plan = await Plan.findOne({user: user._id})
            const limit = plan.planData.checkouts;
    
            const count = checkout.length 
        
            if(count < limit){
                const newCheckout = new Checkout()
                newCheckout.checkout = count + 1;
                newCheckout.entryCode = yesId(4, `${count + 1}00`)
                newCheckout.user = user
                user.checkouts.push(newCheckout)

                await user.save()
                await newCheckout.save()
                return res.json({status:true})
            }
            let msg = `Para su plan solo tienes permitido ${limit} Caja, si deseas agregar mas Cajas por favor comunicate con nosotros a través de nuestro correo ${OUREMAIL}`
            return res.json({ msg: msg })
        } catch (error) {
            console.log(error);
        }
    })

    app.get(APIBASE + '/connect-to-checkout/:id', isAuthenticated, async (req, res) =>{
        try {
            const id = req.params.id;
            const checkout = await Checkout.findOne({_id: id})

            if(!checkout.connect){
                checkout.connect = true;
                checkout.idConnection = yesId(17, 'CH-')

                await checkout.save()
                return res.json({
                    msg: `La caja#${checkout.checkout} ha sido conectado ecxitosamente`, 
                    color:'alert alert-success',
                    idConnection: checkout.idConnection
                })
            }
            return res.json({msg:`La caja#${checkout.checkout} esta conectado en otro dispositivo`, color:'alert alert-warning'})
        } catch (error) {
            console.log(error);
        }
    })

    app.get(APIBASE + '/disconnect-checkout/:id', isAuthenticated, async (req, res) =>{
        try {
            let id = req.params.id;
            const checkout = await Checkout.findById({_id: id});
            if(checkout.connect){
                checkout.connect = false;
                checkout.idConnection = ''
                checkout.cashier = ''
                
                await checkout.save()
                return res.json({msg: `La caja#${checkout.checkout} ha sido desconectado ecxitosamente`, color:'alert alert-success'})
            }
            return res.json({msg:`La caja#${checkout.checkout} no esta conectado a ningun dispositivo`, color:'alert alert-warning'})
        } catch (error) {
            console.log(error);
        }

    })

    app.get(APIBASE + '/active-checkout/:id', isAuthenticated, async (req, res) =>{
        try {
            let id = req.params.id;
            const checkout = await Checkout.findById({_id: id});

            if(checkout.active){
                checkout.active = false;
                
                if(checkout.connect){
                    checkout.connect = false;
                    checkout.idConnection = ''
                    checkout.cashier = ''
                }

                await checkout.save()
                return res.json({msg: `La caja#${checkout.checkout} ha desactivado correctamente`, color:'alert alert-success'})
            }else{
                checkout.active = true;
                await checkout.save()
                return res.json({msg: `La caja#${checkout.checkout} ha Activado correctamente`, color:'alert alert-success'})
            }
        } catch (error) {
            console.log(error);
        }
    })
}