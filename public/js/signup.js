
const signUpbtn = document.getElementById('signup')
const inputPass = document.getElementById('inputPass')

let currentValue = true
localStorage.setItem('admin', currentValue)

let count = 0
let countText = ''
inputPass.addEventListener('keypress', e =>{
    count++
})

signUpbtn.addEventListener('submit', e =>{
    countText = inputPass.value
    if(countText.length < 8 ){
        e.preventDefault()
        document.getElementById('security_text').innerText = 'Por motivo de seguridad su contraseña debe tener al menos 8 caracteres.'
    }
})

