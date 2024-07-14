
let data = {}
const APIBASE = '/data-apis'


data.getProductsPagination = async(index)=>{
    let req = await fetch(`${APIBASE}/products-pagination/${index}`)
    let res = await req.json()
    return res
}

data.getsalesPagination = async(index)=>{
    let req = await fetch(`${APIBASE}/sales-pagination/${index}`)
    let res = await req.json()
    return res
}

data.getsalesDatePagination = async(data)=>{
    let req = await fetch(`${APIBASE}/sales-date-pagination/${data}`)
    let res = await req.json()
    return res
}

data.getClientsPagination = async(index)=>{
    let req = await fetch(`${APIBASE}/clients-pagination/${index}`)
    let res = await req.json()
    return res
}

data.getUsersPagination = async(index)=>{
    let req = await fetch(`${APIBASE}/users-pagination/${index}`)
    let res = await req.json()
    return res
}

data.getCashiers = async()=>{
    let req = await fetch(APIBASE + '/get-cashiers')
    let res = await req.json()
    return res
}

data.searchElements = async(data)=>{
    let req = await fetch(`${APIBASE}/search-elements/${data}`)
    let res = await req.json()
    return res
}

data.getProducts = async()=>{
    let req = await fetch(APIBASE + '/get-products')
    let res = await req.json()
    return res
}

data.getUser = async()=>{
    let req = await fetch(APIBASE + '/get-user')
    let res = await req.json()
    return res
}

data.getSales = async()=>{
    let req = await fetch(APIBASE + '/get-sales')
    let res = await req.json()
    return res
}

data.getClients = async()=>{
    let req = await fetch(APIBASE + '/get-clients')
    let res = await req.json()
    return res
}

data.getCheckouts = async()=>{
    let req = await fetch(APIBASE + '/get-checkouts')
    let res = await req.json()
    return res
}

export default data