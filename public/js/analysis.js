const typeSearch = document.getElementById('typeSearch')
const btn_day = document.getElementById('btn_day')
const btn_month = document.getElementById('btn_month')
const btn_code = document.getElementById('btn_code')

import fecha from './month_es.js'

let salesAnalysis;
let productsAnalysis = []


//request data
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
        // tbody.innerHTML = `${loader()}`
        let allSales = await getAllSales()
        let sales = allSales.sales

        salesAnalysis = sales
        getAnalysis()

    } catch (error) {
        console.log(error);
    }
}
getData()


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


//config and process the data to make the analysis
const getAnalysis = async()=>{
    let all_products = await getAllProducts()

    let total = salesAnalysis.reduce((acc, t) => acc = acc + t.totalPrice ,0)

    let repete_object = {};
    let repete_array = []
    productsAnalysis.splice(0, productsAnalysis.length)

    salesAnalysis.forEach( sale => {
        productsAnalysis.push(...sale.products)
    })

    // groupe  
    productsAnalysis.forEach(product =>{
        repete_object[product] = (repete_object[product] || 0) + 1;
    });
    Object.entries(repete_object).forEach(([key, value]) => {
        let obt = {}
        obt[key] = value
        repete_array.push(obt)
    });
    // console.log(repete_array);
    // console.log(repete_object);

    //get all the info about products that have been sold
    let products_info = [];
    repete_array.forEach(product_obj =>{
        let key = Object.keys(product_obj)
        let value = Object.values(product_obj)

        let theProduct = all_products.my_products.find(product => product._id == key[0])
     
        if(theProduct !== undefined){
            let p = {
                name: theProduct.name,
                code: theProduct.idcode,
                price: theProduct.price,
                soldUnits: value[0],
                soldTotal: (parseInt(value[0]) * theProduct.price).toFixed(2)
            }
            products_info.push(p)
        }
        
    })

    //products + sold and - sold
    let more = products_info.length
    let less = all_products.my_products.length - products_info.length
    let countSales = salesAnalysis.length

    let cardx1Data = { more,less,total,countSales}

    cardsDataViwe(cardx1Data)
    tableProductsView(products_info)
    tableSalesView(salesAnalysis)
}

const numberFormat = (number) =>{
    return new Intl.NumberFormat().format(number)
}

const cardsDataViwe = (data) =>{
    let total_v = numberFormat(data.total)
    document.getElementById('total').innerText = `${total_v}` 
    document.getElementById('ventas').innerText = `${data.countSales}` 
    document.getElementById('more').innerText = `${data.more}` 
    document.getElementById('less').innerText = `${data.less}` 
}


const tableProductsView = (data) =>{
    const tbodyProducts = document.getElementById('tbodyProducts')
    tbodyProducts.innerHTML = ''

    let datas = data.sort((a, b) => b.soldUnits - a.soldUnits)

    datas.forEach(product =>{
        let total = numberFormat(product.soldTotal)
        tbodyProducts.innerHTML += `
            <tr>
                <td class="nxh">${product.name}</td>
                <td>${product.code}</td>
                <td>${product.price}</td>
                <td>${product.soldUnits}</td>
                <th>
                    <p class="gbdx">
                        <span class="material-symbols-outlined">attach_money</span>
                        ${total}
                    </p>
                </th>
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
        console.log(i);
        tbodySales.innerHTML += `
            <tr>
                <td>${sale.code}</td>
                <td>${sale.products.length}</td>
                <td>${time.getDate()}/${time.getMonth()}/${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}</td>
                <th>
                    <p class="gbdx">
                        $${total}
                    </p>
                </th>
            </tr>
            ${(i==29)?'<div class="view_more"><a href="/ventas" >Ver mas</a></div>':''}
        `
    })
}

const grafictAnalysis = async() =>{
    let allSales = await getAllSales()

    let date = new Date()
    let cmt = `${date.getMonth()}/${date.getFullYear()}`
    let cm_v = date.getTime()

    let sm = new Date(date.setMonth(date.getMonth()-1))
    let smt = `${sm.getMonth()}/${sm.getFullYear()}`
    let sm_v = sm.getTime()

    let tm = new Date(date.setMonth(date.getMonth()-1))
    let tmt = `${tm.getMonth()}/${tm.getFullYear()}`
    let tm_v = tm.getTime()

    let fm = new Date(date.setMonth(date.getMonth()-1))
    let fmt = `${fm.getMonth()}/${fm.getFullYear()}`
    let fm_v = fm.getTime()



    let cm_data = allSales.sales.filter(sale =>{
        let t = new Date(sale.date)
        let d = `${t.getMonth()}/${t.getFullYear()}`
        return d == cmt
    })

    let sm_data = allSales.sales.filter(sale =>{
        let t = new Date(sale.date)
        let d = `${t.getMonth()}/${t.getFullYear()}`
        return d == smt
    })

    let tm_data = allSales.sales.filter(sale =>{
        let t = new Date(sale.date)
        let d = `${t.getMonth()}/${t.getFullYear()}`
        return d == tmt
    })

    let fm_data = allSales.sales.filter(sale =>{
        let t = new Date(sale.date)
        let d = `${t.getMonth()}/${t.getFullYear()}`
        return d == fmt
    })

    let t_cm = cm_data.reduce((acc, t) => acc = acc + t.totalPrice ,0)
    let t_sm = sm_data.reduce((acc, t) => acc = acc + t.totalPrice ,0)
    let t_tm = tm_data.reduce((acc, t) => acc = acc + t.totalPrice ,0)
    let t_fm = fm_data.reduce((acc, t) => acc = acc + t.totalPrice ,0)


    let labels_data = [fecha(fm_v),fecha(tm_v),fecha(sm_v),fecha(cm_v)]
    let data_value = [t_fm.toFixed(2), t_tm.toFixed(2),t_sm.toFixed(2),t_cm.toFixed(2)]
    // console.log(fecha(p.setMonth(p.getMonth()-1)));

    getGrafict(labels_data, data_value)
    compare_values(labels_data, data_value)
}
grafictAnalysis()

//grafica
let chart;
const getGrafict = async(labels_data, data_value) =>{
    
    const productsGrafict = document.getElementById('productsGrafict').getContext('2d')
    
    if (chart) {
        chart.destroy();
    }

    // const labels = Utils.months({count: 3});
    const labels = labels_data;
    const data = {
        labels: labels,
        datasets: [{
            label: 'Ingresos de ventas al mes',
            backgroundColor: [
                'rgb(0, 149, 255)',
            ],
            data: data_value,
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
        x = ((current_value - previous_value) / current_value )*100
    }
    //<p class="fs-6" >Meses anterioles</p>
    //<p class="fs-5 mb-0 w-100">Progreso</p>
    grow_box.innerHTML = `
        <div class="card_grow">
            <div class="w-100">
                <p class="fs-5 mb-0 fw-bolder">Progreso</p>
            </div>
            
            <div class="w-100 d-flex justify-content-around">
                <div class="" >
                    <p class="fs-6 mb-0 text-secondary">${months[months.length-3]}</p>
                    <p class="fs-5 mb-0 fw-bolder" >$${numberFormat(previous_value)}</p>
                </div>
                <div class="">
                    <p class="fs-6 mb-0 text-secondary">${months[months.length-2]}</p>
                    <p class="fs-5 mb-0 fw-bolder">$${numberFormat(current_value)}</p>
                </div>
            </div>
            <div class="w-100 d-flex justify-content-center flex-wrap">
                <div class="xp">
                    <div class="svg">
                        <svg width="250px" height="250px">
                            <circle r="100" cx="125" cy="125" class="progress2"></circle>
                            <circle r="100" cx="125" cy="125" class="progress" id="progress"></circle>
                        </svg>
                    </div>
                    <p class="num_progress fs-2 ${x.toString().includes('-') ? 'text-danger':'text_green'}">
                        ${x.toFixed(2)}%
                    </p>
                </div>
            </div>
        </div>
    `
    progressCount(x)
}

const progressCount = (x) =>{
    const progress = document.getElementById('progress')
    let count2 = 630;
    
    let v = count2 - (6.3 * x)
    progress.style.strokeDashoffset = v.toFixed(2)

    if(x.toString().includes('-')){
        progress.style.stroke = 'rgb(255, 61, 61)'
    }
}

// 
const getDateToSearch = async(e) =>{
    const dayDate = document.getElementById('input_day').value

    try {
        if(dayDate.trim() === ''){
            return alert('Debes colocar el dia de las ventas')
        }

        let allSales = await getAllSales()

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

        let allSales = await getAllSales()

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