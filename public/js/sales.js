const tbody = document.getElementById('tbody')


const getAllSales = async() =>{
    let req = await fetch('/get-sales')
    let res = await req.json()
    return res
}

const showListSales = async() =>{

    let allSales = await getAllSales()
    let sales = allSales.sales

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
                <td>
                    <a href="/factura/${sales[i]._id}" data-id="${sales[i]._id}" class="btn btn-primary">
                        Ver detalle
                    </a>
                </td>
            </tr>
        `
    }
}
showListSales()



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

const selectType = (data)=>{
    if(data === 'day'){
        document.getElementById('day').style.display = 'flex'
        document.getElementById('week').style.display = 'none'
        document.getElementById('month').style.display = 'none'
    }else if(data === 'week'){
        document.getElementById('week').style.display = 'flex'
        document.getElementById('day').style.display = 'none'
        document.getElementById('month').style.display = 'none'
    }else if(data === 'month'){
        document.getElementById('week').style.display = 'none'
        document.getElementById('day').style.display = 'none'
        document.getElementById('month').style.display = 'flex'
    }
}
selectType(typeSearch.value)



const getDateToSearch = async(e) =>{
    const dayDate = document.getElementById('input_day').value

    let allSales = await getAllSales()

    const sales_day = allSales.sales.filter( sale => {
        let day = new Date(dayDate)
        let date = new Date(sale.date)
        let fullDay = `${day.getFullYear()}-${day.getMonth()+1}-${((day.getDate()+1)>31)?1:(day.getDate()+1)}`
        let fulldate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
        console.log(fulldate);
        return fulldate == fullDay 
    })

    let day = new Date(dayDate)
    let f = (day.getDate()+1)
    if(f.length <= 1){
        f='0'+f
    }
    // console.log(day.getTime());
    // console.log(sales_day);
    // console.log(day.getFullYear(), day.getMonth()+1, ((day.getDate()+1)>31)?1:(day.getDate()+1));
}
const getWeekToSearch = (e) =>{
    const week = document.getElementById('input_week').value

    // console.log( week);
}

const getMonthToSearch = async(e) =>{
    const month = document.getElementById('input_month').value
    let allSales = await getAllSales()

    let sales_month = allSales.sales.filter(sale =>{
        let date = new Date(sale.date)
        let fulldate = `${date.getFullYear()}-${(date.getMonth()+1)>9?(date.getMonth()+1):`${0}${(date.getMonth()+1)}`}`
        return fulldate == month
    })
    // console.log( sales_month);
}


btn_day.addEventListener('click', getDateToSearch)
btn_week.addEventListener('click', getWeekToSearch)
btn_month.addEventListener('click', getMonthToSearch)

typeSearch.addEventListener('change', e =>{
    selectType(typeSearch.value)
})