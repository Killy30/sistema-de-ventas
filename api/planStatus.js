const Plan = require('../models/plan')


async function changePlanStatus(){
    const plans = await Plan.find()
   
    plans.forEach(async(plan) =>{
        let currentDate = new Date()
        let cutOffDate = new Date(plan.cutOffDate)
        
        const lastObj = plan.payHistory[plan.payHistory.length - 1]
        
        if(lastObj.endDate){
            if(currentDate.getTime() > cutOffDate.getTime()){
                plan.status = false
                await plan.save()
            }
        }
    })
}

module.exports = changePlanStatus