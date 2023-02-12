
const user_menu = document.querySelector('.user_menu')
let links = document.querySelectorAll('.nav_link') 

function admin(){
    let x = localStorage.getItem('admin')

    if(x === 'false'){
        links[3].classList.add('display_enaible')
        links[4].classList.add('display_enaible')
    }
}
admin()

document.addEventListener('DOMContentLoaded', e=>{

    if(document.querySelector('.card_table_body')){
        let t = document.querySelector('.card_table_body').offsetHeight - 41
        tbody.style.height = t+"px"
    }

    if(document.querySelector('.home')) links[0].classList.add('selected')
    if(document.querySelector('.product')) links[1].classList.add('selected')
    if(document.querySelector('.sales')) links[2].classList.add('selected')
    if(document.querySelector('.analysis')) links[3].classList.add('selected')
    if(document.querySelector('.config')) links[4].classList.add('selected')
})

document.addEventListener('click', e =>{
    if(e.target.classList.contains('open_menu_mobile')){
        user_menu.classList.toggle('toggloMenu')
    }

    if(e.target.classList.contains('close_menu_mobile')){
        user_menu.classList.remove('toggloMenu')
    }
})

const noElement = () =>{
    return tbody.innerHTML = '<p class="not_found">No hay elementos aun...</p>'
}


