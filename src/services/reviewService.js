import api from './api'

async function getReview(placeId) {
    const res = await api.get('/place/' + placeId + '/review')
    return res.data
}

async function createReview(placeId, body){
    const res = await api.post('/place/' + placeId + '/review', {...body, place:placeId})
    return res.data
}

export {
    getReview,
    createReview
}