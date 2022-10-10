const {Schema, model} = require('mongoose')

const productsSchema = new Schema({
    name: {type:String},
    price: {type:Number},
    idcode: {type:Number},
    description: {type:String},
    category: {type:String},
    user: { type: Schema.Types.ObjectId, ref: 'User'},
})

module.exports = model('product', productsSchema)