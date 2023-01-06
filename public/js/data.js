
let data = {}

data.getProducts = async()=>{
    let req = await fetch('/get-products')
    let res = await req.json()
    return res
}

data.getUser = async()=>{
    let req = await fetch('/get-user')
    let res = await req.json()
    return res
}

data.getSales = async()=>{
    let req = await fetch('/get-sales')
    let res = await req.json()
    return res
}

export default data