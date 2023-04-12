const tbody_clients_list = document.getElementById('tbody_clients')

import emergent_alert from "./emergentAlert.js"
import data from './data.js'

const show_clients = async()=>{
    const clients = await data.getClients()

    tbody_clients_list.innerHTML = ''
    clients.data.forEach(client => {
        tbody_clients_list.innerHTML += `
            <tr>
                <td>${client.id_client}</td>
                <td>${client.name}</td>
                <td>${client.lastName}</td>
                <td>${client.email}</td>
                <td>${client.id_doc}</td>
                <td>${client.tel? client.tel : ''}</td>
                <td>
                    <button class="btn btn-primary details" data-id="${client._id}" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                        Mostrar
                    </button>
                </td>
            </tr>
        `
    });
}
show_clients()

const create_client = async() =>{
    const name = document.getElementById('name')
    const lastName = document.getElementById('lastName')
    const email = document.getElementById('email')
    const doc_id = document.getElementById('doc_id')
    const tel = document.getElementById('tel')

    if(name.value.trim() == '' && lastName.value.trim() == ''){
        alert('El input nombre y apellido del cliente son requeridos...')
        return false
    }

    let data = {
        name: name.value, 
        lastName: lastName.value,
        email: email.value, 
        doc_id: doc_id.value, 
        tel: tel.value
    }

    try {
        let req = await fetch('/create-client',{
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        let res = await req.json()
        
        if(!res.status){
            return emergent_alert({msg:res.msg, color:'alert alert-success'})
        }
        show_clients()
        name.value = ""
        lastName.value = ""
        email.value = ""
        doc_id.value = ""
        tel.value = ""
    } catch (error) {
        console.error(error)
    }

}

const showDetails = async(id) =>{
    const clients = await data.getClients()
    const products = await data.getProducts()

    const __name = document.querySelector('._name')
    const __lastName = document.querySelector('._lastName')
    const __code = document.querySelector('._code')
    const __email = document.querySelector('._email')
    const __phone = document.querySelector('._phone')
    const __sales = document.querySelector('._sales')
    const __total_sales = document.querySelector('._totalSales')
    const __document_id = document.querySelector('._idDoc')

    const __show_sales = document.getElementById('show_sales')
    const __show_products = document.getElementById('show_products')

    const client = clients.data.find(client => client._id === id)

    let totalSales = client.sales.reduce((acc, p) => acc = acc + p.totalPrice,0)

    __name.innerText = client.name
    __lastName.innerText = client.lastName
    __code.innerText = client.id_client
    __email.innerText = client.email
    __phone.innerText = client.tel
    __sales.innerText = client.sales.length
    __document_id.innerText = client.id_doc
    __total_sales.innerText = `$${totalSales.toFixed(2)}`


    let sales = client.sales.sort((a, b) => b.totalPrice - a.totalPrice)

    __show_sales.innerHTML = ''
    sales.forEach(sale => {
        let date = new Date(sale.date)
        __show_sales.innerHTML += `
            <tr>
                <td>${sale.code}</td>
                <td>${sale.products.length}</td>
                <td>${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}</td>
                <td>$${sale.totalPrice}</td>
            </tr>
        `
    })

    let products_ids = []
    let repete_id = []
    let products_id_repete = {}

    products_ids.splice(0, products_ids.length);

    client.sales.forEach(sale => {
        products_ids.push(...sale.products)
    })

    products_ids.forEach(id =>{
        products_id_repete[id] = (products_id_repete[id] || 0) + 1;
    })
    
    Object.entries(products_id_repete).forEach(([key, value]) =>{
        let the_obj = {}
        the_obj[key] = value
        repete_id.push(the_obj)
    })

    let the_products_obj = repete_id.sort((a, b) => Object.values(b) - Object.values(a))

    __show_products.innerHTML = ''
    the_products_obj.forEach(id => {
        let _id = Object.keys(id);
        let units = Object.values(id)
        let product = products.my_products.find(product => product._id == _id)

        __show_products.innerHTML +=`
            <tr>
                <td>${product.idcode}</td>
                <td title="${product.name}">${product.name}</td>
                <td>${units}</td>
            </tr>
        `
    })
}

tbody_clients_list.addEventListener('click', e =>{
    if(e.target.classList.contains('details')){
        let id = e.target.dataset.id
        showDetails(id)
    }
})

const btn_create = document.getElementById('btn_create')
btn_create.addEventListener('click', create_client)