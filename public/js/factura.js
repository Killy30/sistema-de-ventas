

const print_factura = document.getElementById('print_factura')
const fbody = document.getElementById('fbody')

let id = window.location.href.split('a/')[1]

const getSale = async() =>{
    let req = await fetch('/get-sale/'+id)
    let res = await req.json()
    return res
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

const showInfo = async()=>{

    let sale = await getSale()
    let venta = sale.sale
    let user = await getUser()


    let time = new Date(venta.date)

    fbody.innerHTML = `<div>
        <br>
        <p class="titulo fs-1 fw-bold text-primary">${user.data.storeName}</p>
        <div class="card_address">
            <p>${user.data.storeAddress}</p>
        </div>
        <div class="card_code d-flex">
            <p class="v_1 me-3">Codigo:</p>
            <p class="v_2">${venta.code}</p>        
        </div>
        <div class="card_date d-flex">
            <p class="me-3">Fecha:</p>
            <div class="d-flex">
                <p style="margin-right: 3px;">
                    ${time.getDate()}/${(time.getMonth()+1)}/${time.getFullYear()}
                </p> 
                <p>
                    ${time.getHours()}:${time.getMinutes()}
                </p>
            </div>
        </div>
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
                                <td class="v_1">${product.name} ${product.description}</td>
                                <td class="v_2 text-end">${product.price}</td>
                            </tr>
                        `
                    }).join('')
                }
            </tbody>
        </table>
        <br>
        <div class="fw-bold d-flex justify-content-end flex-column">
            <div class="card_total d-flex">
                <p class="v_1 me-3 mb-0">Total:</p>
                <p class="v_2 m-0">${venta.totalPrice.toFixed(2)}</p>
            </div>

            <p class="hide_f m-0">Pago:    ${venta.pay}</p>
            <p class="hide_f m-0">Cambio:    ${venta.cambio.toFixed(2)}</p>
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


print_factura.addEventListener('click', e =>{
    window.print()
})