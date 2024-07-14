
const handleElements = {}

handleElements.disableElement = (button) => {
    if(button.href != undefined){
        button.classList.add("inactive")
    }else{
        button.classList.add("disabled");
        button.setAttribute("disabled", true);
    }
};
  
handleElements.enableElement = (button) =>{
    if(button.href != undefined){
        button.classList.remove("inactive")
    }else{
        button.classList.remove("disabled");
        button.removeAttribute("disabled");
    };
}

export default handleElements