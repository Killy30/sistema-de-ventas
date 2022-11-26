const showListProduct = document.getElementById('showListProduct')
const tbody = document.getElementById('tbody')
const listCashiers = document.getElementById('listCashiers')
const countSales = document.querySelector('#countSales')
const modalBoxLog = document.querySelector('#modalBoxLog')
const codeToLog = document.querySelector('#codeToLog')

import errorMessage from "./errorMSG.js"
import loader from "./loader.js"
import fecha from "./month_es.js"


let listProducts = []
let dataCasheir;


const getSales = async() =>{
    try {
        tbody.innerHTML = `${loader()}`
        let req = await fetch('/get-sales')
        let res = await req.json()
        return res
    } catch (error) {
        console.log(error);
    }
}

const getUser = async() =>{
    try {
        let req = await fetch('/get-user')
        let res = await req.json()
        return res
    } catch (error) {
        console.log(error);
    }
}


const showStoreName = async() =>{
    let user = await getUser()
    let show_name = document.getElementById('show_s_n')

    if(user.data.storeName !== undefined){
        show_name.innerText = `${user.data.storeName}`
    }
}
showStoreName()

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
                    <a href="/factura/${sales[i]._id}" data-id="${sales[i]._id}" class="btn text-primary">
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
        let status = listCashiers.options[i].getAttribute('data-act')
        let code = listCashiers.options[i].getAttribute('data-code')
        if(code == localStorage.getItem('code')){
            listCashiers.options[i].selected = true;
        }
    }
} 
showListCashiers_select()


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

const showProducts = () =>{
    showListProduct.innerHTML = ''
    const pt = listProducts.reduce((acc, p) => acc = acc + p.price ,0)
 
    for(let i = 0; i < listProducts.length; i++){
        showListProduct.innerHTML += `
            <tr>
                <td>${listProducts[i].idcode}</td>
                <td>${listProducts[i].name}</td>
                <td>${listProducts[i].price}</td>
                <td>${listProducts[i].description}</td>
                <td>${listProducts[i].category}</td>
                <td>
                    <button type="button" data-index="${i}" data-id="${listProducts[i]._id}" class="btn btn-danger delete">
                        Eliminar
                    </button>
                </td>
            </tr>
        `
    }
    let x = showListProduct.scrollHeight
    showListProduct.scrollBy(0, x);
    todalValue()
}

const todalValue = () =>{
    let totalPrice = listProducts.reduce((acc, p) => acc = acc + p.price ,0)
    let total = document.getElementById('total')
    total.innerText = totalPrice.toFixed(2)
}

const clean_list_products = (e) =>{
    e.preventDefault()
    listProducts.splice(0, listProducts.length)
    showListProduct.innerHTML = ''
    document.getElementById('total').innerText = '0.00'
}

const pagoEfectivo = async(e) =>{
    const cambio = document.getElementById('cambio')
    const pago = document.getElementById('pago').value
    let totalPrice = listProducts.reduce((acc, p) => acc = acc + p.price ,0)

    //
    if(totalPrice == 0){
        let error = 'Por favor agregue productos antes de realizar la compra...'
        return errorMessage(error,'alert alert-danger')
    }
    //
    if(pago.length == 0){
        let error = 'Por favor agregue el pago efectivo que dio el cliente para cobrar...'
        return errorMessage(error,'alert alert-danger')
    }
    //
    if(pago < totalPrice){
        let error = 'Saldo insuficiente para hacer esa compra...'
        return errorMessage(error,'alert alert-danger')
    }

    let cambioValue = pago - totalPrice
    cambio.innerText = cambioValue.toFixed(2)
    let cashier_id = localStorage.getItem('id')

    console.log(cashier_id);
    
    let data = {
        products:listProducts,
        totalPrice: totalPrice.toFixed(2),
        pago: pago,
        cambio: cambioValue.toFixed(2),
        cashier_id: cashier_id
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
        document.getElementById('cerrar').disabled = false

        document.getElementById('clean_list').classList.add('inactive')
        const factura = document.getElementById('factura')
        
        factura.classList.remove('inactive')
        factura.href = `/factura/${res.id}`
        errorMessage(res.msg,'alert alert-success')
        showListSales()
    } catch (error) {
        console.log(error);
    }
}

showListProduct.addEventListener('click', e =>{
    if(e.target.classList.contains('delete')){
        if(confirm('Seguro que deseas eliminar este producto en la lista de compra')){
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
    document.getElementById('codigo').value = ''
}

const openSele = () => { 
    if(document.getElementById('pago').value === ''){
        document.getElementById('cerrar').disabled = true
    }
    setTimeout(() =>{
        document.getElementById('codigo').focus()
    },500)
    document.getElementById('clean_list').classList.remove('inactive')
}

const closeSales = () =>{
    listProducts.splice(0, listProducts.length)
    showListProduct.innerHTML = ''
    document.getElementById('total').innerText = '0.00'
    document.getElementById('cambio').innerText = '0.00'
    document.getElementById('codigo').value = ''
    document.getElementById('pago').value = ''

    document.getElementById('add').disabled = false
    document.getElementById('finich').disabled = false
    document.getElementById('cancel').disabled = false
    document.getElementById('factura').classList.add('inactive')
    document.getElementById('mode_code').options[0].selected = true;

    // showListSales()
}


document.getElementById('cancel').addEventListener('click', cancelSele)
document.getElementById('btn_open_sele').addEventListener('click', openSele)
document.getElementById('finich').addEventListener('click', pagoEfectivo)
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








