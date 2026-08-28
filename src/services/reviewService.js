import api from './api'

async function getReview(placeId) {
    const res = await api.get('/place/' + placeId + '/review')
    return res.data
}

export {
    getReview
}