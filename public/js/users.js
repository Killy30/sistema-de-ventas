const showListCashiers = document.querySelector('.showListCashiers')
const _tfoot = document.querySelector('.tfoot')

import errorMessage from "./errorMSG.js"
import data from './data.js'
import emergent_alert from "./emergentAlert.js"

const showMyTeam = async() =>{
    let user = await data.getUser()
    let cashiers = user.data.cashiers.reverse()

    showListCashiers.innerHTML = ''
    cashiers.forEach((cashier, i) => {
        showListCashiers.innerHTML += `<tr>
            <td>${cashier.name}</td>
            <td>${cashier.lastName}</td>
            <td>${cashier.id_code}</td>
            <td>${cashier.id_document}</td>
            <td>
                <a href="" data-id_status="${cashier._id}" class="btn p-0 ${cashier.status ? 'text-success' :'text-danger' } status">
                    ${(cashier.status) ? 'Activo' : 'Inactivo' }
                </a>
            </td>
            <td>
                <button type="button" data-id_detail="${cashier._id}" class="btn p-0 text-primary detail" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                    Ver detalle
                </button>
            </td>
        </tr>`
    });
    // _tfoot.innerHTML = `<p class="text-end m-0">Cajeros: ${cashiers.length}</p>`
}
showMyTeam()

const createUser = async() =>{
    const name = document.getElementById('name')
    const lastName = document.getElementById('lastName')
    const id_document = document.getElementById('id_document')
    const tel = document.getElementById('tel')
    const email = document.getElementById('email')

    if(name.value.trim() == "" && lastName.value.trim() == "") return false

    let data = {
        name: name.value,
        lastName: lastName.value, 
        id_document: id_document.value,
        tel: tel.value,
        email: email.value
    }

    try {
        let req = await fetch('/new-cashier', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        let res = await req.json()

        if(!res.conFirm){
            return alert(res.msg)
        }
        showMyTeam()
        name.value = ""
        lastName.value = ""
        id_document.value = ""
        tel.value = ""
        email.value = ""
    } catch (error) {
        console.log(error);
    }
}

//change the status of user 
const changeStatus = async(id) =>{
    let data = {id}
    try {
        let req = await fetch('/status-cashier',{
            method: "POST", 
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        let res = await req.json()
        emergent_alert({msg:res.msg, color:'alert alert-success'})
        showMyTeam()
    } catch (error) {
        console.log(error);
    }
}

//show more detail about the user
const box_detail = document.getElementById('show_detail_cashier')
const showCashierDetail = async(id)=>{
    box_detail.innerHTML = ''

    try {
        let req = await fetch(`/cashier-detail/${id}`)
        let res = await req.json()
        const cashier = res.cashier

        box_detail.innerHTML = `<div>
            <div class="card_info">
                <div><p class="fw-bolder">Nombre</p></div>
                <div><p>${cashier.name}</p></div>
            </div>
            <div class="card_info">
                <div><p class="fw-bolder">Apellido</p></div>
                <div><p>${cashier.lastName}</p></div>
            </div>
            <div class="card_info">
                <div><p class="fw-bolder">Codigo</p></div>
                <div><p>${cashier.id_code}</p></div>
            </div>
            <div class="card_info">
                <div><p class="fw-bolder">Documento</p></div>
                <div><p>${cashier.id_document}</p></div>
            </div>
            <div class="card_info">
                <div><p class="fw-bolder">Numero</p></div>
                <div><p>${cashier.tel ? cashier.tel : '-'}</p></div>
            </div>
            <div class="card_info">
                <div><p class="fw-bolder">Correo</p></div>
                <div><p>${cashier.email ? cashier.email : '-'}</p></div>
            </div>
            <div class="card_info">
                <div><p class="fw-bolder">Ventas</p></div>
                <div><p>${cashier.sales.length}</p></div>
            </div>
            <div class="card_info">
                <div><p class="fw-bolder">Estado</p></div>
                <div><p>${cashier.status ? 'Activo' : 'Inactivo'}</p></div>
            </div>
        </div>`

    } catch (error) {
        console.log(error);
    }
}

//events
window.addEventListener('click', e =>{
    if(e.target.classList.contains('status')){
        e.preventDefault()
        if(confirm('Deseas cambiar el estado de este usuario?')){
            let id = e.target.dataset.id_status
            changeStatus(id)
        }
    } 
    if(e.target.classList.contains('detail')){
        e.preventDefault()
        let id = e.target.dataset.id_detail
        showCashierDetail(id)
    }
})



document.getElementById('btn_add_user').addEventListener('click', createUser)