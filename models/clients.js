const {Schema, model} = require('mongoose')

const clientSchema = new Schema({
    name:{type: String},
    lastName: {type: String},
    id_client: {type: String},
    tel: {type: Number},
    id_doc: {type: String},
    email: {type: String},
    date: {type: Date, default:Date.now},
    user: {type: Schema.Types.ObjectId, ref:'User'},
    sales:[{ type: Schema.Types.ObjectId, ref:'sale'}],
})

module.exports = model('client', clientSchema)