
const adminbtn = document.getElementById('adminCheck')

let currentValue = false

localStorage.setItem('admin', currentValue)

adminbtn.addEventListener('change', e =>{
    let x = e.target.checked
    localStorage.setItem('admin', x)
})