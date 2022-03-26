const tbody = document.getElementById('tbody')
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
const loader = () =>{
    return `<div class="loader">Loading...</div>`
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
        return tbody.innerHTML = '<p class="not_found">Elementos no encontrados...</p>'
    }
    
    for(var i = sales.length - 1; i >= 0; i--){
        let time = new Date(sales[i].date)
        tbody.innerHTML += `
            <tr>
                <td>${i+1}</td>
                <td>${sales[i].code}</td>
                <td>${sales[i].products.length}</td>
                <td class="d-flex">
                    <p style="margin-right: 5px;">
                        ${fecha(time.getTime())} ${time.getDate()}/${time.getFullYear()}
                    </p> 
                    <p>
                        ${time.getHours()}:${time.getMinutes()}
                    </p>
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

    var repetidos = {};
    var repete = []

    productsAnalysis.forEach(product =>{
        repetidos[product] = (repetidos[product] || 0) + 1;
    });

    Object.entries(repetidos).forEach(([key, value]) => {
        let obt = {}
        obt[key] = value
        repete.push(obt)
    });

    let maxValue = repete.sort((a, b) => Object.values(b) - Object.values(a))

    let data = await getAllProducts()

    if(productsAnalysis.length > 1){
        let maxProduct1 = data.products.find(product => product._id == Object.keys(maxValue[0]) || 0)
        let maxProduct2 = data.products.find(product => product._id == Object.keys(maxValue[1]) || 0)

        let objProducts = {
            maxProduct1: maxProduct1 || 'No product', 
            maxProduct2: maxProduct2 || 'No product',
            maxValue1: Object.values(maxValue[0]) || 0, 
            maxValue2: Object.values(maxValue[1]) || 0, 
            total: total || 0
        }
        getGrafict(objProducts)


    }else if(productsAnalysis.length == 1){
        let maxProduct1 = data.products.find(product => product._id == Object.keys(maxValue[0]))

        let objProducts = {
            maxProduct1: maxProduct1 || 'No product', 
            maxProduct2: 'No product',
            maxValue1: Object.values(maxValue[0]) || 0, 
            maxValue2: 0, 
            total: total || 0
        }
        getGrafict(objProducts)

    }else if(productsAnalysis.length == 0){

        let objProducts = {
            maxProduct1: 'No product', 
            maxProduct2: 'No product',
            maxValue1: 0, 
            maxValue2: 0, 
            total: 0
        }
        getGrafict(objProducts)

    }
}

//grafica
let chart;
const getGrafict = async(objProducts) =>{
    const allSales = await getAllSales()
    const productsGrafict = document.getElementById('productsGrafict').getContext('2d')
    
    if (chart) {
        chart.destroy();
    }
    const totalBox = document.getElementById('totalBox')

    totalBox.innerText = objProducts.total.toFixed(2)

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



function fecha(date){
    var d = new Date(date);

    var month = new Array();
    month[0] = "Enero";
    month[1] = "Febrero";
    month[2] = "Marzo";
    month[3] = "Abril";
    month[4] = "Mayo";
    month[5] = "Junio";
    month[6] = "Julio";
    month[7] = "Agosto";
    month[8] = "Septiembre";
    month[9] = "Octubre";
    month[10] = "Noviembre";
    month[11] = "Diciembre";
    return month[d.getMonth()];
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

btn_xcz.addEventListener('click', e => {

    var array = [4,1,2,1,1,3,45,13,42,52,45,25,13,40,13,2,4,4,4,4];

    var repetidos = {};

    array.forEach(function(numero){
        repetidos[numero] = (repetidos[numero] || 0) + 1;
        // console.log(repetidos[numero] = (repetidos[numero] || 0) + 1);
    });

    getAnalysis()
})

typeSearch.addEventListener('change', e =>{
    selectType(typeSearch.value)
})
