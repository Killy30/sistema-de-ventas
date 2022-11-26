
const btn_prev = document.getElementById('btn_prev')
const btn_next = document.getElementById('btn_next')

const disableButton = (button) => {
    button.classList.add("disabled");
    button.setAttribute("disabled", true);
};
  
const enableButton = (button) => {
    button.classList.remove("disabled");
    button.removeAttribute("disabled");
};

let pages;

const validate = (list) =>{
   pages = Math.ceil(list.length / paginationLimit);

   pages--
   if(currentPage == pages){
       disableButton(btn_next)
   }
    
   if(currentPage == 0){
        disableButton(btn_prev)
   }
}

const nextpage = () =>{
    if(currentPage < pages){
        currentPage++
        console.log(allsales);
    }
}

const previouspage = () =>{
    if(currentPage !== 0){
        currentPage--
        
    }
}

btn_prev.addEventListener('click', previouspage)
btn_next.addEventListener('click', nextpage)

