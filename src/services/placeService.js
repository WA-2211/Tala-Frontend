import api from "./api";

async function getRecommendation(){
    const res = await api.get('/place/recommended')
    return res.data
}

export{
    getRecommendation
}