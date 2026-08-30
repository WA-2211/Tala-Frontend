import api from './api'

async function getPlanByLink(inviteLink){
    const res = await api.get('/plan/invite/' + inviteLink)
    return res.data
}

export {
    getPlanByLink
}