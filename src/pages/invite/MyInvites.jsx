import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import { Flex, Spin, Typography, Tag } from 'antd'
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { getMyinvites, updateInvite } from '../../services/inviteService'

function MyInvites() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { inviteId } = useParams()
    const [invites, setInvites] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const options = {
        timeZone: 'Asia/Bahrain',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    }

    function tagStatus(status) {
        if (status === 'pending') {
            return <Tag color='warning' icon={<ClockCircleOutlined />}>Pending</Tag>
        }
        else if (status === 'accepted') {
            return <Tag color='success' icon={< CheckCircleOutlined />}>Accepted</Tag>
        }
        else {
            return <Tag color='error' icon={<CloseCircleOutlined />}>Rejected</Tag>
        }
    }

    async function loadMyInvites() {
        try {
            setLoading(true)
            setError(false)

            const res = await getMyinvites()
            setInvites(res)

        } catch (err) {
            setError(err?.response?.data?.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleStatus(inviteId, status) {
        try {
            await updateInvite(inviteId, status)
            loadMyInvites()

        } catch (err) {
            setError(err?.response?.data?.message)

        }

    }
    useEffect(() => {
        loadMyInvites()

    }, [])

    if (loading) return <Flex align='center' gap='medium' justify='center'>
        <Spin size='large' description='Loading...' />
    </Flex>
    if (error) return <p>ERROR: {error}</p>
    return (
        <div>
            {invites.length === 0 ? <p>You have not been invited yet!</p>
                : invites.map((oneInvite) => {
                    return (
                        <div key={oneInvite._id}>
                            <p><Link to={`/place/${oneInvite.plan.place._id}`}>{oneInvite.plan.place.name}</Link></p>
                    <p>{oneInvite.plan.scheduledDate ? new Date(oneInvite.plan.scheduledDate).toLocaleDateString('en-BH', options) : '- No date added yet -'}</p>
                            {tagStatus(oneInvite.status)}

                            <button onClick={() => handleStatus(oneInvite._id, 'accepted')} disabled={oneInvite.status === 'accepted'}>Accept</button>
                            <button onClick={() => handleStatus(oneInvite._id, 'rejected')} disabled={oneInvite.status === 'rejected'}>Reject</button>

                        </div>
                    )
                }
                )}          </div>
    )
}

export default MyInvites