

const {Schema, model} = require('mongoose')

const cashierSchema = new Schema({
    id_code: {type: Number},
    id_document: {type: String},
    name: {type: String},
    lastName: {type: String},
    connect: {type: Boolean, default: false},
    idConnection: {type: String},
    tel: {type: Number},
    email: {type: String},
    status: {type: Boolean, default: false},
    sales: [{type: Schema.Types.ObjectId, ref: 'sale'}],
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    date: {type: Date, default:Date.now}
})

module.exports = model('cashier', cashierSchema)

