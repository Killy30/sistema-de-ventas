
import errorMessage from "./errorMSG.js"
// import emergent_alert from "./emergentAlert.js"
import data from './data.js'

const store_name = document.getElementById('store_name')
const store_address = document.getElementById('store_address')
const foot_text = document.getElementById('store_foot_text')
const store_number = document.getElementById('store_number')
const addITBIS = document.getElementById('addITBIS')
const addNameC = document.getElementById('cashierName')
const useITBIS = document.getElementById('useITBIS')
const btn_radios = document.querySelectorAll("input[name='t_fatura']")


const showStoreData = async() =>{
    let user = await data.getUser()
    let store_type = document.querySelector('#store_type')
 
    store_name.value = user.data.storeName ? user.data.storeName : ""
    store_number.value = user.data.storeNumber ? user.data.storeNumber : ""
    store_type.innerText = user.data.typeStore ?  `${user.data.typeStore.toUpperCase()}`: "-"
    store_address.value = user.data.storeAddress ? user.data.storeAddress : ""
    foot_text.value = user.data.footText ? user.data.footText : ""
}
showStoreData()

let active_checkbox = async()=>{
    let user = await data.getUser()
    let _user = user.data

    _user.system_control.acceptITBIS ? addITBIS.checked = true : addITBIS.checked = false
    _user.system_control.add_N_C_receipt ? addNameC.checked = true : addNameC.checked = false
    _user.system_control.sale_with_ITBIS ? useITBIS.checked = true : useITBIS.checked = false

    if(_user.system_control.typePrint === 'ticket') btn_radios[0].checked = true
    if(_user.system_control.typePrint === 'digital') btn_radios[1].checked = true
}
active_checkbox()

const postDataStore = async(_data) =>{
    try {
        let req = await fetch('/store-info', {
            method: 'POST',
            body: JSON.stringify(_data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        let res = await req.json()
        
        showStoreData()
        let msg = 'Se a completado exitosamente la actualizacion de los datos...'
        errorMessage(msg,'alert alert-success')
        
    } catch (error) {
        console.log(error);
    }
}

const controlAll = async(x) =>{
    const req = await fetch('/accept-itbis', {
        method: 'POST',
        body: JSON.stringify(x),
        headers:{
            'Content-Type': 'application/json'
        }
    })
    const res = await req.json()
}

let storeN = () =>{
    if(store_name.value.trim() == ''){
        let msg = 'Debes colocar un nombre a tu negocio...'
        errorMessage(msg, 'alert alert-danger')
        return false
    }

    let _data = {name: store_name.value}
    postDataStore(_data)
}
let storeAds = () =>{
    if(store_address.value.trim() == '') return false
    let _data = {address: store_address.value}
    postDataStore(_data)
}
let storeTel = () =>{
    if(store_number.value.trim() == '') return false
    let _data = {storeNumber: store_number.value}
    postDataStore(_data)
}
let storeFtx = () =>{
    if(foot_text.value.trim() == '') return false
    let _data = {footText: foot_text.value}
    postDataStore(_data)
}
let type_print = (e) =>{
    let _data  = {typePrint: e.target.value}
    postDataStore(_data)
}


document.getElementById('btn_store_nam').addEventListener('click', storeN)
document.getElementById('btn_store_number').addEventListener('click', storeTel)
document.getElementById('btn_store_ads').addEventListener('click', storeAds)
document.getElementById('btn_store_ftx').addEventListener('click', storeFtx)

addITBIS.addEventListener('change', e =>{
    controlAll({value:e.currentTarget.checked, x:'1'});
})
addNameC.addEventListener('change', e =>{
    controlAll({value:e.currentTarget.checked, x:'2'});
})
useITBIS.addEventListener('change', e =>{
    controlAll({value:e.currentTarget.checked, x:'3'});
})

btn_radios.forEach(btn =>{
    btn.addEventListener('change', type_print)
})
