const Plan = require('../models/plan')


async function checkPlanStatus(userId){
    const plan = await Plan.findOne({user: userId})
    const msg = 'Su cuenta se encuentra inactiva en este momento, por favor revisa su fecha de cobro o contactanos';

    if(!plan.status){
        return {
            status:false, 
            msg:msg,
            color: 'alert alert-danger'
        }
    }
}

module.exports = checkPlanStatus

