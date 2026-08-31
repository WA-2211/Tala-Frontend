import api from "./api";

async function getRecommendation(){
    const res = await api.get('/place/recommended')
    return res.data
}

async function getAllPlaces(){
    const res = await api.get('/place')
    return res.data
}

async function getOnePlace(placeId) {
    const res = await api.get('/place/' + placeId)
    return res.data

}

async function createPlace(body){
    const res = await api.post('/place', body)
    return res.data
}

async function updatePlace(placeId, body){
    const res = await api.put('/place/' + placeId , body)
    return res.data
}

export{
    getRecommendation,
    getAllPlaces,
    getOnePlace,
    createPlace,
    updatePlace
}