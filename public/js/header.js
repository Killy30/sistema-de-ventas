
const navbar_nav = document.querySelector('.navbar_nav')

document.addEventListener('DOMContentLoaded', e=>{
    let h = innerHeight - 65;
    document.querySelector('#container').style.height = h+'px'

    let t = document.querySelector('.card_table_body').offsetHeight - 41
    tbody.style.height = t+"px"
})

document.addEventListener('click', e =>{
    if(e.target.classList.contains('open_m')){
        navbar_nav.classList.toggle('close_menu')
    }else{
        navbar_nav.classList.remove('close_menu')
    }
})

const noElement = () =>{
    return tbody.innerHTML = '<p class="not_found">No hay elementos aun...</p>'
}


