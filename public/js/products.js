const tbody = document.getElementById('tbody')
const input_search = document.getElementById('input_search')
const btn_update = document.getElementById('btn_update')
const createP = document.getElementById('createP')
const countProducts = document.getElementById('countProducts')

let productsXTV

import loader from "./loader.js"
import alert_message from './alertMSG.js'
import data from './data.js'
import emergent_alert from "./emergentAlert.js"

const getAllProducts = async() =>{
    try {
        tbody.innerHTML = `${loader()}`
        return data.getProducts()
    } catch (error) {
        console.log(error);
    }
}

// show all products
const showAllProducts = async() =>{
   
    const user = await data.getUser()
    let acceptITBIS = user.data.system_control.acceptITBIS

    let products = await getAllProducts()
    let the_products = products.my_products
    countProducts.innerText = 'Productos: '+the_products.length
    productsXTV = products
    
    tbody.innerHTML = ""
    if(the_products.length == 0){
        return noElement()
    }
    
    the_products.reverse().forEach(product => {
        tbody.innerHTML += `
            <tr>
                <td>${product.idcode}</td>
                <td>${product.name}</td>
                <td>${acceptITBIS ? product.sum_price.toFixed(2) : product.price.toFixed(2)}</td>
                <td class="nxh" title="${product.description}">${product.description}</td>
                <td>${product.category}</td>
                <td >
                    <button type="button" data-bs-toggle="modal" data-bs-target="#staticBackdrop" data-id="${product._id}" class="btn p-0 text-primary mr-2 edit">
                        Editar
                    </button>
                    <button type="button" data-id="${product._id}" class="btn p-0 ${product.status ? 'text-success' : 'text-danger'} status">
                        ${product.status ? 'Activado' : 'Desactivado'}
                    </button>
                </td>
            </tr>
        `
    });

    if(acceptITBIS){
        let cards = document.querySelectorAll('.itbis_card')
        cards[0].style.display = 'block'
        cards[1].style.display = 'block'
    }
}
showAllProducts()

//search products 
const searchProducts = async() =>{
    let products = await getAllProducts()
    tbody.innerHTML = ""

    let text = input_search.value.toLowerCase()

    for(let product of products.my_products){
        let name = product.name.toLowerCase()
        let code = product.idcode.toString()
        let desc = product.description.toLowerCase()

        if(name.indexOf(text) !== -1 || code.indexOf(text) !== -1 || desc.indexOf(text) !== -1){
            tbody.innerHTML += `
                <tr>
                    <td>${product.idcode}</td>
                    <td>${product.name}</td>
                    <td>${product.sum_price}</td>
                    <td class="nxh" title="${product.description}">${product.description}</td>
                    <td>${product.category}</td>
                    <td>
                        <button type="button" data-bs-toggle="modal" data-bs-target="#staticBackdrop" data-id="${product._id}" class="btn p-0 text-primary mr-2 edit">
                            Editar
                        </button>
                        <button type="button" data-id="${product._id}" class="btn ${product.status ? 'text-success' : 'text-danger'} status">
                            ${product.status ? 'Activado' : 'Desactivado'}
                        </button>
                    </td>
                </tr>
            `
        }
    }
    if(tbody.innerHTML == ""){
        noElement()
    }
}

//character limit for product name
const c_limit = (data) =>{
    let nameLimit = document.getElementById('cCharacterLimit')
    let descriptionLimit = document.getElementById('cD_CharacterLimit')

    if(data.name == 'name'){
        nameLimit.innerText = `${data.text.length}/16`
    }else{
        descriptionLimit.innerText = `${data.text.length}/70`
    }
} 

const up_limit = (data) =>{
    let u_nameLimit = document.getElementById('uCharacterLimit')
    let u_descriptionLimit = document.getElementById('uD_CharacterLimit')

    if(data.name == 'name'){
        u_nameLimit.innerText = `${data.text.length}/16`
    }else{
        u_descriptionLimit.innerText = `${data.text.length}/70`
    }
} 

//create a new product
const createProduct = async() => {
    const idcode = document.getElementById('idcode')
    const name = document.getElementById('name')
    const buy_price = document.getElementById('buy_price')
    const price = document.getElementById('price')
    const category = document.getElementById('category')
    const description = document.getElementById('description')
    const itbis = document.getElementById('itbis')
    
    if(idcode.value.trim() === "" || name.value.trim() === "" || price.value.trim() === "" || buy_price.value.trim() === ""){
        let obj_msg = {
            msg: 'Por favor llenar los campos requeridos...',
            color: 'alert alert-danger',
            index: 0
        }
        return alert_message(obj_msg)
    }else{
        if(productsXTV.my_products.some(product => product.idcode == idcode.value)){
            let obj_msg = {
                msg: 'Este codigo ya existe en tu lista, por favor colocar otro codigo...',
                color: 'alert alert-danger',
                index: 0
            }
            return alert_message(obj_msg)
        }else{
            try {
                let data = {
                    idcode:idcode.value, 
                    name: name.value, 
                    buy_price: buy_price.value, 
                    price: price.value, 
                    category: category.value, 
                    description: description.value,
                    itbis: itbis.value
                }

                let req = await fetch('/new-product', {
                    method: 'POST',
                    body:JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                let res = await req.json()

                if(res.msg){
                    return emergent_alert({msg:res.msg, color: 'alert alert-danger'})
                }
                
                showAllProducts()
                idcode.value = ""
                name.value = ""
                buy_price.value = ""
                price.value = ""
                category.value = ""
                description.value = ""
                itbis.value = ""

                let obj_msg = {
                    msg: 'El producto se ha agregado exitosamente...',
                    color: 'alert alert-success',
                    index: 0
                }
                
                alert_message(obj_msg)
            } catch (error) {
                console.log(error);
            }
        }
    }
}

let _id;
//update a product
const viewProductValue = (product)=>{
    document.getElementById('idcode_update').value = product.product.idcode
    document.getElementById('name_update').value = product.product.name
    document.getElementById('buy_price_update').value = product.product.buy_price
    document.getElementById('price_update').value = product.product.price
    document.getElementById('itbis_update').value = product.product.itbis
    document.getElementById('category_update').value = product.product.category
    document.getElementById('description_update').value = product.product.description

    _id = product.product._id

    let uCharacterLimit = document.getElementById('uCharacterLimit')
    let u_descLimit = document.getElementById('uD_CharacterLimit')

    uCharacterLimit.innerText = `${product.product.name.length}/16`
    u_descLimit.innerText = `${product.product.description.length}/70`

}

const updateProduct = async(e) =>{
    const user = await data.getUser()

    const idcode = document.getElementById('idcode_update').value
    const name = document.getElementById('name_update').value
    const buy_price = document.getElementById('buy_price_update').value
    const price = document.getElementById('price_update').value
    const category = document.getElementById('category_update').value
    const description = document.getElementById('description_update').value
    const itbis = document.getElementById('itbis_update').value

    let products = await getAllProducts()

    let pro = products.my_products.filter((element, i) => {
        return element.idcode == idcode
    })

    if(idcode.trim() === "" || name.trim() === "" || price.trim() === ""){
        alert('Por favor llenar todos los campos requeridos')
        return false
    }

    let datas = {idcode, name, buy_price, price, category, description, _id, itbis}

    if(pro.length == 0){
        try {
            let req = await fetch('/update-product', {
                method: 'PUT',
                body:JSON.stringify(datas),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            let res = await req.json()

            showAllProducts()

            let obj_msg = {
                msg: 'El producto se ha actualizado exitosamente...',
                color: 'alert alert-success',
                index: 1
            }
            
            alert_message(obj_msg)
        } catch (error) {
            console.log(error);
        }
    }else if(pro.length == 1 && pro.some(item => item._id == _id)){
        try {
            let req = await fetch('/update-product', {
                method: 'PUT',
                body:JSON.stringify(datas),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            let res = await req.json()

            showAllProducts()
            let obj_msg = {
                msg: 'El producto se ha actualizado exitosamente...',
                color: 'alert alert-success',
                index: 1
            }
            
            alert_message(obj_msg)
        } catch (error) {
            console.log(error);
        }
    }else{
        alert('Este codigo ya existe en la base de datos, por favor agregue otro codigo');
    }
}

const table = document.querySelector('table')

table.addEventListener('click', async(e) =>{
    //edit product
    if(e.target.classList.contains('edit')){
        let id = e.target.dataset.id
        let req = await fetch(`/update-product/${id}`)
        let res = await req.json()
        viewProductValue(res)
    }
    //delete product
    if(e.target.classList.contains('status')){
        let id = e.target.dataset.id
        if(confirm('Deseas cambiar el estado de este producto')){
            let req = await fetch(`/change-status-product/${id}`)
            let res = await req.json()
            showAllProducts()
        }
    }
})

document.getElementById('name').addEventListener('keyup', e =>{
    let x = {text: e.target.value, name: 'name'}
    c_limit(x)
})
document.getElementById('description').addEventListener('keyup', e =>{
    let x = {text: e.target.value, name: 'desc'}
    c_limit(x)
})

document.getElementById('name_update').addEventListener('keyup', e =>{
    let x = {text: e.target.value, name:'name'}
    up_limit(x)
})
document.getElementById('description_update').addEventListener('keyup', e =>{
    let x = {text: e.target.value, name:'desc'}
    up_limit(x)
})

createP.addEventListener('click', createProduct)
btn_update.addEventListener('click', updateProduct)
input_search.addEventListener('keyup', searchProducts)