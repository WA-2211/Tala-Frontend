import api from './api'

async function createPlan(placeId, body){
    const res = await api.post('/plan', {...body, place: placeId})
    return res.data
}

async function getAllPlans(){
    const res = await api.get('/plan')
    return res.data
}

async function getOnePlan(planId){
    const res = await api.get('/plan/' + planId)
    return res.data
}

async function updatePlan(planId, body){
    const res = await api.put('/plan/' + planId, body)
    return res.data
}

export {
    createPlan,
    getAllPlans,
    getOnePlan,
    updatePlan
}