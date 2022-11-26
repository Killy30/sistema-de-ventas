const tbody = document.getElementById('tbody')
const input_search = document.getElementById('input_search')
const btn_update = document.getElementById('btn_update')
const createP = document.getElementById('createP')
const countProducts = document.getElementById('countProducts')

let productsXTV

import loader from "./loader.js"

const getAllProducts = async() =>{
    try {
        tbody.innerHTML = `${loader()}`
        let req = await fetch('/get-products')
        let res = await req.json()
        return res
    } catch (error) {
        console.log(error);
    }
}

// show all products
const showAllProducts = async() =>{
   
    let data = await getAllProducts()
    let the_products = data.my_products
    countProducts.innerText = 'Productos: '+the_products.length
    productsXTV = data
    
    tbody.innerHTML = ""
    if(the_products.length == 0){
        return noElement()
    }
    
    the_products.forEach(product => {
        tbody.innerHTML += `
            <tr>
                <td>${product.idcode}</td>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>${product.description}</td>
                <td>${product.category}</td>
                <td >
                    <button type="button" data-bs-toggle="modal" data-bs-target="#staticBackdrop" data-id="${product._id}" class="btn text-primary mr-2 edit">
                        Editar
                    </button>
                    <button type="button" data-id="${product._id}" class="btn ${product.status ? 'text-success' : 'text-danger'} status">
                        ${product.status ? 'Activado' : 'Desactivado'}
                    </button>
                </td>
            </tr>
        `
    });

    
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
                    <td>${product.price}</td>
                    <td>${product.description}</td>
                    <td>${product.category}</td>
                    <td>
                        <button type="button" data-bs-toggle="modal" data-bs-target="#staticBackdrop" data-id="${product._id}" class="btn text-primary mr-2 edit">
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

const errorMessage = (err,color) =>{
    const cardError = document.getElementById('msg_err')
    cardError.innerHTML = `<div class="${color} p-2 mb-3" role="alert"> ${err}</div>`
    setTimeout(() =>{
        cardError.innerHTML = ''
    },5000)
} 

//create a new product
const createProduct = async() => {
    const idcode = document.getElementById('idcode')
    const name = document.getElementById('name')
    const price = document.getElementById('price')
    const category = document.getElementById('category')
    const description = document.getElementById('description')

    
    // createP.setAttribute("data-bs-dismiss", "modal");
    // console.log(idcode.value.trim() === "" && name.value.trim() === "" && price.value.trim() === "");
    if(idcode.value.trim() === "" || name.value.trim() === "" || price.value.trim() === ""){
        let error = 'Por favor llenar los campos requeridos...'
        return errorMessage(error,'alert alert-danger')
    }else{
        // let products = await getAllProducts()
    
        if(productsXTV.my_products.some(product => product.idcode == idcode.value)){
            let error = 'Este codigo ya existe en tu lista, por favor colocar otro codigo...';
            return errorMessage(error,'alert alert-danger')
        }else{
            
            let data = {
                idcode:idcode.value, 
                name: name.value, 
                price: price.value, 
                category: category.value, 
                description: description.value,
                _id
            }
            
            try {
                let req = await fetch('/new-product', {
                    method: 'POST',
                    body:JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                let res = await req.json()
                
                showAllProducts()
                idcode.value = ""
                name.value = ""
                price.value = ""
                category.value = ""
                description.value = ""

                let error = 'El producto se ha agregado exitosamente...';
                errorMessage(error,'alert alert-success')

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
    document.getElementById('price_update').value = product.product.price
    document.getElementById('category_update').value = product.product.category
    document.getElementById('description_update').value = product.product.description

    _id = product.product._id
}

const updateProduct = async(e) =>{
    const idcode = document.getElementById('idcode_update').value
    const name = document.getElementById('name_update').value
    const price = document.getElementById('price_update').value
    const category = document.getElementById('category_update').value
    const description = document.getElementById('description_update').value

    

    let products = await getAllProducts()

    let pro = products.my_products.filter((element, i) => {
        return element.idcode == idcode
    })

    if(idcode.trim() === '' || name.trim() === "" || price.trim() === ""){
        alert('Por favor llenar los campos requeridos')
        return false
    }

    let data = {idcode, name, price, category, description, _id}

    if(pro.length == 0){
        try {
            let req = await fetch('/update-product', {
                method: 'POST',
                body:JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            let res = await req.json()
        } catch (error) {
            console.log(error);
        }
        
        showAllProducts()

    }else if(pro.length == 1 && pro.some(item => item._id == _id)){
        try {
            let req = await fetch('/update-product', {
                method: 'POST',
                body:JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            let res = await req.json()
        } catch (error) {
            console.log(error);
        }
        showAllProducts()
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


createP.addEventListener('click', createProduct)
btn_update.addEventListener('click', updateProduct)
input_search.addEventListener('keyup', searchProducts)