
const alert_message = ({msg, color, index}) =>{
    let i = index || 0

    const cardError = document.querySelectorAll('.card_msg_alert')
    cardError[i].innerHTML = `<div class="${color} p-2 mb-3" role="alert"> ${msg}</div>`
    setTimeout(() =>{
        cardError[i].innerHTML = ''
    },6000)
} 


export default alert_message