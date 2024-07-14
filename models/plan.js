const {Schema, model} = require('mongoose')

const planSchema = new Schema({
    planType: {type: String},
    currentPlanId: {type: String},
    planData: {type: Object},
    cutOffDate: {type: Date},
    status: {type: Boolean},
    payHistory: [{
        planId: {type: String},
        initialDate: {type: Date},
        endDate: {type: Date},
    }],
    date: {type: Date, default:Date.now},
    user: { type: Schema.Types.ObjectId, ref: 'User'}
})

module.exports = model('plan', planSchema)