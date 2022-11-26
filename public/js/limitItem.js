

const paginationLimit = 5;
let currentPage = 1

const limit_item = (list) =>{
    currentPage--
    let s = paginationLimit * currentPage
    let e = s + paginationLimit
    let piece = list.slice(s,e)

    return piece
}

// console.log(limit_item(array));

export default limit_item
