const {Schema, model} = require('mongoose')

const salesSchema = new Schema({
    code: {type:Number},
    products:[{ type: Schema.Types.ObjectId, ref: 'product'}],
    totalPrice: {type:Number},
    pay: {type:Number},
    cambio: {type:Number},
    date: {type: Date, default:Date.now},
    user: { type: Schema.Types.ObjectId, ref: 'User'},
    cashier: { type: Schema.Types.ObjectId, ref: 'cashier'},
})

module.exports = model('sale', salesSchema)