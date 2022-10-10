
const errorMessage = (err,color) =>{
    const cardError = document.getElementById('msg_err')
    cardError.innerHTML = `<div class="${color} p-2 mb-3" role="alert"> ${err}</div>`
    setTimeout(() =>{
        cardError.innerHTML = ''
    },5000)
} 

export default errorMessage