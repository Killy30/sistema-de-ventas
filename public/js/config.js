const showListCashiers = document.querySelector('.showListCashiers')

import errorMessage from "./errorMSG.js"

const getUser = async() =>{
    try {
        let req = await fetch('/get-user')
        let res = await req.json()
        return res
    } catch (error) {
        console.log(error);
    }
}



const showMyTeam = async() =>{
    let data = await getUser()
    let cashiers = data.data.cashiers

    showListCashiers.innerHTML = ''
    cashiers.forEach((cashier, i) => {
        showListCashiers.innerHTML += `<tr>
            <th scope="row">${i+1}</th>
            <td>${cashier.name}</td>
            <td>${cashier.lastName}</td>
            <td>${cashier.id_code}</td>
            <td>${cashier.id_document}</td>
            <td>
                <a href="" data-id_status="${cashier._id}" class="btn ${cashier.status ? 'text-success' :'text-danger' } status">
                    ${(cashier.status) ? 'Activo' : 'Inactivo' }
                </a>
            </td>
            <td>
                <button type="button" data-id_detail="${cashier._id}" class="btn text-primary detail" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    Ver detalle
                </button>
            </td>
        </tr>`
    });
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
        console.log(res.msg);
        if(!res.conFirm){
            return alert(res.msg)
        }
        showMyTeam()
        name.value = ""
        lastName.value = ""
        id_document.value = ""
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

        console.log(res);
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

const store_name = document.getElementById('store_name')
const store_address = document.getElementById('store_address')
//store name 
const storeName = async() =>{
    
    if(store_name.value.trim() == "" && store_address.value.trim() == "") return false

    let data = {name: store_name.value, address: store_address.value}

    try {
        let req = await fetch('/store-name', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        let res = await req.json()
        
        showStoreName()
        let msg = 'Los datos se han enviado exitosamente...'
        errorMessage(msg,'alert alert-success')
        
    } catch (error) {
        console.log(error);
    }
}

const showStoreName = async() =>{
    let user = await getUser()
    let show_name = document.getElementById('show_s_n')

    store_name.value = user.data.storeName ? user.data.storeName : ""
    show_name.innerText = user.data.storeName ? user.data.storeName : ""
    store_address.value = user.data.storeAddress ? user.data.storeAddress : ""
}
showStoreName()



document.getElementById('btn_add_user').addEventListener('click', createUser)
document.getElementById('btn_storeName').addEventListener('click', storeName)

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