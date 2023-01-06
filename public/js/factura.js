

const print_factura = document.getElementById('print_factura')
const fbody = document.getElementById('fbody')

import data from './data.js'

let id = window.location.href.split('a/')[1]

const getSale = async() =>{
    let req = await fetch('/get-sale/'+id)
    let res = await req.json()
    return res
}

const getUser = async() =>{
    try {
        return data.getUser()
    } catch (error) {
        console.log(error);
    }
}

const showInfo = async()=>{

    let sale = await getSale()
    let venta = sale.sale
    let user = await getUser()

    let cashier = user.data.cashiers.find(cashier =>{
        return cashier._id == venta.cashier
    })

    let time = new Date(venta.date)

    fbody.innerHTML = `<div>
        <br>
        <p class="titulo fs-1 fw-bold ">${user.data.storeName}</p>
        <div class="card_address">
            <p>${user.data.storeAddress}</p>
        </div>
        <div class="card_code d-flex">
            <p class="v_1 me-3">Codigo:</p>
            <p class="v_2">${venta.code}</p>        
        </div>
        <div class="card_date d-flex">
            <p class="me-3">Fecha:</p>
            <p style="margin-right: 3px;">
                ${time.getDate()}/${(time.getMonth()+1)}/${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}
            </p> 
        </div>
        ${
            user.data.system_control.add_N_C_receipt?
            `<p>Caja: ${cashier.name} ${cashier.lastName}</p>`
            : ''
        }
        <table class="table">
            <span style="display: none;" >----------------------------------</span>
            <thead>
                <tr class="bg-dark text-white">
                    <th scope="col" class="v_1">Descripcion</th>
                    <th scope="col" class="v_2 text-end">precio</th>
                </tr>
            </thead>
            <tbody>
                ${
                    venta.products.map(product =>{
                        return `
                            <tr>
                                <td class="v_1">${product.name} </td>
                                <td class="v_2 text-end">${product.price}</td>
                            </tr>
                        `
                    }).join('')
                }
            </tbody>
        </table>
        <br>
        <div class="d-flex flex-column">
            <div class="d-flex justify-content-end">
                <p class="hide_f m-0 text-end" style="width: 100px;">SUBTOTAL:</p>
                <p class="hide_f m-0 text-end" style="width: 100px;">${venta.subTotal.toFixed(2)}</p>
            </div>
            <div class="d-flex justify-content-end">
                <p class="hide_f m-0 text-end" style="width: 100px;">ITBIS:</p>
                <p class="hide_f m-0 text-end" style="width: 100px;">${venta.itbis.toFixed(2)}</p>
            </div>
            <div class="d-flex justify-content-end">
                <p class="hide_f m-0 text-end" style="width: 100px;">PAGO:</p>
                <p class="hide_f m-0 text-end" style="width: 100px;">${venta.pay}</p>
            </div>
            <div class="d-flex justify-content-end">
                <p class="hide_f m-0 text-end" style="width: 100px;">CAMBIO:</p>
                <p class="hide_f m-0 text-end" style="width: 100px;">${venta.cambio.toFixed(2)}</p>
            </div>
            <div class="d-flex justify-content-end">
                <p class="fs-5 v_1 fw-bold mb-0 text-end" style="width: 100px;">TOTAL:</p>
                <p class="fs-5 v_1 fw-bold mb-0 text-end" style="width: 100px;">${venta.totalPrice.toFixed(2)}</p>
            </div>
            
        </div>
        <span style="display: none;" >----------------------------------</span>
        <br>
        <div class="card_msg">
            <p>Mucha paz tienen los que aman tu ley, y nada los hace tropezar.</p>
            <p>Gracias por su compra y que tenga un lindo dia.</p>
        </div>
        <br>
        <br>
        <br>
    </div>    
    `

}
showInfo()


print_factura.addEventListener('click', e =>{
    window.print()
})