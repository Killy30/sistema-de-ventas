


function count_month(date, num_month){
    let month = date.getMonth()
    let year = date.getFullYear()
    let ret_month, ret_year;
    let x = (month + 1) + num_month;

    if(x <= 12){
        ret_month = x
        ret_year = year
    }else{
        let a = 12 - (month + 1);
        let b = num_month - a;
        ret_year = year + 1;

        if(b % 12 == 0){
            let y = b / 12;
            let f = b - y;
            let t = f / 12;
            ret_month = y;
            let j = f % 12;
            ret_month = ret_month + j;
            ret_year = Math.floor(ret_year + t);
        }else{
            let y = b / 12;
            let j = b % 12;
            ret_month = j;
            ret_year = Math.floor(ret_year + y);
        }
    }
    return {month: ret_month, year: ret_year}
}

function control_months(datex, num_month_op, extra_day_op){
    let extra_day = extra_day_op || 0;
    let num_month = num_month_op || 1
    let date = new Date(datex)
    let day = date.getDate();

    let {month, year } = count_month(date, num_month)

    let month_date = {1:31, 2:28, 3:31, 4:30, 5:31, 6:30, 7:31, 8:31, 9:30, 10:31, 11:30, 12:31};
    let month_value = Object.values(month_date)[month - 1]
    ret_day = (day <= month_value) ? day : month_value
    let total_days = ret_day + extra_day;

    if(total_days <= month_value){
        ret_day = total_days;
    }else{
        let t = total_days - month_value;
        ret_day = t;
        if(month < 12){
            month = month + 1
        }else{
            month = 1;
            year = year + 1
        }
    }
    return new Date(`${year}-${month}-${ret_day}`)
}


module.exports = control_months