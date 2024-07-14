const showListCashiers = document.querySelector('.showListCashiers')
const _tfoot = document.querySelector('.tfoot')
const countElement = document.getElementById('countProducts')
let btn_next = document.getElementById('btn_next')
let btn_prev = document.getElementById('btn_prev')

const APIBASE = '/data-apis'
let pageIndex = 1

import errorMessage from "./errorMSG.js"
import data from './data.js'
import emergent_alert from "./emergentAlert.js"
import loader from "./loader.js"
import handleElements from './handleElements.js'
import { elementsPagination } from "./elementsPagination.js"

const getAllUsersPagination = async() =>{
    try {
        showListCashiers.innerHTML = `${loader()}`
        let cashiers = await data.getUsersPagination(pageIndex)
        
        showUsers(cashiers)
    } catch (error) {
        console.log(error);
    }
}

getAllUsersPagination()

const searchUsersPagination = async() =>{
    try {
        const input_search = document.getElementById('input_search').value;
        if(input_search.trim() == '') return false

        showListCashiers.innerHTML = `${loader()}`

        const datas = {element: 'users', text: input_search, index: pageIndex};

        const cashiers = await data.searchElements(JSON.stringify(datas))

        showUsers(cashiers)
    } catch (error) {
        console.log(error);
    }
}


const showUsers = async(cashiers ) =>{
    let cashiersArray = cashiers.outputArray.reverse()

    elementsPagination({datas: cashiers, countElement, handleElements, btn_prev, btn_next})

    showListCashiers.innerHTML = ''
    cashiersArray.forEach((cashier, i) => {
        showListCashiers.innerHTML += `<tr>
            <td>${cashier.name}</td>
            <td>${cashier.lastName}</td>
            <td>${cashier.id_code}</td>
            <td>
                <a href="" data-id_status="${cashier._id}" class="btn p-0 ${cashier.status ? 'text-success' :'text-danger' } status">
                    ${(cashier.status) ? 'Activo' : 'Inactivo' }
                </a>
            </td>
            <td>
                <a href="" data-id_connected="${cashier._id}" class="btn p-0 ${cashier.connect ? 'text-success' :'text-warning inactive' } connect">
                    ${(cashier.connect) ? 'Conectado' : 'Desconectado' }
                </a>
            </td>
            <td>
                <button type="button" data-id_detail="${cashier._id}" class="btn p-0 text-primary detail" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                    Ver detalle
                </button>
            </td>
        </tr>`
    });
}


const createUser = async() =>{
    const name = document.getElementById('name')
    const lastName = document.getElementById('lastName')
    const id_document = document.getElementById('id_document')
    const tel = document.getElementById('tel')
    const email = document.getElementById('email')

    if(name.value.trim() == "" && lastName.value.trim() == "") return false

    let datas = {
        name: name.value,
        lastName: lastName.value, 
        id_document: id_document.value,
        tel: tel.value,
        email: email.value
    }

    try {
        let req = await fetch(APIBASE + '/new-cashier', {
            method: 'POST',
            body: JSON.stringify(datas),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        let res = await req.json()

        if(!res.conFirm){
            return alert(res.msg)
        }
        getAllUsersPagination()
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
    let datas = {id}
    try {
        let req = await fetch(APIBASE + '/status-cashier',{
            method: "POST", 
            body: JSON.stringify(datas),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        let res = await req.json()
        emergent_alert({msg:res.msg, color:'alert alert-success'})
        getAllUsersPagination()
    } catch (error) {
        console.log(error);
    }
}

const disconnectCashier = async(id) =>{
    let datas = {id}
    try {
        let req = await fetch(`${APIBASE}/cashier-disconnected/${id}`,{
            method: "POST", 
            body: JSON.stringify(datas),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        let res = await req.json()
        emergent_alert({msg:res.msg, color: res.color})
        getAllUsersPagination()
    } catch (error) {
        console.log(error);
    }
}

//show more detail about the user
const box_detail = document.getElementById('show_detail_cashier')
const showCashierDetail = async(id)=>{
    box_detail.innerHTML = ''

    try {
        let req = await fetch(`${APIBASE}/cashier-detail/${id}`)
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

    if(e.target.classList.contains('connect')){
        e.preventDefault()
        if(confirm('Deseas desconectar este usuario?')){
            let id = e.target.dataset.id_connected
            disconnectCashier(id)
        }
    } 

    if(e.target.classList.contains('detail')){
        e.preventDefault()
        let id = e.target.dataset.id_detail
        showCashierDetail(id)
    }
})

const btn_search = document.getElementById('btn_search')

btn_search.addEventListener('click', e => {
    pageIndex = 1
    searchUsersPagination()
})
btn_next.addEventListener('click', (e) => {
    pageIndex++
    const input_search = document.getElementById('input_search').value;
    input_search.length == 0 ? getAllUsersPagination() : searchUsersPagination()
})
btn_prev.addEventListener('click', (e) => {
    pageIndex--
    const input_search = document.getElementById('input_search').value;
    input_search.length == 0 ? getAllUsersPagination() : searchUsersPagination()
})

document.getElementById('btn_add_user').addEventListener('click', createUser)