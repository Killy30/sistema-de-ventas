const tbody = document.getElementById('tbody')
const input_search = document.getElementById('input_search')
const btn_update = document.getElementById('btn_update')
const createP = document.getElementById('createP')
const countProducts = document.getElementById('countProducts')
let btn_next = document.getElementById('btn_next')
let btn_prev = document.getElementById('btn_prev')

const APIBASE = '/data-apis'
let pageIndex = 1

import loader from "./loader.js"
import alert_message from './alertMSG.js'
import data from './data.js'
import emergent_alert from "./emergentAlert.js"
import handleElements from './handleElements.js'
import { elementsPagination } from "./elementsPagination.js"

const getAllProducts = async() =>{
    try {
        return data.getProducts()
    } catch (error) {
        console.log(error);
    }
}

const showAllProductsPagination = async() => {
    try {
        tbody.innerHTML = `${loader()}`
        const user = await data.getUser()
        const products = await data.getProductsPagination(pageIndex)

        showAllProducts(products, user)
    } catch (error) {
        console.log(error);
    }
}

showAllProductsPagination()

const searchProductsPagination = async() => {
    try {
        if(input_search.value.trim() == '') return false
        tbody.innerHTML = `${loader()}`
        const user = await data.getUser()
        const datas = {element: 'products', text: input_search.value, index: pageIndex};
        const products = await data.searchElements(JSON.stringify(datas))

        showAllProducts(products, user)
    } catch (error) {
        console.log(error);
    }
}

// show all products

const showAllProducts = async(products, user) =>{

    let acceptITBIS = user.data.system_control.acceptITBIS
    let the_products = products.outputArray
    let x = localStorage.getItem('admin')
     
    //const obj_elements = {datas: products, countElement: countProducts, handleElements, btn_prev, btn_next}
    elementsPagination({datas: products, countElement: countProducts, handleElements, btn_prev, btn_next})
    
    tbody.innerHTML = ""
    if(the_products.length == 0){
        return noElement()
    }
    
    the_products.forEach(product => {
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
    
    if(x == 'false') {
        document.querySelectorAll('.status').forEach(item => {
            handleElements.disableElement(item)
        })
    }

    if(acceptITBIS){
        let cards = document.querySelectorAll('.itbis_card')
        cards[0].style.display = 'block'
        cards[1].style.display = 'block'
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

    const allproducts = await getAllProducts()
    
    if(idcode.value.trim() === "" || name.value.trim() === "" || price.value.trim() === "" || buy_price.value.trim() === ""){
        let obj_msg = {
            msg: 'Por favor llenar los campos requeridos...',
            color: 'alert alert-danger',
        }
        return emergent_alert(obj_msg)
    }else{
        if(allproducts.my_products.some(product => product.idcode == idcode.value)){
            let obj_msg = {
                msg: 'Este codigo ya existe en tu lista, por favor colocar un nuevo codigo...',
                color: 'alert alert-danger',
            }
            return emergent_alert(obj_msg)
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

                let req = await fetch(APIBASE + '/new-product', {
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
                
                showAllProductsPagination()
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
                }
                
                emergent_alert(obj_msg)
            } catch (error) {
                console.log(error);
            }
        }
    }
}

const open_new_categary = (e) =>{
    e.preventDefault()
    document.querySelector('.card_new_ctg').classList.toggle('display_none')
}

const create_new_category = async() =>{
    let text_ctg = document.getElementById('text_new_ctg')

    try {
        if(text_ctg.value.trim() === '') return false

        let req = await fetch(APIBASE + '/new-category', {
            method:'POST',
            body: JSON.stringify({data: text_ctg.value}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        let res = await req.json()
    
        text_ctg.value = ''
    
        let obj_msg = { msg: res.msg, color: 'alert alert-success', index: 0 }
        
        emergent_alert(obj_msg)
        show_category_list()
        document.querySelector('.card_new_ctg').classList.add('display_none')
    } catch (error) {
        console.log(error);
    }
}

const show_category_list = async() =>{
    let categoryList_c = document.getElementById('category')
    let categoryList_u = document.getElementById('category_update')
    let user = await data.getUser()
    categoryList_c.innerHTML = '<option value="">Selecciona categoria</option>'
    categoryList_u.innerHTML = '<option value="">Selecciona categoria</option>'
   
    user.data.prod_category.forEach(ctg =>{
        categoryList_c.innerHTML += `<option value="${ctg.category}">${ctg.category}</option>`
        categoryList_u.innerHTML += `<option value="${ctg.category}">${ctg.category}</option>`
    })
}
show_category_list()

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
            let req = await fetch(APIBASE + '/update-product', {
                method: 'PUT',
                body:JSON.stringify(datas),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            let res = await req.json()

            showAllProductsPagination()

            let obj_msg = {
                msg: 'El producto se ha actualizado exitosamente...',
                color: 'alert alert-success',
                index: 1
            }
            
            emergent_alert(obj_msg)
        } catch (error) {
            console.log(error);
        }
    }else if(pro.length == 1 && pro.some(item => item._id == _id)){
        try {
            let req = await fetch(APIBASE + '/update-product', {
                method: 'PUT',
                body:JSON.stringify(datas),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            let res = await req.json()

            showAllProductsPagination()
            let obj_msg = {
                msg: 'El producto se ha actualizado exitosamente...',
                color: 'alert alert-success',
                index: 1
            }
            
            emergent_alert(obj_msg)
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
        let req = await fetch(`${APIBASE}/update-product/${id}`)
        let res = await req.json()
        viewProductValue(res)
    }
    //delete product
    if(e.target.classList.contains('status')){
        let id = e.target.dataset.id
        if(confirm('Deseas cambiar el estado de este producto')){
            let req = await fetch(`${APIBASE}/change-status-product/${id}`)
            let res = await req.json()
            showAllProductsPagination()
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

const btn_search = document.getElementById('btn_search')

btn_search.addEventListener('click', e => {
    pageIndex = 1
    searchProductsPagination()
})

btn_next.addEventListener('click', (e) => {
    pageIndex++
    input_search.value.length == 0 ? showAllProductsPagination() : searchProductsPagination()
})
btn_prev.addEventListener('click', (e) => {
    pageIndex--
    input_search.value.length == 0 ? showAllProductsPagination() : searchProductsPagination()
})

createP.addEventListener('click', createProduct)
btn_update.addEventListener('click', updateProduct)

document.getElementById('open_create_ctg').addEventListener('click', open_new_categary)
document.getElementById('create_new_ctg').addEventListener('click', create_new_category)