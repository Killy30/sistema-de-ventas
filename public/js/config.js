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

    console.log(cashiers);

    showListCashiers.innerHTML = ''
    cashiers.forEach((cashier, i) => {
        showListCashiers.innerHTML += `<tr>
            <th scope="row">${i+1}</th>
            <td>${cashier.name}</td>
            <td>${cashier.lastName}</td>
            <td>${cashier.id_code}</td>
            <td>${cashier.id_document}</td>
            <td>
                <a href="" data-dt="${cashier._id}" class="btn btn-danger delete">Eliminar</a>
            </td>
        </tr>`
    });
}

showMyTeam()

const createUser = async() =>{
    const name = document.getElementById('name')
    const lastName = document.getElementById('lastName')
    const id_document = document.getElementById('id_document')

    if(name.value.trim() == "" && lastName.value.trim() == "") return false

    let data = {
        name: name.value,
        lastName: lastName.value, 
        id_document: id_document.value
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
        showMyTeam()
        name.value = ""
        lastName.value = ""
        id_document.value = ""
    } catch (error) {
        console.log(error);
    }
}

const deleteUsers = async(id) =>{
    let data = {id}
    try {
        let req = await fetch('/delete-cashier',{
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
        let error = 'Por favor agregue productos antes de realizar la compra...'
        errorMessage(error,'alert alert-succes')
        
    } catch (error) {
        
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
    
    if(e.target.classList.contains('delete') ){
        e.preventDefault()
        if(confirm('Deseas eliminar este usuario?')){
            let id = e.target.dataset.dt
            deleteUsers(id)
        }
    } 
})