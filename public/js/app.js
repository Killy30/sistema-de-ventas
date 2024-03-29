const showListProduct = document.getElementById('showListProduct')
const tbody = document.getElementById('tbody')
const listCashiers = document.getElementById('listCashiers')
const countSales = document.querySelector('#countSales')
const modalBoxLog = document.querySelector('#modalBoxLog')
const codeToLog = document.querySelector('#codeToLog')

import errorMessage from "./errorMSG.js"
import loader from "./loader.js"
import fecha from "./month_es.js"
import data from "./data.js"

let listProducts = []
let dataCasheir;

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

        let req = await fetch('/store-info', {
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

    if(user.data.system_control.sale_with_ITBIS){
        document.querySelector('.itbis_Card').style.display = 'flex'
    }
}
allow()

const showListSales = async() =>{
    let sale = await getSales()
    let sales = sale.sales_today
    countSales.innerText = `Ventas: ${sales.length}` 

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
                        ${fecha(time.getTime())} ${time.getDate()}/${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}
                    </p> 
                </td>
                <td>${sales[i].totalPrice}</td>
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

const showListCashiers_select = async() =>{
    const user = await getUser()
    let cashiers = user.data.cashiers

    listCashiers.innerHTML = '<option data-code="404" data-act="-1" data-i="-1" value="null">Cajero/a</option>'
    cashiers.forEach((cashier, i) =>{
        if(cashier.status){
            listCashiers.innerHTML += `
            <option data-code="${cashier.id_code}" data-act="${cashier.status}" data-i="${i}" id="selectOption" value="${cashier._id}">
                ${cashier.name} ${cashier.lastName}
            </option>`
        }
    })
    for(let i = 0; i < listCashiers.options.length; i++){
        let code = listCashiers.options[i].getAttribute('data-code')

        if(code == localStorage.getItem('code')){
            listCashiers.options[i].selected = true;
        }
    }

    let x = cashiers.some(cashier => cashier._id == localStorage.getItem('id'))

    if(x == false){
        localStorage.removeItem('id')
        localStorage.removeItem('code')
    }
} 
showListCashiers_select()


//this function displays the current user/cashier who is using the app
const showCurrentUser = async() =>{
    let box = document.getElementById('c_user')
    const user = await getUser()
    const cashiers = user.data.cashiers

    box.innerText = (localStorage.getItem('admin') == 'true') ? 'ADMINISTRADOR' : 'NO USUARIO'

    cashiers.forEach(cashier =>{
        if(cashier.id_code == localStorage.getItem('code')){
            return box.innerText = ` ${cashier.name} ${cashier.lastName}`
        }
    })
}

const boxSearchClients = document.querySelector('.boxSearchClients')
const seachClients = async(text) =>{
    const clients = await data.getClients()
    boxSearchClients.style.display = 'block'

    let _text = text.toLowerCase()

    boxSearchClients.innerHTML = ""
    for(let client of clients.data){
        let name = client.name.toLowerCase()
        let lastName = client.lastName.toLowerCase()
        let code = client.id_client.toLowerCase()

        if(name.indexOf(_text) !== -1 || lastName.indexOf(_text) !== -1 || code.indexOf(_text) !== -1){
            boxSearchClients.innerHTML +=`
                <div class="d-flex border-bottom d_block">
                    <div style="width: 100px;" class="d_block"> <p class="d_block mb-0 p-2">${client.id_client}</p> </div>
                    <div style="width: 250px;" class="d_block"> <p class="d_block mb-0 p-2">${client.name} ${client.lastName}</p> </div>
                    <div style="width: 100px;" class="d_block"> 
                        <a href="#" class="add_c" data-id_client="${client._id}" data-name="${client.name} ${client.lastName}">Agregar</a> 
                    </div>
                </div>
            `
        }
    }
    if(boxSearchClients.innerHTML == ""){
        boxSearchClients.innerHTML = `<p>Cliente no encontrado...</p>`
    }
}

const boxSearchProducts = document.querySelector('.boxSearchProducts')
const seachProducts = async(text) =>{
    const products = await data.getProducts()
    boxSearchProducts.style.display = 'block'
    
    let _text = text.toLowerCase()

    boxSearchProducts.innerHTML = ""

    for(let product of products.my_products){
        let name = product.name.toLowerCase()
        let code = product.idcode.toString()

        if(name.indexOf(_text) !== -1 || code.indexOf(_text) !== -1){
            boxSearchProducts.innerHTML +=`
                <div class="d-flex border-bottom d_block">
                    <div style="width: 150px;" class="d_block"> <p class="d_block mb-0 p-2">${product.idcode}</p> </div>
                    <div style="width: 200px;" class="d_block"> <p class="d_block mb-0 p-2">${product.name.toUpperCase()}</p> </div>
                    <div style="width: 100px;" class="d_block"> <p class="d_block mb-0 p-2">$${product.sum_price}</p> </div>
                    <div style="width: 100px;" class="d_block p-2"> <a href="#" class="add_p" data-id="${product.idcode}" >Agregar</a> </div>
                </div>
            `
        }
    }
    if(boxSearchProducts.innerHTML == ""){
        boxSearchProducts.innerHTML = `<p>No hay productos con este nombre</p>`
    }
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
        let req = await fetch(`/get-product-by-code/${code.value.trim()}`)
        let res = await req.json()

        if(res.status == false){
            errorMessage(res.msg, 'alert alert-danger')
            showProducts()
        }else{
            listProducts.push(res.product)
            showProducts()
        }   
    } catch (error) {
        console.log(error);
    }
    code.value = ""
    code.focus()
}

const showProducts = async() =>{
    const user = await getUser()
    showListProduct.innerHTML = ''
    for(let i = 0; i < listProducts.length; i++){
        showListProduct.innerHTML += `
            <tr>
                <td>${listProducts[i].idcode}</td>
                <td>${listProducts[i].name.toUpperCase()}</td>
                <td>${listProducts[i].price.toFixed(2)}</td>
                ${
                    user.data.system_control.sale_with_ITBIS ? `<td>${listProducts[i].itbis.toFixed(2)}</td>` : ""
                }
                <td>${listProducts[i].category}</td>
                <td>
                    <a href="" type="button" data-index="${i}" data-id="${listProducts[i]._id}" class="text-danger delete">
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
    let sale_with_ITBIS = user.data.system_control.sale_with_ITBIS

    const cambio = document.getElementById('cambio')
    const pago = document.getElementById('pago').value
    let subTotal = listProducts.reduce((acc, p) => acc = acc + p.price ,0)
    let total_itbis = listProducts.reduce((acc, p) => acc = acc + p.itbis ,0)

    let totalPrice = subTotal + (sale_with_ITBIS ? total_itbis : 0)
    //
    if(!localStorage.getItem('id') && localStorage.getItem('admin') == 'false'){
        let e = 'Debes conectar tu usuario (cajero/a) antes de hacer una venta, por favor asegurece de estar conectado para realizar la venta'
        return alert(e)
    }
    //
    if(totalPrice == 0){
        let error = 'Por favor agregue productos antes de realizar la venta...'
        return errorMessage(error,'alert alert-danger')
    }
    //
    if(pago.length == 0){
        let error = 'Por favor agregue el pago en efectivo que dio el cliente para hacer esta venta...'
        return errorMessage(error,'alert alert-danger')
    }
    //
    if(pago < totalPrice){
        let error = 'Saldo insuficiente para hacer esta venta...'
        return errorMessage(error,'alert alert-danger')
    }

    let cambioValue = pago - totalPrice
    cambio.innerText = cambioValue.toFixed(2)
    let cashier_id = localStorage.getItem('id') 
    let client_id = localStorage.getItem('id_client')
    
    let data = {
        products:listProducts,
        totalPrice: totalPrice.toFixed(2),
        subTotal: subTotal,
        pago: pago,
        cambio: cambioValue.toFixed(2),
        cashier_id: cashier_id,
        itbis: total_itbis,
        client_id: client_id
    }

    try {
        let req = await fetch('/new-sale', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        let res = await req.json()
  
        document.querySelectorAll('.delete').forEach(element => element.disabled = true)
        document.getElementById('add').disabled = true
        document.getElementById('finich').disabled = true
        document.getElementById('cancel').disabled = true
        document.getElementById('codigo').disabled = true
        document.getElementById('textSearch').disabled = true
        document.getElementById('pago').disabled = true
        document.getElementById('clientSearch').disabled = true
        document.getElementById('cerrar').disabled = false

        document.querySelector('.delete_client').classList.add('inactive')
        document.getElementById('clean_list').classList.add('inactive')
        const factura = document.getElementById('factura')
        
        factura.classList.remove('inactive')
        factura.href = `javascript:window.open('/factura/${res.id}', '','width=1000,height=700,left=100,top=100,toolbar=yes');void 0`
        errorMessage(res.msg,'alert alert-success')
        showListSales()
    } catch (error) {
        console.log(error);
    }
}

showListProduct.addEventListener('click', e =>{
    if(e.target.classList.contains('delete')){
        e.preventDefault()
        if(confirm('Seguro que deseas eliminar este producto en la lista?')){
            let index = e.target.dataset.index
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
        document.getElementById('cerrar').disabled = true
        document.getElementById('codigo').disabled = false
        document.getElementById('textSearch').disabled = false
        document.getElementById('clean_list').classList.remove('inactive')
    }else{
        document.getElementById('clean_list').classList.add('inactive')
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

    document.getElementById('add').disabled = false
    document.getElementById('finich').disabled = false
    document.getElementById('cancel').disabled = false
    document.getElementById('pago').disabled = false
    document.getElementById('clientSearch').disabled = false
    document.getElementById('factura').classList.add('inactive')
    document.getElementById('mode_code').options[0].selected = true;

    localStorage.removeItem('id_client')
    document.querySelector('.client_name').innerText = ""
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
            let error = 'Cerrar esta venta para poder crear otra...'
            return errorMessage(error,'alert alert-danger')
        }
    }
})


listCashiers.addEventListener('change', async(e) =>{

    let id = e.target.value
    let code = e.target.options[e.target.selectedIndex].dataset.code
   
    dataCasheir = {id, code}

    if(code !== '404'){
        modalBoxLog.style.display = "block"
    }else{
        if(confirm('Seguro que quieres salir?')){
            return changeCasheir(dataCasheir)
        }else{
            return showListCashiers_select()
        }
    }
})

codeToLog.addEventListener('click', e =>{
    e.preventDefault()
    let code = document.getElementById('code')

    if(code.value.trim() == "") return false
    
    if(dataCasheir.code == code.value){
        changeCasheir(dataCasheir)
        code.value = ''
        modalBoxLog.style.display = "none"
        document.getElementById('error_code').innerText = ""
    }else{
        document.getElementById('error_code').innerText = `El codigo ${code.value} es incorrecto`
        code.value = ''
    }
})

modalBoxLog.addEventListener('click', e =>{
    if(e.target.classList.contains('close_modal') ){
        e.preventDefault()
        modalBoxLog.style.display = "none"
        document.getElementById('error_code').innerText = ""
        showListCashiers_select()
    } 
})

document.getElementById('textSearch').addEventListener('keyup', e =>{
    seachProducts(e.target.value)
})
document.getElementById('clientSearch').addEventListener('keyup', e =>{
    seachClients(e.target.value)
})

window.addEventListener('click', e =>{
    let client_name = document.querySelector('.client_name')
    let delete_client = document.querySelector('.delete_client')

    if(e.target.classList.contains('add_p')){
        e.preventDefault()
        addProduct(e)
    }
    if(e.target.classList.contains('add_c')){
        let id_client = e.target.dataset.id_client
        let name = e.target.dataset.name
        document.getElementById('clientSearch').value = ""
        document.getElementById('clientSearch').style.display = 'none'

        client_name.innerText = name
        delete_client.style.display = 'block'
        localStorage.setItem('id_client', id_client)
    }

    if(e.target.classList.contains('delete_client')){
        client_name.innerText = ""
        delete_client.style.display = 'none'
        document.getElementById('clientSearch').style.display = 'block'
        localStorage.removeItem('id_client')
    }

    if(!e.target.classList.contains('d_block')){
        boxSearchProducts.style.display = 'none'
        boxSearchClients.style.display = 'none'
    }
    
})


const changeCasheir = async(data) =>{
    try {
        if(data.code === '404'){
            localStorage.setItem('code', data.code)
            localStorage.removeItem('id')
            showListCashiers_select()
        }else{
            localStorage.setItem('code', data.code)
            localStorage.setItem('id', data.id)
            showListCashiers_select()
        }
        
    } catch (error) {
        console.log(error);
    }
}

document.getElementById('btn_store_name').addEventListener('click', post_store_name)







