
const user_menu = document.querySelector('.user_menu')
let links = document.querySelectorAll('.nav_link') 
let my_container = document.getElementById('container') 

let adminPermition = localStorage.getItem('admin')

document.addEventListener('DOMContentLoaded', e =>{

    if(document.querySelector('.card_table_body')){
        let t = document.querySelector('.card_table_body').offsetHeight - 41;
        tbody.style.height = t+"px";
    }
    if(document.querySelector('.card_table')){
        let t = document.querySelector('.card_table').offsetHeight - 41;
        tbody.style.height = t+"px";
    }

    if(document.querySelector('.home'))links[0].classList.add('selected');
    if(document.querySelector('.product')) links[1].classList.add('selected');
    if(document.querySelector('.sales')) links[2].classList.add('selected');
    if(document.querySelector('.clients')) links[3].classList.add('selected');
    if(document.querySelector('.analysis')) links[4].classList.add('selected');
    if(document.querySelector('.cajas')) links[5].classList.add('selected');
    if(document.querySelector('.users')) links[6].classList.add('selected');
    if(document.querySelector('.config')) links[7].classList.add('selected');

    if(document.querySelector('.product')){
        console.log(adminPermition);
        if(adminPermition === 'false'){
            document.getElementById('createP').setAttribute('disabled', '')
            document.getElementById('btn_update').setAttribute('disabled', '')
        }
    }
})

const _cardCheckPlanStatus = document.querySelector('.checkplanstatus')

async function checkPlanStatus(){
    try {
        let req = await fetch('/data-apis/check-plan-status')
        let res = await req.json()

        if(!res.status){
            _cardCheckPlanStatus.innerHTML = `<div class="${res.color}  p-4 mb-3 d-flex align-items-center" role="alert" style="margin: 0px 20px;">
                <p class="m-0">${res.msg}</p>
            </div>`
        }
    } catch (error) {
        console.log(error);
    }
}

checkPlanStatus()

//permission of admin
async function admin(){
    
    if(adminPermition === 'false'){
        links[3].style.display = 'none'
        // links[3].children[0].classList.add('display_enaible')
        
        links[4].style.display = 'none'
        // links[4].children[0].classList.add('display_enaible')

        links[5].style.display = 'none'
        // links[5].children[0].classList.add('display_enaible')

        links[6].style.display = 'none'
        // links[6].children[0].classList.add('display_enaible')

        links[7].style.display = 'none'
        // links[7].children[0].classList.add('display_enaible')

    }
}

admin()

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
    
    if(e.target.classList.contains('close_emergent_alert')){
        document.querySelector('.card_emergent_alert').innerHTML = ""
    }

})


const noElement = () =>{
    return tbody.innerHTML = '<p class="not_found">No hay elementos aun...</p>'
}

// function getUserIP(onNewIP) {
//     //  onNewIp - your listener function for new IPs
//     //compatibility for firefox and chrome
//     let myPeerConnection =
//         window.RTCPeerConnection ||
//         window.mozRTCPeerConnection ||
//         window.webkitRTCPeerConnection;
//     let pc = new myPeerConnection({
//         iceServers: [],
//     }),
//         noop = function () { },
//         localIPs = {},
//         ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
//         key;

//     function iterateIP(ip) {
//         if (!localIPs[ip]) onNewIP(ip);
//         localIPs[ip] = true;
//     }

//     //create a bogus data channel
//     pc.createDataChannel('');

//     // create offer and set local description
//     pc.createOffer()
//         .then(function (sdp) {
//             sdp.sdp.split('\n').forEach(function (line) {
//                 if (line.indexOf('candidate') < 0) return;
//                 line.match(ipRegex).forEach(iterateIP);
//             });

//             pc.setLocalDescription(sdp, noop, noop);
//         })
//         .catch(function (reason) {
//             // An error occurred, so handle the failure to connect
//         });

//     //listen for candidate events
//     pc.onicecandidate = function (ice) {
//         if (
//             !ice ||
//             !ice.candidate ||
//             !ice.candidate.candidate ||
//             !ice.candidate.candidate.match(ipRegex)
//         )
//             return;
//         ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
//     };
// }

// // Usage

// getUserIP(function (ip) {
//     console.log('Got IP! :' + ip);
// });