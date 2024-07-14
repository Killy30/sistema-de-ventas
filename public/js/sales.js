const tbody = document.getElementById('tbody')
const countElement = document.getElementById('countSales')
const btn_prev = document.getElementById('btn_prev')
const btn_next = document.getElementById('btn_next')

import loader from "./loader.js"
import fecha from './month_es.js'
import data from './data.js'
import handleElements from './handleElements.js'
import { elementsPagination } from "./elementsPagination.js"

let pageIndex = 1
let salesAllData;
let cashier_id ;

const getUser = async() =>{
    try {
        return data.getUser()
    } catch (error) {
        console.log(error);
    }
}

async function getAllsalesPagination(){
    try {
        tbody.innerHTML = `${loader()}`
        const salesData = await data.getsalesPagination(pageIndex)
        salesAllData = salesData
        showListSales(salesData)
    } catch (error) {
        console.log(error);
    }
}
getAllsalesPagination()

async function getDateSalesPagination(textDate, searchType){
    try {
        tbody.innerHTML = `${loader()}`
        let msg_err = `Debes colocar el dia de las ventas`
        if(textDate.trim() === '') return alert(msg_err)
        console.log(textDate);
        let dataDate = { cashier_id, textDate, searchType, pageIndex }

        const salesData = await data.getsalesDatePagination(JSON.stringify(dataDate))
        salesAllData = salesData
        showListSales(salesData)
    } catch (error) {
        console.log(error);
    }
}

const showListSales = async(salesData) =>{
    let sales = salesData.outputArray
     console.log(sales);
    elementsPagination({datas: salesData, countElement, handleElements, btn_prev, btn_next})

    tbody.innerHTML = ""
    if(sales.length == 0){
        return noElement()
    }

    sales.forEach(sale =>{
        let time = new Date(sale.date)
        tbody.innerHTML += `
            <tr>
                <td>${sale.code}</td>
                <td>${sale.products.length}</td>
                <td> 
                    ${time.getMonth() + 1}/${time.getDate()}/${time.getFullYear()} - ${time.getHours()}:${time.getMinutes()}   
                </td>
                <td>$${sale.totalPrice}</td>
                <td>
                    <a href="javascript:window.open('/factura/${sales._id}', '','width=1000,height=700,left=100,top=100,toolbar=yes');void 0" 
                    data-id="${sales._id}" class="btn p-0 text-primary">
                        Ver detalle
                    </a>
                </td>
            </tr>
        `
    })
    
    for(let i = sales.length - 1; i >= 0; i--){
       
    }
}

const showListCashiers_select = async() =>{
    const user = await getUser()

    let cashiers = user.data.cashiers

    cashiers_select.innerHTML = '<option value="404">Cajero/a</option>'
    cashiers.forEach((cashier, i) =>{
        if(cashier.status){
            cashiers_select.innerHTML += `
            <option data-act="${cashier.status}"  id="selectOption" value="${cashier._id}">
                ${cashier.name} ${cashier.lastName}
            </option>`
        }
    })
} 
showListCashiers_select()

const typeSearch = document.getElementById('typeSearch')
const cashiers_select = document.getElementById('cashiers')
const search_all = document.getElementById('search_all')

const btn_day = document.getElementById('btn_day')
const btn_month = document.getElementById('btn_month')
const btn_code = document.getElementById('btn_code')

const selectType = (data)=>{
    if(data === 'day'){
        document.getElementById('day').style.display = 'flex'
        document.getElementById('month').style.display = 'none'
        document.getElementById('code').style.display = 'none'
        search_all.style.display = 'none'
    }else if(data === 'month'){
        document.getElementById('day').style.display = 'none'
        document.getElementById('month').style.display = 'flex'
        document.getElementById('code').style.display = 'none'
        search_all.style.display = 'none'
    }else if(data === 'all'){
        document.getElementById('day').style.display = 'none'
        document.getElementById('month').style.display = 'none'
        document.getElementById('code').style.display = 'none'
        search_all.style.display = 'block'
    }else if(data === 'code'){
        document.getElementById('day').style.display = 'none'
        document.getElementById('month').style.display = 'none'
        document.getElementById('code').style.display = 'flex'
        search_all.style.display = 'none'
    }
}
selectType(typeSearch.value)

//-----------------------------------------------------------------------------


btn_prev.addEventListener('click', (e) =>{
    pageIndex--
    // showListSales(salesAllData)
    getAllsalesPagination()
})
btn_next.addEventListener('click', (e) => {
    pageIndex++
    // showListSales(salesAllData)
    getAllsalesPagination()
})

btn_day.addEventListener('click', ()=>{
    const dayDate = document.getElementById('input_day').value
    getDateSalesPagination(dayDate, 'day')
})
btn_month.addEventListener('click', ()=>{
    const month = document.getElementById('input_month').value
    getDateSalesPagination(month, 'month')
})

btn_code.addEventListener('click', ()=>{
    const code_id = document.getElementById('input_code').value
    getDateSalesPagination(code_id, 'code')
})
search_all.addEventListener('click', ()=>{
    if(cashier_id == undefined || cashier_id == '404'){
        getAllsalesPagination()
    }else{
        getDateSalesPagination('all','all')
    }
})

typeSearch.addEventListener('change', e =>{
    selectType(typeSearch.value)
})
cashiers_select.addEventListener('change', e =>{
    cashier_id = cashiers_select.value
})

