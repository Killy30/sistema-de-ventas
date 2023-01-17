const tbody = document.getElementById('tbody')
const countSales = document.getElementById('countSales')
import loader from "./loader.js"
import fecha from './month_es.js'
import data from './data.js'


let allsales;
let paginationLimit = 30;
let currentPage = 0
let cashier_id ;

const getUser = async() =>{
    try {
        return data.getUser()
    } catch (error) {
        console.log(error);
    }
}

const getAllSales = () =>{
    try {
        tbody.innerHTML = `${loader()}`
        return data.getSales()
    } catch (error) {
        console.log(error);
    }
}

const getData = async() =>{
    try {
        let theSales = await getAllSales()
        let sales = theSales.sales
        allsales = sales
        limit_item()
    } catch (error) {
        console.log(error);
    }
}
getData()

const showListSales = async(sales) =>{
    countSales.innerText = `Ventas: ${allsales.length}`

    tbody.innerHTML = ""

    if(sales.length == 0){
        return noElement()
    }
    
    for(let i = sales.length - 1; i >= 0; i--){
        let time = new Date(sales[i].date)
        tbody.innerHTML += `
            <tr>
                <td>${sales[i].code}</td>
                <td>${sales[i].products.length}</td>
                <td> 
                    ${fecha(time.getTime())} ${time.getDate()}/${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}   
                </td>
                <td>${sales[i].totalPrice}</td>
                <td>
                    <a href="/factura/${sales[i]._id}" data-id="${sales[i]._id}" class="btn p-0 text-primary">
                        Ver detalle
                    </a>
                </td>
            </tr>
        `
    }
}

let pages;

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

const limit_item = async() =>{
    let start = paginationLimit * currentPage
    let end = start + paginationLimit
    let piece = allsales.slice(start, end)
    
    pages = Math.ceil(allsales.length / paginationLimit);

    pages--

    if(currentPage == 0){
        disableButton(btn_prev)
    }else{
        enableButton(btn_prev)
    }
    
    if(currentPage == pages){
        disableButton(btn_next)
    }else{
        enableButton(btn_next)
    }

    if(pages < 0){
        disableButton(btn_prev)
        disableButton(btn_next)
    }
    showListSales(piece)
}

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

//
const getDateToSearch = async(e) =>{
    const dayDate = document.getElementById('input_day').value

    try {
        if(dayDate.trim() === ''){
            return alert('Debes colocar el dia de las ventas')
        }

        let allSales = await getAllSales()

        if(cashier_id == undefined || cashier_id == '404'){
            const sales_day = allSales.sales.filter( sale => {
                let date = new Date(sale.date)
                let fulldate = `${date.getFullYear()}-${(date.getMonth()+1) > 9?(date.getMonth()+1):`${0}${(date.getMonth()+1)}`}-${date.getDate() > 9?date.getDate():`${0}${date.getDate()}`}`
                return fulldate ==  dayDate
            })

            allsales = sales_day
            limit_item()
        }else{
            const sales_day = allSales.sales.filter( sale => {
                let date = new Date(sale.date)
                let fulldate = `${date.getFullYear()}-${(date.getMonth()+1) > 9?(date.getMonth()+1):`${0}${(date.getMonth()+1)}`}-${date.getDate() > 9?date.getDate():`${0}${date.getDate()}`}`
                return fulldate ==  dayDate && sale.cashier == cashier_id
            })

            allsales = sales_day
            limit_item()
        }
        
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

        let allSales = await getAllSales()

        if(cashier_id == undefined || cashier_id == '404'){

            let sales_month = allSales.sales.filter(sale =>{
                let date = new Date(sale.date)
                let fulldate = `${date.getFullYear()}-${(date.getMonth()+1)>9?(date.getMonth()+1):`${0}${(date.getMonth()+1)}`}`
                return fulldate == month
            })

            allsales = sales_month
            limit_item()
        }else{
            let sales_month = allSales.sales.filter(sale =>{
                let date = new Date(sale.date)
                let fulldate = `${date.getFullYear()}-${(date.getMonth()+1)>9?(date.getMonth()+1):`${0}${(date.getMonth()+1)}`}`
                return fulldate == month && sale.cashier == cashier_id
            })

            allsales = sales_month
            limit_item()
        }

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

        let allSales = await getAllSales()
    
        let sale_code = allSales.sales.filter(sale => {
            return sale.code == code_id
        })

        allsales = sale_code
        
        limit_item()
    } catch (error) {
        console.log(error);
    }
}

const search_all_sales = async(e)=>{

    try {
        if(cashier_id == undefined || cashier_id == '404'){
            getData()
            limit_item()
        }else{
            let sales = await getAllSales()
            
            let salesOfCashier = sales.sales.filter(sale => sale.cashier == cashier_id)
           
            allsales = salesOfCashier
            limit_item()
        }
    } catch (error) {
        console.log(error);
    }
}

//-----------------------------------------------------------------------------

const btn_prev = document.getElementById('btn_prev')
const btn_next = document.getElementById('btn_next')

const disableButton = (button) => {
    button.classList.add("disabled");
    button.setAttribute("disabled", true);
};
  
const enableButton = (button) => {
    button.classList.remove("disabled");
    button.removeAttribute("disabled");
};



const nextpage = () =>{
    if(currentPage < pages){
        currentPage++
        limit_item()
    }
}

const previouspage = () =>{
    if(currentPage !== 0){
        currentPage--
        limit_item()
    }
}

btn_prev.addEventListener('click', previouspage)
btn_next.addEventListener('click', nextpage)

btn_day.addEventListener('click', getDateToSearch)
btn_month.addEventListener('click', getMonthToSearch)
btn_code.addEventListener('click', getCodeToSearch)
search_all.addEventListener('click', search_all_sales)



typeSearch.addEventListener('change', e =>{
    selectType(typeSearch.value)
})
cashiers_select.addEventListener('change', e =>{
    cashier_id = cashiers_select.value
})

