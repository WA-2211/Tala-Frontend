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
}

export{
    getRecommendation,
    getAllPlaces,
    getOnePlace,
    createPlace
}