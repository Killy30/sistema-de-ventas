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
                <button type="button" data-id_detail="${cashier._id}" class="btn p-0 text-primary detail" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    Ver detalle
                </button>
            </td>
        </tr>`
    });
    _tfoot.innerHTML = `<p class="text-end m-0">Cajeros: ${cashiers.length}</p>`
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

//store name 
const postDataStore = async(_data) =>{
    try {
        let req = await fetch('/store-info', {
            method: 'POST',
            body: JSON.stringify(_data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        let res = await req.json()
        
        showStoreData()
        let msg = 'La actualización se han completado exitosamente...'
        errorMessage(msg,'alert alert-success')
        
    } catch (error) {
        console.log(error);
    }
}

const showStoreData = async() =>{
    let user = await data.getUser()
    let show_typeS = document.querySelector('.type_store')
 
    store_name.value = user.data.storeName ? user.data.storeName : ""
    show_typeS.innerText = user.data.typeStore ?  `Tipo de negocio: ${user.data.typeStore}`: ""
    store_address.value = user.data.storeAddress ? user.data.storeAddress : ""
    foot_text.value = user.data.footText ? user.data.footText : ""
}
showStoreData()

const addITBIS = document.getElementById('addITBIS')
const addNameC = document.getElementById('cashierName')
const btn_radios = document.querySelectorAll("input[name='t_fatura']")

let active_checkbox = async()=>{
    let user = await data.getUser()
    let _user = user.data

    _user.system_control.acceptITBIS ? addITBIS.checked = true : addITBIS.checked = false
    _user.system_control.add_N_C_receipt ? addNameC.checked = true : addNameC.checked = false

    if(_user.system_control.typePrint === 'ticket') btn_radios[0].checked = true
    if(_user.system_control.typePrint === 'digital') btn_radios[1].checked = true
}
active_checkbox()

const controlAll = async(x) =>{
    const req = await fetch('/accept-itbis', {
        method: 'POST',
        body: JSON.stringify(x),
        headers:{
            'Content-Type': 'application/json'
        }
    })
    const res = await req.json()
}

const store_name = document.getElementById('store_name')
const store_address = document.getElementById('store_address')
const foot_text = document.getElementById('store_foot_text')

let storeN = () =>{
    if(store_name.value.trim() == '') return false
    let _data = {name: store_name.value}
    postDataStore(_data)
}
let storeAds = () =>{
    if(store_address.value.trim() == '') return false
    let _data = {address: store_address.value}
    postDataStore(_data)
}
let storeFtx = () =>{
    if(foot_text.value.trim() == '') return false
    let _data = {footText: foot_text.value}
    postDataStore(_data)
}
let type_print = (e) =>{
    let _data  = {typePrint: e.target.value}
    postDataStore(_data)
}



document.getElementById('btn_add_user').addEventListener('click', createUser)
document.getElementById('btn_store_nam').addEventListener('click', storeN)
document.getElementById('btn_store_ads').addEventListener('click', storeAds)
document.getElementById('btn_store_ftx').addEventListener('click', storeFtx)

const the_card = document.querySelectorAll('.box_open')

document.querySelector('.form_list').addEventListener('click', e =>{
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

addITBIS.addEventListener('change', e =>{
    controlAll({value:e.currentTarget.checked, x:'1'});
})
addNameC.addEventListener('change', e =>{
    controlAll({value:e.currentTarget.checked, x:'2'});
})

btn_radios.forEach(btn =>{
    btn.addEventListener('change', type_print)
})

window.addEventListener('click', e =>{
    if(e.target.classList.contains('open_card_one')){
        the_card[0].classList.toggle('open_the_card_one')
    }
    if(e.target.classList.contains('open_card_two')){
        the_card[1].classList.toggle('open_the_card_two')
    }
    if(e.target.classList.contains('open_card_three')){
        the_card[2].classList.toggle('open_the_card_three')
    }
})