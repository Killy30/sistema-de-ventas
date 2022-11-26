const tbody = document.getElementById('tbody')
const countSales = document.getElementById('countSales')
import loader from "./loader.js"
import fecha from './month_es.js'


let allsales;
let paginationLimit = 30;
let currentPage = 0


const getAllSales = async() =>{
    let req = await fetch('/get-sales')
    let res = await req.json()
    return res
}

const getData = async() =>{
    try {
        tbody.innerHTML = `${loader()}`
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
                    <a href="/factura/${sales[i]._id}" data-id="${sales[i]._id}" class="btn text-primary">
                        Ver detalle
                    </a>
                </td>
            </tr>
        `
    }
}

let pages;

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
    // console.log(pages);
    showListSales(piece)
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

        allsales = sales_day
        console.log(allsales);
        limit_item()
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
        
        allsales = sales_month
        console.log(allsales);
        limit_item()
        
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

        allsales = sale_code
        console.log(allsales);
        limit_item()
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



typeSearch.addEventListener('change', e =>{
    selectType(typeSearch.value)
})

