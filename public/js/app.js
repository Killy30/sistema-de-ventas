const showListProduct = document.getElementById('showListProduct')
const tbody = document.getElementById('tbody')
const listCashiers = document.getElementById('listCashiers')
const _checkouts = document.getElementById('checkouts')
const countSales = document.querySelector('#countSales')
const modalBoxLog = document.querySelector('#modalBoxLog')
const cardSearchProducts = document.getElementById('cardSearchProducts')

import loader from "./loader.js"
import fecha from "./month_es.js"
import data from "./data.js"
import emergent_alert from "./emergentAlert.js"
import handleElements from "./handleElements.js"


let listProducts = []
let dataCasheir;
const APIBASE = '/data-apis'

const getSales = async() =>{
    try {
        tbody.innerHTML = `${loader()}`
        return data.getSales()
    } catch (error) {
        console.log(error);
    }
}

const getUser = async() =>{
    try {
        return data.getUser()
    } catch (error) {
        console.log(error);
    }
}

//this function allows the user to configure the data before using the application
const verifyStoreName = async()=>{
    let user = await getUser()
    if(user.data.storeName){
        document.querySelector('.box_store_name').style.display = 'none'
        document.querySelector('#container').style.display = 'block'
    }else{
        document.querySelector('.box_store_name').style.display = 'flex'
        document.querySelector('#container').style.display = 'none'
    }
}
verifyStoreName()

//configure the data
const post_store_name = async(e)=>{
    let p_store_name = document.getElementById('p_store_name')
    let type_b = document.getElementById('type_b')
    if(p_store_name.value.trim() == "" || type_b.value == "") {
        e.preventDefault()
        return false
    }
    
    try {
        let data = {name: p_store_name.value, typeStore: type_b.value}

        let req = await fetch(APIBASE + '/store-info', {
            method:'POST',
            body:JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        let res = await req.json()

        location.reload()
        
    } catch (error) {
        console.log(error);
    }
}

const allow = async() =>{
    let user = await getUser()
    console.log(user);
    console.log(new Date().getTime());
    let x = [{a:'', b:''}]
    x.push({a:'klk', b:''})
    console.log(x);
    if(user.data.system_control.sale_with_ITBIS){
        document.querySelector('.itbis_Card').style.display = 'flex'
    }
}
allow()



// setInterval(()=> x(), 1000)

const showListSales = async() =>{
    let sale = await getSales()
    let sales = sale.sales_today
    countSales.innerText = `Ventas: ${sales.length}` 

    // console.log(new Date(sales[0].date).getTime() > new Date().getTime());
    tbody.innerHTML = ""
    if(sales.length == 0){
        return noElement()
    }
    for(var i = sales.length - 1; i >= 0; i--){
        let time = new Date(sales[i].date)
        tbody.innerHTML += `
            <tr>
                <td>${sales[i].code}</td>
                <td>${sales[i].products.length}</td>
                <td>
                    <p>
                        ${time.getMonth() + 1}/${time.getDate()}/${time.getFullYear()} - ${time.getHours()}:${time.getMinutes()}
                    </p> 
                </td>
                <td>$${sales[i].totalPrice}</td>
                <td>
                    <a href="javascript:window.open('/factura/${sales[i]._id}', '','width=1000,height=700,left=100,top=100,toolbar=yes');void 0" 
                    data-id="${sales[i]._id}" class="btn p-0 text-primary">
                        Ver detalle
                    </a>
                </td>
            </tr>
        `
    }
}
showListSales()


async function showListCheckouts(){
    const checkouts = await data.getCheckouts()
    
    _checkouts.innerHTML = '<option value="null">Caja#</option>'

    checkouts.checkout.forEach((item, i) => {
        if(item.active){
            _checkouts.innerHTML += `<option value="${item.checkout}" data-idConnection="${item.idConnection}" data-status="${item.connect}" data-id="${item._id}">
                Caja#${item.checkout}
            </option>`
        }
    })

    let x = localStorage.getItem('idConnection_checkout')
    let a = localStorage.getItem('caja')
    document.getElementById('showCheckout').value = ''

    for(let i = 0; i < _checkouts.options.length; i++){
        const idConnection = _checkouts.options[i].dataset.idconnection
        // const checkoutStatus = _checkouts.options[i].dataset.status
        const v = _checkouts.options[i].value
        
        // console.log(idConnection);
        // console.log(idConnection, x);

        if(idConnection != undefined){

            if(x == idConnection){
                _checkouts.options[i].selected = true;
                document.getElementById('showCheckout').value = `caja#${v}`
                handleElements.enableElement(document.getElementById('btn_dsconnect_checkout'))
                handleElements.disableElement(_checkouts)
                handleElements.enableElement(document.getElementById('btn_open_card_casheir'))
            }


            // console.log(a, v);
            // console.log(idConnection);
            if(v == a && idConnection == ''){
                disconnectCheckoutByAdmin()
            }
        }
    }
}
showListCheckouts()

const disconnectCheckoutByAdmin = async() =>{
    console.log('admin ha cerrado la sesion');
    localStorage.removeItem('idConnection_checkout')
    localStorage.removeItem('caja')

    handleElements.disableElement(document.getElementById('btn_dsconnect_checkout'))
    handleElements.enableElement(_checkouts)
    handleElements.disableElement(document.getElementById('btn_open_card_casheir'))

    showListCheckouts()

    disconnectCashierByAdmin()
}

//checkout connections
const connectCheckout = async(e) =>{
    const checkouts = await data.getCheckouts()

    const num = _checkouts.options[_checkouts.options.selectedIndex].value
    const id = _checkouts.options[_checkouts.options.selectedIndex].dataset.id

    if(num == 'null') return false

    const checkout_num = checkouts.checkout.find(item => item.checkout == num)
    let msg1 = `La caja#${num} ya se encuentra conectado en otro dispositivo, por favor conectese en otra caja o contacte el administrador`
    let msg2 = 'El codigo ingresado fue incorrecto por favor vuelva a intentarlo'
    if(checkout_num.connect){
        emergent_alert({msg: msg1, color:'alert alert-warning'})
    }else{
        const code = prompt('Por favor ingresar el codiga para porder realizar esta accion')

        if(code != checkout_num.entryCode) return emergent_alert({msg: msg2, color:'alert alert-danger'})

        try {
            let datas = {checkout: num, id}
            const req = await fetch(`${APIBASE}/connect-to-checkout/${datas.id}`)
            const res = await req.json()

            if(res.idConnection) {
                localStorage.setItem('idConnection_checkout', res.idConnection)
                localStorage.setItem('caja', num)
            }
            
            emergent_alert({msg:res.msg, color:res.color})
            handleElements.enableElement(document.getElementById('btn_dsconnect_checkout'))
            handleElements.disableElement(_checkouts)
            handleElements.enableElement(document.getElementById('btn_open_card_casheir'))

            showListCheckouts()
        } catch (error) {
            console.error(error);
        }
    }
}

const disconnectCheckout = async () => {
    const checkouts = await data.getCheckouts()

    const num = _checkouts.options[_checkouts.options.selectedIndex].value
    const id = _checkouts.options[_checkouts.options.selectedIndex].dataset.id

    if(num == 'null') return false

    const checkout_num = checkouts.checkout.find(item => item.checkout == num)

    if(checkout_num.connect){
        const code = prompt('Por favor ingresar el codiga para porder realizar esta accion')
        let msg2 = 'El codigo ingresado fue incorrecto por favor vuelva a intentarlo'

        if(code != checkout_num.entryCode) return emergent_alert({msg: msg2, color:'alert alert-danger'})

        try {
            let req = await fetch(`${APIBASE}/disconnect-checkout/${id}`)
            let res = await req.json()

            emergent_alert({msg:res.msg, color:res.color})
            localStorage.removeItem('idConnection_checkout')

            handleElements.disableElement(document.getElementById('btn_dsconnect_checkout'))
            handleElements.enableElement(_checkouts)
            handleElements.disableElement(document.getElementById('btn_open_card_casheir'))

            showListCheckouts()

            if(localStorage.getItem('idConnection_cashier')) disconnectCashierByAdmin()
        } catch (error) {
            console.error(error);
        }
    }
}

const showListCashiers_select = async() =>{
    const cashiers = await data.getCashiers()

    listCashiers.innerHTML = '<option value="null">Cajero/a</option>'

    cashiers.forEach((cashier, i) =>{
        if(cashier.status){
            let fullName = `${cashier.name} ${cashier.lastName}`
            listCashiers.innerHTML += `
            <option data-code="${cashier.id_code}" data-id="${cashier._id}" data-connected="${cashier.connect}" data-idconnection="${cashier.idConnection}" value="${fullName}">
                ${fullName}
            </option>`
        }
    })
    
    let x = localStorage.getItem('idConnection_cashier');
    let codex = localStorage.getItem('code');

    document.getElementById('showCashier').value = ''

    for(let i = 0; i < listCashiers.options.length; i++){
        let idConnection = listCashiers.options[i].dataset.idconnection; 
        let code = listCashiers.options[i].dataset.code; 

        if(idConnection != undefined){

            if(x == idConnection){
                listCashiers.options[i].selected = true;
                document.getElementById('showCashier').value = listCashiers.options[i].value
                document.getElementById('code').classList.add('display_none')
                handleElements.disableElement(listCashiers)
                handleElements.enableElement(document.getElementById('logoutCasheir'))
            }

            if(code == codex && idConnection == ''){
                disconnectCashierByAdmin()
            }
        }
    }
} 
showListCashiers_select()

const disconnectCashierByAdmin = async() =>{
    const x = localStorage.getItem('idConnection_cashier')
    try {
        const cashiers = await data.getCashiers()
        const cashier = cashiers.find(item => item.idConnection == x)

        if(cashier != undefined){
            let cashier_id = cashier._id
            console.log(cashier_id);
            let req = await fetch(`${APIBASE}/cashier-disconnected/${cashier_id}`,{
                method:'POST',
                body: JSON.stringify({}),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            let res = await req.json()
            
            code.classList.remove('display_none')
            handleElements.enableElement(listCashiers)
            handleElements.disableElement(document.getElementById('logoutCasheir'))
            localStorage.removeItem('idConnection_cashier')
            localStorage.removeItem('code')
            showListCashiers_select()
        }
    } catch (error) {
        console.error(error);
    }
    
}

const connectCasheir = async() =>{
    const casheirCode = listCashiers.options[listCashiers.options.selectedIndex].dataset.code; 
    const casheir_id = listCashiers.options[listCashiers.options.selectedIndex].dataset.id;
    const casheir_connected = listCashiers.options[listCashiers.options.selectedIndex].dataset.connected;
    const checkout_id = _checkouts.options[_checkouts.options.selectedIndex].dataset.id;
    const code = document.getElementById('code')

    
    let msg1 = 'El codigo colocado es incorrecto, vuelve a intentarlo o si se le olvido su codigo por favor contacte su Administrador';
    let msg2 = 'Debes conectar con una caja primero antes de conectar tu usuario';
    let msg3 = 'Este usuario ya se encuentra conectado en otro dispositivo, comunicate con tu ADMIN'

    if(code.value.trim() == "") return false
    if(code.value != casheirCode) return emergent_alert({msg: msg1, color:'alert alert-danger'})
    if(casheir_connected == 'true') return emergent_alert({msg: msg3, color:'alert alert-danger'})

    if(localStorage.getItem('idConnection_checkout') == undefined){
        return emergent_alert({msg: msg2, color:'alert alert-danger'})
    }

    console.log(casheirCode);
    try {
        let req = await fetch(`${APIBASE}/cashier-connected/${casheir_id}`,{
            method:'POST',
            body: JSON.stringify({checkout_id}),
            headers:{
                'Content-Type': 'application/json'
            }
        })
        let res = await req.json()

        emergent_alert({msg:res.msg, color:res.color})

        if(res.idConnection){
            localStorage.setItem('idConnection_cashier', res.idConnection)
            localStorage.setItem('code', res.code)
            handleElements.disableElement(listCashiers)
            handleElements.enableElement(document.getElementById('logoutCasheir'))
            code.value = ''
            code.classList.add('display_none')
            showListCashiers_select()
        }
    } catch (error) {
        console.log(error);
    }
}

const disconnectCasheir = async () =>{
    const casheir_id = listCashiers.options[listCashiers.options.selectedIndex].dataset.id;
    const casheir_connected = listCashiers.options[listCashiers.options.selectedIndex].dataset.connected;
    const checkout_id = _checkouts.options[_checkouts.options.selectedIndex].dataset.id;
    const x = localStorage.getItem('idConnection_cashier');

    if(x != undefined && casheir_connected == 'true'){
        try {
            if(confirm('Seguro que quieres desconectar tu usuario?')){
                let req = await fetch(`${APIBASE}/cashier-disconnected/${casheir_id}`,{
                    method:'POST',
                    body: JSON.stringify({checkout_id}),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                let res = await req.json()

                emergent_alert({msg:res.msg, color:res.color})

                code.classList.remove('display_none')
                handleElements.enableElement(listCashiers)
                handleElements.disableElement(document.getElementById('logoutCasheir'))
                localStorage.removeItem('idConnection_cashier')
                localStorage.removeItem('code')
                showListCashiers_select()
            }
        } catch (error) {
            console.error(error);
        }
    }
}


//this function displays the current user/cashier who is using the app
const showCurrentUser = async() =>{
    const cashiers = await data.getCashiers()

    let cashier_card = document.getElementById('c_user')
    let checkout_card = document.getElementById('num_checkout')
    let num_checkout = localStorage.getItem('caja')

    cashier_card.value = (localStorage.getItem('admin') == 'true') ? 'ADMINISTRADOR' : 'NO USUARIO'
    checkout_card.value = (num_checkout != undefined) ? num_checkout : '' 

    cashiers.forEach(cashier =>{
        if(cashier.idConnection == localStorage.getItem('idConnection_cashier')){
            return cashier_card.value = `${cashier.name} ${cashier.lastName}`
        }
    })
}

const boxSearchClients = document.querySelector('.boxSearchClients')
const cardSearchClients = document.querySelector('#cardSearchClients')

const seachClients = async(text) =>{
    const clients = await data.getClients()
    boxSearchClients.style.display = 'block'

    let _text = text.toLowerCase()

    const clientsFound = clients.data.filter(client => {
        let name = client.name.toLowerCase()
        let lastName = client.lastName.toLowerCase()
        let code = client.id_client.toLowerCase()

        if(_text == ''){
            return false
        }else{
            return name.indexOf(_text) !== -1 || lastName.indexOf(_text) !== -1 || code.indexOf(_text) !== -1
        }
    })

    cardSearchClients.innerHTML = ""

    clientsFound.forEach(client => {
        cardSearchClients.innerHTML +=`
            <tr>
                <td>${client.id_client}</td>
                <td>${client.name} ${client.lastName}</td>
                <td>
                    <a href="#" class="add_c" data-id_client="${client._id}" data-name="${client.name} ${client.lastName}">Agregar</a>
                </td>
            </tr>
        `
    })

    if(cardSearchClients.innerHTML == ""){
        cardSearchClients.innerHTML = `<p>Cliente no encontrado...</p>`
    }
    if(_text == '') boxSearchClients.style.display = 'none'
}

const boxSearchProducts = document.querySelector('.boxSearchProducts')
const seachProducts = async(text) =>{
    const products = await data.getProducts()
    boxSearchProducts.style.display = 'block'
    
    let _text = text.toLowerCase()
    const productsFound = products.my_products.filter(product => {
        let name = product.name.toLowerCase()
        let code = product.idcode.toString()
        let x =  _text == '';
        if(_text == ''){
            return false
        }else{
            return name.indexOf(_text) !== -1 || code.indexOf(_text) !== -1
        }
    })

    
    cardSearchProducts.innerHTML = ""
    productsFound.forEach(product =>{
        cardSearchProducts.innerHTML += `
            <tr>
                <td>${product.idcode}</td>
                <td>${product.name.toUpperCase()}</td>
                <td>$${product.sum_price}</td>
                <td>
                    <a href="#" class="add_p" data-id="${product.idcode}" >Agregar</a>
                </td>
            </tr>
        `
    })
  
    if(cardSearchProducts.innerHTML == ""){
        cardSearchProducts.innerHTML = `<p>No hay productos con este nombre</p>`
    }
    if(_text == '') boxSearchProducts.style.display = 'none'
}

const addProduct = async(e) =>{
    const products = await data.getProducts()

    let product = products.my_products.find(prod => prod.idcode == e.target.dataset.id)
    listProducts.push(product)
    showProducts()
    boxSearchProducts.style.display = 'none'
    document.getElementById('textSearch').value = ''
}

const getCodeProduct = async() =>{
    let code = document.getElementById('codigo')
    
    if(code.value.trim() == "") return false
    try {        
        let req = await fetch(`${APIBASE}/get-product-by-code/${code.value.trim()}`)
        let res = await req.json()

        if(res.status == false){
            emergent_alert({msg: res.msg, color:'alert alert-danger'})
            showProducts()
        }else{
            listProducts.push(res.product)
            showProducts()
        }   
        code.value = ""
        code.focus()
    } catch (error) {
        console.log(error);
    }
}

const showProducts = async() =>{
    const user = await getUser()
    const productsGroup = Object.groupBy(listProducts, ({idcode}) => idcode)
    
    showListProduct.innerHTML = '';
    for(const productGroup in productsGroup){
        let products = productsGroup[productGroup]
        showListProduct.innerHTML += `
            <tr>
                <td>${products.length}</td>
                <td>${products[0].name.toUpperCase()}</td>
                <td>${products[0].price.toFixed(2)}</td>
                ${
                    user.data.system_control.sale_with_ITBIS ? `<td>${products[0].itbis.toFixed(2)}</td>` : ""
                }
                <td>
                    <a href="" type="button" data-idcode="${products[0].idcode}" data-id="${products[0]._id}" class="text-danger delete remove_product">
                        Eliminar
                    </a>
                </td>
            </tr>
        `
    }
    let x = showListProduct.scrollHeight
    showListProduct.scrollBy(0, x);
    subTotalValue()
    totalITBIS()
    totalValue()
}

const subTotalValue = () =>{
    let totalPrice = listProducts.reduce((acc, p) => acc = acc + p.price ,0)
    document.getElementById('subTotal').innerText = totalPrice.toFixed(2)
}

const totalITBIS = () =>{
    let total_itbis = listProducts.reduce((acc, p) => acc = acc + p.itbis ,0)
    document.getElementById('itbis').innerText = total_itbis.toFixed(2)
}

const totalValue = async() =>{
    const user = await getUser()
    let sale_with_ITBIS = user.data.system_control.sale_with_ITBIS
    let total_value = listProducts.reduce((acc, p) => acc = acc + (sale_with_ITBIS ? p.sum_price : p.price) ,0)
    document.getElementById('total').innerText = total_value.toFixed(2)
}

const create_sale = async(e) =>{
    const user = await getUser()
    const cashiers = await data.getCashiers()
    const checkouts = await data.getCheckouts()
    

    let sale_with_ITBIS = user.data.system_control.sale_with_ITBIS

    const cambio = document.getElementById('cambio')
    const pago = document.getElementById('pago').value
    let subTotal = listProducts.reduce((acc, p) => acc = acc + p.price ,0)
    let total_itbis = listProducts.reduce((acc, p) => acc = acc + p.itbis ,0)

    let checkout_connected = localStorage.getItem('idConnection_checkout')
    let cashier_connected = localStorage.getItem('idConnection_cashier') 
    let client_id = localStorage.getItem('id_client')

    const checkout = checkouts.checkout.find(item => item.idConnection == checkout_connected)
    const cashier = cashiers.find(item => item.idConnection == cashier_connected)

    console.log(cashier);
    console.log(checkout);

    let totalPrice = subTotal + (sale_with_ITBIS ? total_itbis : 0)

    //
    if(!cashier || !checkout){
        // let msg = 'Debes conectar tu usuario (cajero/a) antes de hacer una venta, por favor asegurece de estar conectado para realizar la venta'
        let msg = 'La caja y tu usuario (cajera/o) deben estar conectados antes de realizar cualquier venta, por favor conecta tu usuario '
        return emergent_alert({msg: msg, color: 'alert alert-warning'})
    }
    //
    if(totalPrice == 0){
        let msg = 'Por favor agregue productos antes de realizar la venta...'
        return emergent_alert({msg: msg, color:'alert alert-danger'})
    }
    //
    if(pago.length == 0){
        let msg = 'Por favor agregue el pago en efectivo que dio el cliente para realizar esta venta...'
        return emergent_alert({msg: msg, color: 'alert alert-danger'})
    }
    //
    if(pago < totalPrice){
        let msg = 'Saldo insuficiente para hacer esta venta...'
        return emergent_alert({msg:msg, color:'alert alert-danger'})
    }

    let cambioValue = pago - totalPrice
    cambio.innerText = cambioValue.toFixed(2)
    
    let datas = {
        products:listProducts,
        totalPrice: totalPrice.toFixed(2),
        subTotal: subTotal,
        pago: pago,
        cambio: cambioValue.toFixed(2),
        connection_checkout_id: checkout_connected,
        connection_cashier_id: cashier_connected,
        itbis: total_itbis,
        client_id: client_id
    }

    try {
        let req = await fetch(APIBASE + '/new-sale', {
            method: 'POST',
            body: JSON.stringify(datas),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        let res = await req.json()

        if(!res.status){
            return emergent_alert({msg:res.msg, color: res.color}) 
        }
  
        document.querySelectorAll('.delete').forEach(element => element.disabled = true)
        
        handleElements.disableElement(document.getElementById('add'))
        handleElements.disableElement(document.getElementById('finich'))
        handleElements.disableElement(document.getElementById('cancel'))
        handleElements.disableElement(document.getElementById('codigo'))
        handleElements.disableElement(document.getElementById('textSearch'))
        handleElements.disableElement(document.getElementById('pago'))
        handleElements.disableElement(document.getElementById('clientSearch'))
        handleElements.enableElement(document.getElementById('cerrar'))

        document.querySelectorAll('.remove_product').forEach(btn_remove => {
            handleElements.disableElement(btn_remove)
        })

        document.querySelector('.delete_client').classList.add('inactive')
        
        handleElements.disableElement(document.getElementById('clean_list'))
        const factura = document.getElementById('factura')
        
        handleElements.enableElement(factura)
        factura.href = `javascript:window.open('/factura/${res.id}', '','width=1000,height=700,left=100,top=100,toolbar=yes');void 0`
        emergent_alert({msg:res.msg, color:'alert alert-success'})
        showListSales()
    } catch (error) {
        console.log(error);
    }
}

showListProduct.addEventListener('click', e =>{
    if(e.target.classList.contains('delete')){
        e.preventDefault()
        if(confirm('Seguro que deseas eliminar uno de este producto en la lista?')){
            let idcode = e.target.dataset.idcode
            let index = listProducts.findIndex((product) => product.idcode == idcode)
            listProducts.splice(index, 1)
            showProducts()
        }
    }
})

const cancelSele = () =>{
    listProducts.splice(0, listProducts.length)
    showListProduct.innerHTML = ''
    document.getElementById('total').innerText = '0.00'
    document.getElementById('subTotal').innerText = '0.00'
    document.getElementById('itbis').innerText = '0.00'
    document.getElementById('codigo').value = ''
    document.getElementById('pago').value = ''

    localStorage.removeItem('id_client')
}

const openSele = () => { 
    showCurrentUser()
    if(document.getElementById('pago').value === ''){
        handleElements.disableElement(document.getElementById('cerrar'));
        handleElements.enableElement(document.getElementById('codigo'));
        handleElements.enableElement(document.getElementById('textSearch'));
        handleElements.enableElement(document.getElementById('clean_list'));
    }else{
        handleElements.disableElement(document.getElementById('clean_list'));
    }
    setTimeout(() =>{
        document.getElementById('codigo').focus()
    },500)
}

const clean_list_products = (e) =>{
    e.preventDefault()
    listProducts.splice(0, listProducts.length)
    showListProduct.innerHTML = ''
    document.getElementById('total').innerText = '0.00'
    document.getElementById('subTotal').innerText = '0.00'
    document.getElementById('itbis').innerText = '0.00'
}

const closeSales = () =>{
    listProducts.splice(0, listProducts.length)
    showListProduct.innerHTML = ''
    document.getElementById('total').innerText = '0.00'
    document.getElementById('cambio').innerText = '0.00'
    document.getElementById('subTotal').innerText = '0.00'
    document.getElementById('itbis').innerText = '0.00'
    document.getElementById('codigo').value = ''
    document.getElementById('pago').value = ''

    handleElements.enableElement(document.getElementById('add'))
    handleElements.enableElement(document.getElementById('finich'))
    handleElements.enableElement(document.getElementById('cancel'))
    handleElements.enableElement(document.getElementById('pago'))
    handleElements.enableElement(document.getElementById('clientSearch'))
    handleElements.disableElement(document.getElementById('factura'))
    
    document.getElementById('mode_code').options[0].selected = true;

    localStorage.removeItem('id_client')
    document.querySelector('.client_name').value = ""
    document.querySelector('#add').style.display = 'none'
    document.querySelector('.delete_client').style.display = 'none'
    document.getElementById('clientSearch').style.display = 'block'
}


document.getElementById('cancel').addEventListener('click', cancelSele)
document.getElementById('btn_open_sele').addEventListener('click', openSele)
document.getElementById('finich').addEventListener('click', create_sale)
document.getElementById('add').addEventListener('click', getCodeProduct)
document.getElementById('cerrar').addEventListener('click', closeSales)
document.getElementById('clean_list').addEventListener('click', clean_list_products)

let change_status = null

document.getElementById('mode_code').addEventListener('change', (e) =>{
    change_status = e.target.value
    if(e.target.value === 'manual'){
        document.getElementById('add').style.display = 'flex'
    }else{
        document.getElementById('add').style.display = 'none'
    }
})

document.getElementById('codigo').addEventListener('input', e =>{
    if(change_status === null || change_status === 'automatico'){
        getCodeProduct()
    }
})

document.getElementById('codigo').addEventListener('keydown', e =>{
    let key = event.which || event.keyCode;
    if(key === 13){
        if(document.getElementById('pago').value === ''){
            getCodeProduct()
        }else{
            let msg = 'Cerrar esta venta para poder crear otra...'
            return emergent_alert({msg: msg, color:'alert alert-warning'})
        }
    }
})

document.getElementById('textSearch').addEventListener('keyup', e =>{
    seachProducts(e.target.value)
})
document.getElementById('clientSearch').addEventListener('keyup', e =>{
    seachClients(e.target.value)
})

window.addEventListener('click', e =>{
    let client_name = document.querySelector('#clientSearch')
    let delete_client = document.querySelector('.delete_client')

    if(e.target.classList.contains('add_p')){
        e.preventDefault()
        addProduct(e)
    }
    if(e.target.classList.contains('add_c')){
        let id_client = e.target.dataset.id_client
        let name = e.target.dataset.name
        // document.getElementById('clientSearch').value = ""
        // document.getElementById('clientSearch').style.display = 'none'

        client_name.value = ""
        client_name.value = name
        handleElements.disableElement(client_name)
        delete_client.style.display = 'block'
        localStorage.setItem('id_client', id_client)
    }

    if(e.target.classList.contains('delete_client')){
        handleElements.enableElement(client_name)
        client_name.value = ""
        delete_client.style.display = 'none'
        // document.getElementById('clientSearch').style.display = 'block'
        localStorage.removeItem('id_client')
    }

    if(!e.target.classList.contains('d_block')){
        boxSearchProducts.style.display = 'none'
        boxSearchClients.style.display = 'none'
    }
    
})

function handleDate(){
    let _date = document.querySelector('.date')
    const time = new Date()
    
    _date.innerHTML = `<div class="d-flex">
        <p class="m-0 me-2">${fecha(time.getTime())}  ${time.getDate()}-${time.getFullYear()}</p>
        <p class="m-0">${time.getHours()}:${time.getMinutes()}</p>
    </div>`
}
handleDate()
setInterval(()=> handleDate(), 5000)

document.getElementById('btn_store_name').addEventListener('click', post_store_name)
document.getElementById('btn_connect_checkout').addEventListener('click', connectCheckout)
document.getElementById('btn_dsconnect_checkout').addEventListener('click', disconnectCheckout)
document.getElementById('btn_open_card_casheir').addEventListener('click', (e) => modalBoxLog.style.display = "block")

document.getElementById('codeToLog').addEventListener('click', connectCasheir)
document.getElementById('logoutCasheir').addEventListener('click', disconnectCasheir)

modalBoxLog.addEventListener('click', e =>{
    if(e.target.classList.contains('close_modal') ){
        e.preventDefault()
        modalBoxLog.style.display = "none"
        document.getElementById('error_code').innerText = ""
        showListCashiers_select()
    } 
})

const btn_keys = {
    esc: 27,
    f2: 113,
    f4: 115,
    f8: 119,
    f9: 120,
    ctrl: 17,
    left: 37,
    right: 39
}

window.addEventListener('keydown', e =>{
    
    if(e.keyCode == btn_keys.f2 || e.which == btn_keys.f2){
       
        const btn_open = document.getElementById('btn_open_sele')
        
        const my_event = new Event('click')

        btn_open.addEventListener('click', e => {
            console.log(e.target);
            openSele()
        })
        
        btn_open.dispatchEvent(my_event)
    }

    if(e.keyCode == btn_keys.ctrl || e.which == btn_keys.ctrl){

        const pago = document.getElementById('pago')
        console.log('yesss');
        pago.focus()
    }
})


