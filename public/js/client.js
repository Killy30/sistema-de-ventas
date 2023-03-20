const tbody_clients_list = document.getElementById('tbody_clients')

import data from './data.js'

const show_clients = async()=>{
    const clients = await data.getClients()

    console.log(clients.data);

    tbody_clients_list.innerHTML = ''
    clients.data.forEach(client => {
        tbody_clients_list.innerHTML += `
            <tr>
                <td>${client.id_client}</td>
                <td>${client.name}</td>
                <td>${client.lastName}</td>
                <td>${client.email}</td>
                <td>${client.id_doc}</td>
                <td>${client.tel}</td>
                <td>
                    <button>Mostrar</button>
                </td>
            </tr>
        `
    });
}
show_clients()

const create_client = async() =>{
    const name = document.getElementById('name').value
    const lastName = document.getElementById('lastName').value
    const email = document.getElementById('email').value
    const doc_id = document.getElementById('doc_id').value
    const tel = document.getElementById('tel').value

    if(name.trim() == '' && lastName.trim() == ''){
        alert('El input nombre y apellido del cliente son requeridos...')
        return false
    }

    let data = {name, lastName, email, doc_id, tel}
    console.log(data);

    try {
        let req = await fetch('/create-client',{
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        let res = req.json()
        show_clients()
    } catch (error) {
        console.error(error)
    }

}
const btn_create = document.getElementById('btn_create')

btn_create.addEventListener('click', create_client)