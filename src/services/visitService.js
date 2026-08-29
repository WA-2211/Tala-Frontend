import api from './api'

async function createVisit(placeId){
    const res = await api.post('/visit', {place: placeId})
    return res.data
}

async function getAllVisits(){
    const res = await api.get('/visit')
    return res.data
}

export {
    createVisit,
    getAllVisits
}