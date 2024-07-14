const {Schema, model} = require('mongoose')

const checkoutSchema = new Schema({
    checkout: {type: Number},
    connect: {type: Boolean, default:false},
    online: {type: Boolean, default:false},
    idConnection: {type: String},
    active: {type: Boolean, default:false},
    machine: {type: String},
    entryCode: {type: String},
    totalSaleToday: {type: Number},
    cashier: {type: String},
    date: {type: Date, default:Date.now},
    sales: [{type: Schema.Types.ObjectId, ref: 'sale'}],
    user: {type: Schema.Types.ObjectId, ref: 'User'}
})

module.exports = model('checkout', checkoutSchema)  