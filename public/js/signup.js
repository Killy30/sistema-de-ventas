
const signUpbtn = document.getElementById('signup')
const inputPass = document.getElementById('inputPass')

let currentValue = true
localStorage.setItem('admin', currentValue)

let count = 0

inputPass.addEventListener('keypress', e =>{
    count++
})

signUpbtn.addEventListener('submit', e =>{
    if(count < 8 ){
        e.preventDefault()
        alert('Por motivo de seguridad su contraseña debe tener al menos 8 caracteres.')
    }
})

