
const emergent_alert = ({msg, color}) =>{
    console.log(msg);
    const alert_card = document.querySelector('.card_emergent_alert')
    alert_card.innerHTML = `<div class="${color} p-2 mb-3" role="alert"> ${msg}</div>`
    setTimeout(() =>{
        alert_card.innerHTML = ''
    },15000)
} 


export default emergent_alert