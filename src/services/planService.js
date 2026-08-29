import api from './api'

async function createPlan(placeId, body){
    const res = await api.post('/plan', {...body, place: placeId})
    return res.data
}

async function getAllPlans(){
    const res = await api.get('/plan')
    return res.data
}

export {
    createPlan,
    getAllPlans
}