// import {disableElement, enableElement} from './btnOperation'

export function elementsPagination(obj){

    obj.countElement.innerText = `${obj.datas.start_index} - ${obj.datas.end_index} de ${obj.datas.totalDataLength}`;

    obj.datas.btn_previous == true 
        ? obj.handleElements.enableElement(obj.btn_prev) 
        : obj.handleElements.disableElement(obj.btn_prev); 
    obj.datas.btn_next == true 
        ? obj.handleElements.enableElement(obj.btn_next) 
        : obj.handleElements.disableElement(obj.btn_next);
}