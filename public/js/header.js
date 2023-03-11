
const user_menu = document.querySelector('.user_menu')
let links = document.querySelectorAll('.nav_link') 
let my_container = document.getElementById('container') 

//permission of admin
function admin(){
    let x = localStorage.getItem('admin')

    if(x === 'false'){
        links[3].classList.add('display_enaible')
        links[3].children[0].classList.add('display_enaible')

        links[4].classList.add('display_enaible')
        links[4].children[0].classList.add('display_enaible')
    }
}
admin()

document.addEventListener('DOMContentLoaded', e=>{

    if(document.querySelector('.card_table_body')){
        let t = document.querySelector('.card_table_body').offsetHeight - 41;
        tbody.style.height = t+"px";
    }

    if(document.querySelector('.home'))links[0].classList.add('selected');
    if(document.querySelector('.product')) links[1].classList.add('selected'); 
    if(document.querySelector('.sales')) links[2].classList.add('selected');
    if(document.querySelector('.analysis')) links[3].classList.add('selected');
    if(document.querySelector('.config')) links[4].classList.add('selected');
})

const menu = () =>{
    document.querySelector('.my_container').classList.toggle('container_all_scr')
}

document.addEventListener('click', e =>{
    //desktop, large screen 
    if(e.target.classList.contains('open_menu_desktop')){
        user_menu.classList.toggle('toggleMenuDesktop')
        menu()
    }
    

    //mobile
    if(e.target.classList.contains('open_menu_mobile')){
        user_menu.classList.toggle('toggleMenu')
    }
    if(e.target.classList.contains('close_menu_mobile')){
        user_menu.classList.remove('toggleMenu')
    }
})

const noElement = () =>{
    return tbody.innerHTML = '<p class="not_found">No hay elementos aun...</p>'
}

