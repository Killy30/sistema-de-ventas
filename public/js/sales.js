const tbody = document.getElementById('tbody')
import loader from "./loader.js"
import fecha from './month_es.js'

let salesAnalysis;
let productsAnalysis = []


const getAllSales = async() =>{
    let req = await fetch('/get-sales')
    let res = await req.json()
    return res
}
const getAllProducts = async() =>{
    let req = await fetch('/get-products')
    let res = await req.json()
    return res
}

const getData = async() =>{
    try {
        tbody.innerHTML = `${loader()}`
        let allSales = await getAllSales()
        let sales = allSales.sales

        salesAnalysis = sales
        showListSales(sales)
    } catch (error) {
        console.log(error);
    }
}
getData()

const showListSales = async(sales) =>{

    tbody.innerHTML = ""

    if(sales.length == 0){
        return noElement()
    }
    
    for(var i = sales.length - 1; i >= 0; i--){
        let time = new Date(sales[i].date)
        tbody.innerHTML += `
            <tr>
                <td>${i+1}</td>
                <td>${sales[i].code}</td>
                <td>${sales[i].products.length}</td>
                <td> 
                    ${fecha(time.getTime())} ${time.getDate()}/${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}   
                </td>
                <td>${sales[i].totalPrice}</td>
                <td class="text-end">
                    <a href="/factura/${sales[i]._id}" data-id="${sales[i]._id}" class="btn btn-primary">
                        Ver detalle
                    </a>
                </td>
            </tr>
        `
    }
}

const getAnalysis = async()=>{
    
    let total = salesAnalysis.reduce((acc, t) => acc = acc + t.totalPrice ,0)
    productsAnalysis.splice(0, productsAnalysis.length)
    
    
    salesAnalysis.forEach( sale => {
        productsAnalysis.push(...sale.products)
    })
    // console.log(productsAnalysis);

    var repete_object = {};
    var repete_array = []

    productsAnalysis.forEach(product =>{
        repete_object[product] = (repete_object[product] || 0) + 1;
    });

    Object.entries(repete_object).forEach(([key, value]) => {
        let obt = {}
        obt[key] = value
        repete_array.push(obt)
    });

    // console.log(repete_object);
    console.log(repete_array);

    let maxValue = repete_array.sort((a, b) => Object.values(b) - Object.values(a))

    let data = await getAllProducts()

    console.log(data);
    // console.log(maxValue[0]);
    // console.log(Object.keys(maxValue[0])); sales system and business management

    //get all the products that have been sold with his names and his prices
    let products_info = [];
    repete_array.forEach(product_obj =>{
        let key = Object.keys(product_obj)
        let value = Object.values(product_obj)
      
        let theProduct = data.my_products.find(product => product._id == key[0])
        console.log(theProduct);
        let p = {
            name: theProduct.name,
            price: theProduct.price,
            soldUnits: value[0],
            soldTotal: (parseInt(value[0]) * theProduct.price).toFixed(2)
        }
        products_info.push(p)
    })

    console.log(products_info);

    if(productsAnalysis.length > 1){
        let firstID = Object.keys(maxValue[0]) || 0
        let secondID = Object.keys(maxValue[1] || {}) || 0
        
        let maxProduct1 = data.my_products.find(product => product._id == firstID) || {};
        let maxProduct2 = data.my_products.find(product => product._id == secondID) || {};
        

        let objProducts = {
            maxProduct1: maxProduct1 || 'No product', 
            maxProduct2: maxProduct2 || 'No product',
            maxValue1: Object.values(maxValue[0]) || 0, 
            maxValue2: Object.values(maxValue[1]) || 0, 
            total: total || 0
        }
        getGrafict(objProducts, products_info)


    }else if(productsAnalysis.length == 1){
        let maxProduct1 = data.products.find(product => product._id == Object.keys(maxValue[0]))

        let objProducts = {
            maxProduct1: maxProduct1 || 'No product', 
            maxProduct2: 'No product',
            maxValue1: Object.values(maxValue[0]) || 0, 
            maxValue2: 0, 
            total: total || 0
        }
        getGrafict(objProducts, products_info)

    }else if(productsAnalysis.length == 0){

        let objProducts = {
            maxProduct1: 'No product', 
            maxProduct2: 'No product',
            maxValue1: 0, 
            maxValue2: 0, 
            total: 0
        }
        getGrafict(objProducts, products_info)
    }
}


//grafica
let chart;
const getGrafict = async(objProducts, products_info) =>{
    const allSales = await getAllSales()
    const productsGrafict = document.getElementById('productsGrafict').getContext('2d')
    
    if (chart) {
        chart.destroy();
    }
    const totalBox = document.getElementById('totalBox')
    const listProductInfo = document.getElementById('listProductInfo')


    totalBox.innerText = objProducts.total.toFixed(2)

    products_info.forEach(product => {
        listProductInfo.innerHTML += `<div class="card mb-1 p-2">
            <p>Nombre: ${product.name}</p>
            <p>Precio: ${product.price}</p>
            <p>Unidad vendida: ${product.soldUnits}</p>
            <p>Total de venta: ${product.soldTotal}</p>
        </div>`
    })

    const productLabels = [objProducts.maxProduct1.name, objProducts.maxProduct2.name];

    const data = {
        labels: productLabels,
        datasets: [{
            label: 'Ventas por mes',
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)'
            ],
            data: [objProducts.maxValue1,objProducts.maxValue2],
        }]
    };
    
    const config = {
        type: 'doughnut',
        data: data,
        options: {}
    };

    chart = new Chart(productsGrafict, config);
}


const typeSearch = document.getElementById('typeSearch')
const btn_day = document.getElementById('btn_day')
const btn_week = document.getElementById('btn_week')
const btn_month = document.getElementById('btn_month')
const btn_code = document.getElementById('btn_code')

const selectType = (data)=>{
    if(data === 'day'){
        document.getElementById('day').style.display = 'flex'
        document.getElementById('month').style.display = 'none'
        document.getElementById('code').style.display = 'none'
    }else if(data === 'month'){
        document.getElementById('day').style.display = 'none'
        document.getElementById('month').style.display = 'flex'
        document.getElementById('code').style.display = 'none'
    }else if(data === 'all'){
        document.getElementById('day').style.display = 'none'
        document.getElementById('month').style.display = 'none'
        document.getElementById('code').style.display = 'none'
        getData()
    }else if(data === 'code'){
        document.getElementById('day').style.display = 'none'
        document.getElementById('month').style.display = 'none'
        document.getElementById('code').style.display = 'flex'
    }
}

selectType(typeSearch.value)


//
const getDateToSearch = async(e) =>{
    const dayDate = document.getElementById('input_day').value

    try {
        if(dayDate.trim() === ''){
            return alert('Debes colocar el dia de las ventas')
        }

        tbody.innerHTML = `${loader()}`

        let allSales = await getAllSales()

        const sales_day = allSales.sales.filter( sale => {
            let date = new Date(sale.date)
            let fulldate = `${date.getFullYear()}-${(date.getMonth()+1) > 9?(date.getMonth()+1):`${0}${(date.getMonth()+1)}`}-${date.getDate() > 9?date.getDate():`${0}${date.getDate()}`}`
            return fulldate ==  dayDate
        })

        let total = sales_day.reduce((acc, t) => acc = acc + t.totalPrice ,0)

        showListSales(sales_day)
        salesAnalysis = sales_day
        
    } catch (error) {
        console.log(error);
    }
    
}


//
const getMonthToSearch = async(e) =>{
    const month = document.getElementById('input_month').value

    try {
        if(month.trim() === ''){
            return alert('Debes colocar el mes de las ventas')
        }

        tbody.innerHTML = `${loader()}`

        let allSales = await getAllSales()

        let sales_month = allSales.sales.filter(sale =>{
            let date = new Date(sale.date)
            let fulldate = `${date.getFullYear()}-${(date.getMonth()+1)>9?(date.getMonth()+1):`${0}${(date.getMonth()+1)}`}`
            return fulldate == month
        })
    
        let total = sales_month.reduce((acc, t) => acc = acc + t.totalPrice ,0)
    
        showListSales(sales_month)
        
        salesAnalysis = sales_month
        
    } catch (error) {
        console.log(error);
    }
}

// 
const getCodeToSearch = async(e) => {
    const code_id = document.getElementById('input_code').value
    
    try {
        if(code_id.trim() === ''){
            return alert('Debes colocar el codigo de la venta')
        }

        tbody.innerHTML = `${loader()}`

        let allSales = await getAllSales()
    
        let sale_code = allSales.sales.filter(sale => {
            return sale.code == code_id
        })
        
        showListSales(sale_code)
    } catch (error) {
        console.log(error);
    }
}

// 

const btn_xcz = document.getElementById('btn_xcz')

btn_day.addEventListener('click', getDateToSearch)
btn_month.addEventListener('click', getMonthToSearch)
btn_code.addEventListener('click', getCodeToSearch)



typeSearch.addEventListener('change', e =>{
    selectType(typeSearch.value)
})
