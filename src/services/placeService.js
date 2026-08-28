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

async function getReview(placeId) {
    const res = await api.get('/place/' + placeId +'/review')
    return res.data
}
export{
    getRecommendation,
    getAllPlaces,
    getOnePlace,
    getReview
}