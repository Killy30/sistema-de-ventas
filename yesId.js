/*

with this method you will be able to generate a new id where you can control the length of the ids
you can put as a parameter the length you want for the ids
----------------------------------------------------------------------------------------------------------------
for example 
yesId(6) ---> 251428
yesId(19) --> 2914482841698271485
yesId() ----> 1529144828416982715148485
----------------------------------------------------------------------------------------------------------------
NOTE: the max length that the parameter accepts is 25 and the min length is 5, if you don't put any parameter, the default length will be 25

*/ 


//generar una camtidad x de numeros aleatorio
function getRandomNumbers() {
  return Math.random() * 100000000;
}

//quitar el punto para que devuelve una camtidad completa de numeros
function removePointInNumbers() {
  let numId = getRandomNumbers().toString().split('.').join('');
  return parseInt(numId);
}

//convertir esos numeros en un array de numeros
function createArrayNumbers(num) {
  let time = new Date().getTime();
  return [...`${num}${time}`];
}

//generar la longitud que deceo para id
function getLengthIds(n) {
  let arrayNunbers = createArrayNumbers(removePointInNumbers());
  arrayNunbers.length = n;
  return arrayNunbers.join('');
}

function yesId(x){
  let lengthId = x || 21
  if(lengthId <= 21 && lengthId >= 4){
    let id = getLengthIds(lengthId)
    return id
  }
  return {status:404, error:'Debes colocar un parametro tipo number desde 5 asta 25'}
}

module.exports = yesId