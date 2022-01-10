

const print_factura = document.getElementById('print_factura')
const fbody = document.getElementById('fbody')

let id = window.location.href.split('a/')[1]

const getSale = async() =>{
    let req = await fetch('/get-sale/'+id)
    let res = await req.json()
    return res
}

const showInfo = async()=>{

    let sale = await getSale()
    let venta = sale.sale

    let time = new Date(venta.date)

    fbody.innerHTML = `<div>
        <h4 class="text-center">Roscar Events</h4>
        <div class="d-flex justify-content-center">
            <p style="width: 100%;">Codigo</p>
            <span>${venta.code}</span>        
        </div>
        <div class="d-flex">
            <span class="me-3">Fecha</span>
            <p style="margin-right: 3px;">
                ${fecha(time.getTime())} ${time.getDate()}/${time.getFullYear()}
            </p> 
            <p>
                ${time.getHours()}:${time.getMinutes()}
            </p>
        </div>
        <hr>
        <div class="d-flex justify-content-between">
            <span>Descripcion</span>
            <span>Valor</span>
        </div>
        <hr>
        <div>
            ${
                venta.products.map(product =>{
                    return `<div class="d-flex justify-content-between">
                        <span>${product.name}</span>
                        <span>${product.price}</span>
                    </div>
                    `
                }).join('')
            }
        </div>
        <hr>
        <div class="d-flex justify-content-between">
            <b>Total</b>
            <b>${venta.totalPrice}</b>
        </div>
        <hr>
        <div>
            <span>Gracias por su compra</span>
        </div>
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