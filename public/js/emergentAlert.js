
const emergent_alert = ({msg, color}) =>{
    const alert_card = document.querySelector('.card_emergent_alert')
    alert_card.innerHTML = `<div class="${color} p-2 mb-3 d-flex align-items-center" role="alert">
        <p class="m-0">${msg}</p>
        <span class="material-symbols-outlined close_emergent_alert">close</span>
    </div>`
    setTimeout(() =>{
        alert_card.innerHTML = ''
    },40000)
} 


export default emergent_alert