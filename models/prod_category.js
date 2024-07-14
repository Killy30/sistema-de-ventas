const {Schema, model} = require('mongoose')

const prodCategorySchema = new Schema({
    name: [{type: String}]
})

module.exports = model('prod_category', prodCategorySchema)