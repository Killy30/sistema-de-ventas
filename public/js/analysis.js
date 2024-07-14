const typeSearch = document.getElementById('typeSearch')
const btn_day = document.getElementById('btn_day')
const btn_month = document.getElementById('btn_month')
const btn_code = document.getElementById('btn_code')

import fecha from './month_es.js'
import data from './data.js'





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
        // getData()
    }else if(data === 'code'){
        document.getElementById('day').style.display = 'none'
        document.getElementById('month').style.display = 'none'
        document.getElementById('code').style.display = 'flex'
    }
}
// selectType(typeSearch.value)


//config and process the data to make the analysis
async function getAnalysis(){
    let all_products = await data.getProducts()
    let all_sales = await data.getSales()
  
    let total = all_sales.sales.reduce((acc, t) => acc = acc + t.totalPrice ,0)

    let repete_object = {};
    let repete_array = []
    let productsAnalysis = []
   
    // productsAnalysis.splice(0, productsAnalysis.length)

    all_sales.sales.forEach( sale => {
        productsAnalysis.push(...sale.products)
    })
    
    // groupe  
    productsAnalysis.forEach(product =>{
        repete_object[product] = (repete_object[product] || 0) + 1;
    });
    // console.log(productsAnalysis);
    Object.entries(repete_object).forEach(([key, value]) => {
        let obt = {}
        obt[key] = value
        repete_array.push(obt)
    });

    //get all the info about products that have been sold
    let products_info = [];
    repete_array.forEach(product_obj =>{
        let key = Object.keys(product_obj)
        let value = Object.values(product_obj)

        let theProduct = all_products.my_products.find(product => product._id == key[0])
        let productSold = all_sales.sales.filter(sale => {
            let xc = sale.productsSold.some(pro => pro.productCode == theProduct.idcode)
            return xc == true
        })

        let prod_prices = []

        productSold.forEach(item =>{
            item.productsSold.forEach(p =>{
                if(p.productCode == theProduct.idcode){
                    prod_prices.push({buy_price: p.buy_price, price: p.price})
                }
            })
        })
     
        if(theProduct !== undefined){
            let p = {
                name: theProduct.name,
                code: theProduct.idcode,
                price: theProduct.price,
                buy_price: theProduct.buy_price,
                soldUnits: prod_prices.length,
                soldTotal: prod_prices.reduce((acc, t) => acc = acc + t.price ,0),
                totalSpends: prod_prices.reduce((acc, t) => acc = acc + t.buy_price, 0)
            }
            products_info.push(p)
        }
        
    })

    //the spends, 
    let total_spends = products_info.reduce((acc, total) => acc = acc + total.totalSpends, 0) 
    let total_sold = products_info.reduce((acc, total) => acc = acc + total.soldTotal, 0) 
    let total_earnings = total_sold - total_spends;

    let more = products_info.length
    let less = all_products.my_products.length - products_info.length
    let countSales = all_sales.sales.length

    let cardx1Data = {total, countSales, total_spends, total_earnings, more, less}

    console.log(products_info);
    cardsDataViwe(cardx1Data)
    tableProductsView(products_info)
    tableSalesView(all_sales.sales)
}
getAnalysis()

const numberFormat = (number) =>{
    return new Intl.NumberFormat().format(number)
}

const cardsDataViwe = (data) =>{
    let total_v = numberFormat(data.total)
    document.getElementById('total').innerText = `$${total_v}` 
    document.getElementById('ventas').innerText = `${data.countSales}` 
    document.getElementById('spend').innerText = `$${data.total_spends}` 
    document.getElementById('earnings').innerText = `$${data.total_earnings}` 
    document.getElementById('more').innerText = `${data.more}` 
    document.getElementById('less').innerText = `${data.less}` 
}

const cardValance = async() =>{
    let v_date = document.getElementById('vdate')
    let v_value = document.getElementById('vvalue')

    let sales = await data.getSales()
    let today_sales_total = sales.sales_today.reduce((acc, p) => acc = acc + p.totalPrice ,0)

    let date = new Date()
    v_date.innerHTML = `<p>${fecha(date.getTime())} ${date.getDate()}/${date.getFullYear()}</p>` 
    v_value.innerText = `$${today_sales_total.toFixed(2)}`
}
cardValance()


const tableProductsView = (data) =>{
    const tbodyProducts = document.getElementById('tbodyProducts')
    tbodyProducts.innerHTML = ''

    let datas = data.sort((a, b) => b.soldUnits - a.soldUnits)
    
    datas.forEach(product =>{
        let earnings = product.soldTotal - product.totalSpends
        let total = numberFormat(product.soldTotal)
        tbodyProducts.innerHTML += `
            <tr>
                <td class="nxh" title="${product.name}">
                    ${product.name}
                </td>
                <td>${product.code}</td>
                <td>${product.price}</td>
                <td>${product.soldUnits}</td>
                <td>$${product.totalSpends}</td>
                <td>$${earnings}</td>
                <th class="gbdx text_color_">$${total}</th>
            </tr>
        `
    })
}

const tableSalesView = (data) =>{
    const tbodySales = document.getElementById('tbodySales')

    tbodySales.innerHTML = ''
    let datas = data.slice(0,30).sort((a, b) => b.totalPrice - a.totalPrice)
    
    datas.forEach((sale, i) =>{
        let time = new Date(sale.date)
        let total = numberFormat(sale.totalPrice)
        tbodySales.innerHTML += `
            <tr>
                <td>${sale.code}</td>
                <td>${sale.products.length}</td>
                <td>${time.getDate()}/${time.getMonth()}/${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}</td>
                <td class="gbdx text_color_">$${total}</td>
            </tr>
            ${(i==29)?'<div class="view_more"><a href="/ventas" >Ver mas</a></div>':''}
        `
    })
}

async function grafictAnalysis(){

    const sales = await data.getSales();
    const allSales = sales.sales;
    const num_months = 11
    const date = new Date()
    const data_object = {}

    let n = 0;
    while (n <= num_months) {
        data_object[n] = 0
        n++
    };

    for(let i = 0; i < allSales.length; i++){
        let time = new Date(allSales[i].date)
        let month = time.getMonth()
        let year = date.getFullYear()
        
        if(time.getFullYear() == year){
            
            for(let [key, value] of Object.entries(data_object)){
                if(key == month){
                    data_object[key] = parseInt(value) + allSales[i].totalPrice
                }
            };
        }
    }
    console.log(data_object);

    getGrafict(data_object)
}
grafictAnalysis()

//grafica
let chart;
const getGrafict = async(data_object) =>{

    const labels_array = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
    const productsGrafict = document.getElementById('productsGrafict').getContext('2d')
    
    if (chart) {
        chart.destroy();
    }

    const labels = labels_array;
    const data = {
        labels: labels,
        datasets: [{
            label: 'Ingresos de ventas al mes',
            backgroundColor: [
                'rgb(0, 149, 255)',
            ],
            data: Object.values(data_object),
        }]
    };
    
    const config = {
        type: 'bar',
        data: data,
        options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
        },
    };

    chart = new Chart(productsGrafict, config);
}

const compare_values = (months, values) =>{

    const grow_box = document.querySelector('.grow')

    let previous_value = values[values.length-3];
    let current_value = values[values.length-2];

    let x = 0.00

    if(current_value != 0 && previous_value != 0){
        if(current_value < previous_value){
            x = ((current_value - previous_value) / current_value )*100
        }else{
            let t = ((previous_value - current_value) / previous_value )*100
            x = -t
        }
    }
   
    grow_box.innerHTML = `
        <div class="card_grow">
            <div class="w-100">
                <p class="fs-5 mb-0 ">Progreso</p>
            </div>
            <div class="w-100 d-flex justify-content-between">
                <div class="d-flex align-items-center">
                    <div>
                        <div class="mb-5" >
                            <p class="fs-6 mb-0">${months[months.length-3]}</p>
                            <p class="fs-5 mb-0 " >$${numberFormat(previous_value)}</p>
                        </div>
                        <div class="mb-5">
                            <p class="fs-6 mb-0">${months[months.length-2]}</p>
                            <p class="fs-5 mb-0">$${numberFormat(current_value)}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="xp">
                        <div class="svg">
                            <svg width="300px" height="300px">
                                <circle class="progress2"></circle>
                                <circle class="progress" id="progress"></circle>
                            </svg>
                        </div>
                        <p class="num_progress fs-2 ${x.toString().includes('-') ? 'text-danger':'text_color_'}">
                            ${x.toFixed(2)}%
                        </p>
                    </div>
                </div>
            </div>
            <div class="w-100">
                <p class="m-0">${
                    (x!==0)?
                    `Tus ventas han ${(x<0)?'desincrementado':'incrementado'} un ${x.toFixed(2)}% para el mes de ${months[months.length-2]}.`
                    :''
                }</p>
            </div>
        </div>
    `
    progressCount(x)
}

const progressCount = (x) =>{
    const progress = document.getElementById('progress')
    let count2 = 819;

    let j = parseInt((x < 0) ? x.toString().slice(1, x.length) : x);

    let a = (count2 - (8.19 * j))
    a = (a < 0) ? 0 : a;

    if(x.toString().includes('-')){
        progress.style.strokeDashoffset = -a
        progress.style.stroke = 'rgb(205, 7, 7)'
    }else{
        progress.style.strokeDashoffset = a
        progress.style.stroke = 'rgb(0, 149, 255)'
    }
}

// 
const getDateToSearch = async(e) =>{
    const dayDate = document.getElementById('input_day').value

    try {
        if(dayDate.trim() === ''){
            return alert('Debes colocar el dia de las ventas')
        }

        let allSales = await data.getSales()

        const sales_day = allSales.sales.filter( sale => {
            let date = new Date(sale.date)
            let fulldate = `${date.getFullYear()}-${(date.getMonth()+1) > 9?(date.getMonth()+1):`${0}${(date.getMonth()+1)}`}-${date.getDate() > 9?date.getDate():`${0}${date.getDate()}`}`
            return fulldate ==  dayDate
        })

        salesAnalysis = sales_day
        getAnalysis()  
    } catch (error) {
        console.log(error);
    }
}

const getMonthToSearch = async(e) =>{
    const month = document.getElementById('input_month').value

    try {
        if(month.trim() === ''){
            return alert('Debes colocar el mes de las ventas')
        }

        let allSales = await data.getSales() 

        let sales_month = allSales.sales.filter(sale =>{
            let date = new Date(sale.date)
            let fulldate = `${date.getFullYear()}-${(date.getMonth()+1)>9?(date.getMonth()+1):`${0}${(date.getMonth()+1)}`}`
            return fulldate == month
        })
        
        salesAnalysis = sales_month
        getAnalysis()
    } catch (error) {
        console.log(error);
    }
}


btn_day.addEventListener('click', getDateToSearch)
btn_month.addEventListener('click', getMonthToSearch)

typeSearch.addEventListener('change', e =>{
    selectType(typeSearch.value)
})