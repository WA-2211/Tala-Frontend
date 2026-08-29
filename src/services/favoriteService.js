import api from './api'

async function addToFavorite(placeId){
    const res = await api.post('/favorite', {place: placeId})
    return res.data
}

async function getAllFavorites(){
    const res = await api.get('/favorite')
    return res.data
}

async function deleteFavorite(favoriteId){
    const res = await api.delete('/favorite/' + favoriteId)
}
export {
    addToFavorite,
    getAllFavorites,
    deleteFavorite
}