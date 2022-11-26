

const {Schema, model} = require('mongoose')

const cashierSchema = new Schema({
    id_code: {type: Number},
    id_document: {type: String},
    name: {type: String},
    lastName: {type: String},
    tel: {type: Number},
    email: {type: String},
    status: {type: Boolean, default: false},
    sales: [{type: Schema.Types.ObjectId, ref: 'sale'}],
    user: {type: Schema.Types.ObjectId, ref: 'User'}
})

module.exports = model('cashier', cashierSchema)

