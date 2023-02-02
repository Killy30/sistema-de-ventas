const {Schema, model} = require('mongoose')

const planProSchema = new Schema({
    initialDate: {type:Date},
    endDate: {type:Date},
    userId: {type: String}
})

module.exports = model('planPro', planProSchema)