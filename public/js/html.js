

let html = {}

html.checkoutShowDetail = (checkout, card_details) => {
    card_details.innerHTML = `<div>
        <div class="d-flex">
            <strong>Caja: #</strong> <p>${checkout.checkout}</p>
        </div>
        <div class="d-flex">
            <strong>Estado: </strong> <p>${checkout.active}</p>
        </div>
        <div class="d-flex">
            <strong>Estado: </strong> <p>${checkout.connect}</p>
        </div>
        <div class="d-flex">
            <strong>Codigo de ingreso: </strong> <p>${checkout.entryCode}</p>
        </div>
        <div class="d-flex">
            <strong>Cajera: </strong> <p>${checkout.cashier}</p>
        </div>
        <div class="d-flex">
            <strong>Dispositivo: </strong> <p>${checkout.machine}</p>
        </div>
        <div class="d-flex">
            <strong>Total ventas de hoy: </strong> <p></p>
        </div>
        <div class="d-flex">
            <strong>Cantidad de ventas de hoy: </strong> <p>${checkout.sales.length}</p>
        </div>
        <div class="d-flex">
            <strong>Total ventas: </strong> <p></p>
        </div>
        <div class="d-flex">
            <strong>Cantidad de ventas: </strong> <p>${checkout.sales.length}</p>
        </div>
        <div class="d-flex">
            <strong>Creado en: </strong> <p>-</p>
        </div>
    </div>`
}

{/* <div class="d-flex border-bottom d_block">
    <div style="width: 150px;" class="d_block"> <p class="d_block mb-0 p-2">${product.idcode}</p> </div>
    <div style="width: 200px;" class="d_block"> <p class="d_block mb-0 p-2">${product.name.toUpperCase()}</p> </div>
    <div style="width: 100px;" class="d_block"> <p class="d_block mb-0 p-2">$${product.sum_price}</p> </div>
    <div style="width: 100px;" class="d_block p-2"> <a href="#" class="add_p" data-id="${product.idcode}" >Agregar</a> </div>
</div> */}

{/* <div class="d-flex border-bottom d_block">
                <div style="width: 100px;" class="d_block"> <p class="d_block mb-0 p-2">${client.id_client}</p> </div>
                <div style="width: 250px;" class="d_block"> <p class="d_block mb-0 p-2">${client.name} ${client.lastName}</p> </div>
                <div style="width: 100px;" class="d_block"> 
                    <a href="#" class="add_c" data-id_client="${client._id}" data-name="${client.name} ${client.lastName}">Agregar</a> 
                </div>
            </div> */}

export default html