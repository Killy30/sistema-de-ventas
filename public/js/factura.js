

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
    let theProducts = await data.getProducts()

    let cashier = user.data.cashiers.find(cashier =>{
        return cashier._id == venta.cashier
    })

    let time = new Date(venta.date)

    fbody.innerHTML = `<div class="boxFactura">
        <h3 class="name_store">${user.data.storeName}.</h3>
        <div class="card_address">
            <p>${user.data.storeAddress ? user.data.storeAddress : 'No direccion'}</p>
        </div>
        <div class="card_code">
            <p class="">Codigo: ${venta.code}</p>       
        </div>
        <div class="card_date">
            <p class="">
                Fecha: ${time.getDate()}/${(time.getMonth()+1)}/${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}
            </p>
        </div>
        ${
            user.data.system_control.add_N_C_receipt?
            `<p>Caja: ${cashier.name} ${cashier.lastName}</p>`
            : ''
        }
        <div class="ftable">
            <span style="display: none;">--------------------------------</span>
            <div class="fheader">
                <p class="hl">Descripcion</p>
                <span style="display: none;" class="space"></span>
                <p class="hr">precio</p>
            </div>
            <span style="display: none;">--------------------------------</span>
            <div class="fbodyx">
                ${
                    venta.productsSold.map(prox =>{
                        let product = theProducts.my_products.find(pro => pro.idcode == prox.productCode)
                        return `
                            <div class="fbodyRow">
                                <p class="hl">
                                    ${product.name.substring(0, 15).toUpperCase()}
                                </p>
                                <span style="display: none;" class="space"></span>
                                <p class="hr">
                                    ${prox.price.toFixed(2)}
                                </p>
                            </div>
                        `
                    }).join('')
                }
            </div>
        </div>
        <span style="display: none;" >--------------------------------</span>
        <br>
        <div class="d-flex flex-column">
            <div class="d-flex justify-content-end">
                <p class=" m-0 text-end" style="width: 130px;">SUBTOTAL:---></p>
                <p class=" m-0 text-end" style="width: 100px;">${venta.subTotal.toFixed(2)}</p>
            </div>
            <div class="justify-content-end" style='display: ${venta.subTotal !== venta.totalPrice ? 'flex' : 'none'}'>
                <p class=" m-0 text-end" style="width: 100px;">ITBIS:---></p>
                <p class=" m-0 text-end" style="width: 100px;">${venta.itbis.toFixed(2)}</p>
            </div>
            <div class="d-flex justify-content-end">
                <p class="hide_f m-0 text-end" style="width: 100px;">PAGO:---></p>
                <p class="hide_f m-0 text-end" style="width: 100px;">${venta.pay}</p>
            </div>
            <div class="d-flex justify-content-end">
                <p class="hide_f m-0 text-end" style="width: 130px;">CAMBIO:---></p>
                <p class="hide_f m-0 text-end" style="width: 100px;">${venta.cambio.toFixed(2)}</p>
            </div>
            <div class="d-flex justify-content-end">
                <p class="fs-5 v_1 text-end" style="width: 130px; font-weight: 500">TOTAL:---></p>
                <p class="fs-5 v_1 text-end" style="width: 100px; font-weight: 500">${venta.totalPrice.toFixed(2)}</p>
            </div>
            
        </div>
        <span style="display: none;" >--------------------------------</span>
        <br>
        <div class="card_msg">
            <p>
                ${user.data.footText ? user.data.footText.replace(/\n/g, '<br>') : ''}
            </p>
            <p>.</p>
            <p>.</p>
            <p>************ Vann ************</p>
            <p>.</p>
            <p>.</p>
            <p>.</p>
        </div>
    </div>    
    `
    
    const spaces = () =>{
        let space = document.querySelectorAll('.space')
        let leftp = document.querySelectorAll('.hl')
        let rightp = document.querySelectorAll('.hr')
    
        space.forEach((item, i) => {
            let lp = leftp[i].innerText.length
            let rp = rightp[i].innerText.length

            let wx = lp + rp;
            let tx = 30 - (wx + 7);
            item.innerText = Array(tx).fill('_').join('')

        });
    }
    spaces()
}
showInfo()



print_factura.addEventListener('click', e =>{
    window.print()
})