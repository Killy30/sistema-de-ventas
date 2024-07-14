import data from './data.js'
import emergent_alert from "./emergentAlert.js"
import html from './html.js'

const APIBASE = '/data-apis'

let card_checkouts = document.querySelector('.card_checkouts')
let card_details = document.querySelector('.card_details')


const showCheckouts = async() =>{
    const checkouts = await data.getCheckouts()
    console.log(checkouts);

    card_checkouts.innerHTML = ''
    checkouts.checkout.forEach(element => {
        card_checkouts.innerHTML += `
            <div class="card_checkout ">
                <div class="card_checkout_wxk" >
                    <div class="" >
                        <p class="fs-6 m-0">
                            Caja #${element.checkout}
                        </p>
                    </div>
                    <div class="d-flex">
                        <div class="d-flex me-5">
                            <div class="card_xcv me-3">
                                <p class="m-0 ${element.active ? 'text-success' : 'text-danger'}">
                                    ${element.active ? 'Activado' : 'Inactivo'}
                                </p>
                            </div>
                            <div class="card_xcv">
                                <p class="m-0 ${element.connect ? 'text-success' : 'text-warning'}">
                                    ${element.connect ? 'Conectado' : 'Desconectado'}
                                </p>
                            </div>
                        </div>
                        <div class="checkout_menu_box click_open_menu_checkout" data-num="${element.checkout}">
                            <span data-num="${element.checkout}" class="material-symbols-outlined click_open_menu_checkout more__vert">more_vert</span>
                            <div class="card_menu_checkout" style="display: none">
                                <div class="link_card_checkout">
                                    <a class="active_checkout" data-id="${element._id}" href="">
                                        ${element.active ? 'Desactivar' : 'Activar'}
                                    </a>
                                </div>
                                <div class="link_card_checkout">
                                    <a class="disconnect_checkout ${element.connect ? '' : 'inactive'}" href="" data-id="${element._id}">
                                        Desconectar
                                    </a>
                                </div>
                                <div class="link_card_checkout">
                                    <a class="seeDetails" data-num="${element.checkout}" href="" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                                        Ver detalles
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    });
    
}
showCheckouts()

const create_checkout = async() =>{
    let req = await fetch(APIBASE + '/new-checkout', {
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    let res = await req.json()
    
    if(res.status){
        showCheckouts()
        let msg = 'La caja ha sido creado exitosamente...'
        return emergent_alert({msg: msg, color:'alert alert-success'})
    }else{
        return emergent_alert({msg:res.msg, color:'alert alert-warning'})
    }
}

const activeCheckout = async (id) => {
    try {
        if(confirm('Seguro que quieres realizar este accion')){
            let req = await fetch(`${APIBASE}/active-checkout/${id}`)
            let res = await req.json()

            showCheckouts()
            return emergent_alert({msg: res.msg, color: res.color})
        }
    } catch (error) {
        console.log(error);
    }
}

const disconnectCheckout = async(id) =>{
    try {
        if(confirm('Seguro que deseas descaonectar esta caja')){
            let req = await fetch(`${APIBASE}/disconnect-checkout/${id}`)
            let res = await req.json()
        
            showCheckouts()
            return emergent_alert({msg: res.msg, color: res.color})
        }
    } catch (error) {
        console.log(error);
    }
}

const showDetails = async(num) => {
    const card_checkout = document.getElementById('show_detail_checkout')
    const checkouts = await data.getCheckouts()
    const checkout_details = checkouts.checkout.find(item => item.checkout == num)
    card_checkout.innerHTML = '';

    console.log(checkout_details);
    html.checkoutShowDetail(checkout_details, card_checkout)
}

window.addEventListener('click', (e)=>{
    const card_menu_checkout = document.querySelectorAll('.card_menu_checkout')

    if(e.target.classList.contains('click_open_menu_checkout')){
        const num = e.target.dataset.num
        
        card_menu_checkout[num-1].classList.toggle('d-block')
        
        card_menu_checkout.forEach((item, i) => {
            let x = i+1
            if(parseInt(num) !== x) item.classList.remove('d-block')
        })
    }

    if(!e.target.classList.contains('click_open_menu_checkout')){
        card_menu_checkout.forEach(item => {
            if(item.classList.contains('d-block')) item.classList.remove('d-block')
        })
    }

    if(e.target.classList.contains('active_checkout')){
        e.preventDefault()
        const id = e.target.dataset.id
        activeCheckout(id)
    }

    if(e.target.classList.contains('disconnect_checkout')){
        e.preventDefault()
        const id = e.target.dataset.id
        disconnectCheckout(id)
    }
    
    if(e.target.classList.contains('seeDetails')){
        e.preventDefault()
        const num = e.target.dataset.num
        showDetails(num)
    }
})
document.getElementById('btn_checkout').addEventListener('click', create_checkout)
