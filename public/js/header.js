
const navbar_nav = document.querySelector('.navbar_nav')

document.addEventListener('DOMContentLoaded', e=>{
    let t = document.querySelector('.card_table_body').offsetHeight - 41
    tbody.style.height = t+"px"
})

document.addEventListener('click', e =>{
    if(e.target.classList.contains('open_m')){
        navbar_nav.classList.toggle('open_menu')
    }else{
        navbar_nav.classList.remove('open_menu')
    }

    if(e.target.classList.contains('open_menu_mobile')){
        navbar_nav.style.left = '0px'
    }

    if(e.target.classList.contains('close_menu_mobile')){
        navbar_nav.style.left = '-100%'
    }
})

const noElement = () =>{
    return tbody.innerHTML = '<p class="not_found">No hay elementos aun...</p>'
}


