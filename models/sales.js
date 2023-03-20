const {Schema, model} = require('mongoose')

const salesSchema = new Schema({
    code: {type:String},
    products:[{ type: Schema.Types.ObjectId, ref: 'product'}],
    productsSold:[
        { productCode: Number, price: Number }
    ],
    totalPrice: {type:Number},
    subTotal: {type:Number},
    pay: {type:Number},
    cambio: {type:Number},
    itbis: {type:Number},
    date: {type: Date, default:Date.now},
    user: { type: Schema.Types.ObjectId, ref: 'User'},
    cashier: { type: Schema.Types.ObjectId, ref: 'cashier'},
    client: {type: Schema.Types.ObjectId, ref:'client'},
})

module.exports = model('sale', salesSchema)