

const getAllProducts = async() =>{
    let req = await fetch('/get-products')
    let res = await req.json()
    return res
}

// show all products
const showAllProducts = async() =>{
    const tbody = document.getElementById('tbody')
    tbody.innerHTML = ""
    let data = await getAllProducts()
 
    data.products.forEach(product => {
        tbody.innerHTML += `
            <tr>
                <td>${product.idcode}</td>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>${product.description}</td>
                <td>${product.category}</td>
                <td class="text-end">
                    <button type="button" data-bs-toggle="modal" data-bs-target="#staticBackdrop" data-id="${product._id}" class="btn btn-primary mr-2 edit">
                        Editar
                    </button>
                    <button type="button" data-id="${product._id}" class="btn btn-danger delete">
                        Eliminar
                    </button>
                </td>
            </tr>
        `
    });
}

showAllProducts()

//create a new product
const createProduct = async() => {
    const idcode = document.getElementById('idcode').value
    const name = document.getElementById('name').value
    const price = document.getElementById('price').value
    const category = document.getElementById('category').value
    const description = document.getElementById('description').value

    let datas = await getAllProducts()

    let data = {idcode, name, price, category, description,_id}

    if(idcode.trim() === '' || name.trim() === "" || price.trim() === ""){
        alert('Por favor llenar los campos requeridos')
        return false
    }

    if(datas.products.some(product => product.idcode == idcode)){
        alert('Este codigo ya existe en la base de datos, por favor colocar otro codigo');
        return false
    }

    let req = await fetch('/new-product', {
        method: 'POST',
        body:JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          }
    })
    let res = await req.json()
    window.location.href = 'http://localhost/productos'
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

    let data = {idcode, name, price, category, description, _id}

    let products = await getAllProducts()

    let pro = products.products.filter((element, i) => {
        return element.idcode == idcode
    })

    if(idcode.trim() === '' || name.trim() === "" || price.trim() === ""){
        alert('Por favor llenar los campos requeridos')
        return false
    }

    if(pro.length == 0){
        let req = await fetch('/update-product', {
            method: 'POST',
            body:JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        let res = await req.json()
        // showAllProducts()
        window.location.href = 'http://localhost/productos'

    }else if(pro.length == 1 && pro.some(item => item._id == _id)){
        let req = await fetch('/update-product', {
            method: 'POST',
            body:JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        let res = await req.json()
        // showAllProducts()
        window.location.href = 'http://localhost/productos'
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
    if(e.target.classList.contains('delete')){
        let id = e.target.dataset.id
        if(confirm('Deseas eliminar este producto')){
            let req = await fetch(`/delete-product/${id}`)
            let res = await req.json()
            showAllProducts()
        }
        
    }
})

const btn_update = document.getElementById('btn_update')
const createP = document.getElementById('createP')

createP.addEventListener('click', createProduct)
btn_update.addEventListener('click', updateProduct)