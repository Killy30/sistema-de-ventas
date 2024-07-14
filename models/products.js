const {Schema, model} = require('mongoose')

const productsSchema = new Schema({
    name: {type: String},
    buy_price: {type: Number},
    price: {type: Number},
    sum_price: {type: Number},
    idcode: {type: Number},
    itbis: {type: Number},
    description: {type: String},
    category: {type: String},
    status: {type: Boolean, default: true},
    user: { type: Schema.Types.ObjectId, ref: 'User'},
    date: {type: Date, default:Date.now}
})

module.exports = model('product', productsSchema)