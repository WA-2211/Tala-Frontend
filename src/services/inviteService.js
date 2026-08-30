import api from './api'

async function getPlanByLink(inviteLink){
    const res = await api.get('/plan/invite/' + inviteLink)
    return res.data
}

async function createInvite(planId, username){
    const res = await api.post('/plan/' + planId + '/invite', {username: username})
    return res.data

}

async function updateInvite(inviteId, status){
    const res = await api.put('/invite/' + inviteId, {status: status})
    return res.data
}

async function getAllInvites(planId){
    const res = await api.get('/plan/' + planId + '/invite')
    return res.data
}
export {
    getPlanByLink,
    createInvite,
    getAllInvites, 
    updateInvite
}