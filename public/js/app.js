const showListProduct = document.getElementById('showListProduct')
const tbody = document.getElementById('tbody')


let listProducts = []

const getDateNow = ()=>{
    const date_box = document.getElementById('date')
    let date = new Date(Date.now())
    date_box.innerHTML = `<p class="fs-1">
        ${fecha(date.getTime())} ${date.getDate()}/${date.getFullYear()}
    </p>`
}
getDateNow()


const showListSales = async() =>{
    let req = await fetch('/get-sales')
    let res = await req.json()
    let sales = res.sales_today

    for(var i = sales.length - 1; i >= 0; i--){
        let time = new Date(sales[i].date)
        tbody.innerHTML += `
            <tr>
                <td>${i+1}</td>
                <td>${sales[i].code}</td>
                <td>${sales[i].products.length}</td>
                <td class="d-flex">
                    <p style="margin-right: 5px;">
                        ${fecha(time.getTime())} ${time.getDate()}/${time.getFullYear()}
                    </p> 
                    <p>
                        ${time.getHours()}:${time.getMinutes()}
                    </p>
                </td>
                <td>${sales[i].totalPrice}</td>
                <td>
                    <a href="/factura/${sales[i]._id}" data-id="${sales[i]._id}" class="btn btn-primary">
                        Ver detalle
                    </a>
                </td>
            </tr>
        `
    }

}
showListSales()

const getCodeProduct = async() =>{
    let code = document.getElementById('codigo')
    
    try {        
        let req = await fetch(`/get-product-by-code/${code.value.trim()}`)
        let res = await req.json()

        if(res.status == false){
            errorMessage(res.msg, 'err_color')
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
    todalValue()
}



const todalValue = () =>{
    let totalPrice = listProducts.reduce((acc, p) => acc = acc + p.price ,0)
    let total = document.getElementById('total')
    total.innerText = totalPrice.toFixed(2)
}

const errorMessage = (err,color) =>{
    const cardError = document.getElementById('msg_err')
    cardError.innerHTML = `<p class="card_error ${color}">${err}</p>`
    setTimeout(() =>{
        cardError.innerHTML = ''
    },5000)
} 

const pagoEfectivo = async(e) =>{
    const cambio = document.getElementById('cambio')
    const pago = document.getElementById('pago').value
    let totalPrice = listProducts.reduce((acc, p) => acc = acc + p.price ,0)

    //
    if(totalPrice == 0){
        let error = 'Por favor agregue productos antes de realizar la compra...'
        return errorMessage(error,'err_color')
    }
    //
    if(pago.length == 0){
        let error = 'Por favor agregue el pago efectivo que dio el cliente para cobrar...'
        return errorMessage(error,'err_color')
    }
    //
    if(pago < totalPrice){
        let error = 'Saldo insuficiente para hacer esa compra...'
        return errorMessage(error,'err_color')
    }

    let cambioValue = pago - totalPrice
    cambio.innerText = cambioValue.toFixed(2)
    
    let data = {
        products:listProducts,
        totalPrice: totalPrice.toFixed(2),
        pago: pago,
        cambio: cambioValue.toFixed(2)
    }

    try {
        let req = await fetch('/new-sale', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
              }
        })
        let res = await req.json()
  
        document.querySelectorAll('.delete').forEach(element => element.disabled = true)
        document.getElementById('add').disabled = true
        document.getElementById('finich').disabled = true
        document.getElementById('cancel').disabled = true
        const factura = document.getElementById('factura')
        factura.classList.remove('inactive')
        factura.href = `/factura/${res.id}`
        errorMessage(res.msg,'success_color')

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
    console.log(listProducts);
}


function fecha(date){
    var d = new Date(date);
    
    var month = new Array();
    month[0] = "Enero";
    month[1] = "Febrero";
    month[2] = "Marzo";
    month[3] = "Abril";
    month[4] = "Mayo";
    month[5] = "Junio";
    month[6] = "Julio";
    month[7] = "Agosto";
    month[8] = "Septiembre";
    month[9] = "Octubre";
    month[10] = "Noviembre";
    month[11] = "Diciembre";
    return month[d.getMonth()];
}


document.getElementById('cancel').addEventListener('click', cancelSele)
document.getElementById('add').addEventListener('click', getCodeProduct)
document.getElementById('finich').addEventListener('click', pagoEfectivo)
