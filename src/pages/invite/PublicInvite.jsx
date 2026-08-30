import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import { Flex, Spin, Typography, Tag } from 'antd'
import { getPlanByLink } from '../../services/inviteService'
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'

function PublicInvite() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { inviteLink } = useParams()
    const [plan, setPlan] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const { Paragraph } = Typography
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
        if (status === 'scheduled') {
            return <Tag color='warning' icon={<ClockCircleOutlined />}>Scheduled</Tag>
        }
        else if (status === 'completed') {
            return <Tag color='success' icon={< CheckCircleOutlined />}>Completed</Tag>
        }
        else {
            return <Tag color='error' icon={<CloseCircleOutlined />}>Cancelled</Tag>
        }
    }

    async function loadInviteDetails() {
        try {
            setLoading(true)
            setError(false)

            const res = await getPlanByLink(inviteLink)
            setPlan(res)

        } catch (err) {
            setError(err?.response?.data?.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadInviteDetails()

    }, [])

    if (loading) return <Flex align='center' gap='medium' justify='center'>
        <Spin size='large' description='Loading...' />
    </Flex>
    if (error) return <p>ERROR: {error}</p>

    return (
        <main>
            {plan && (
                <>
                    <p>{tagStatus(plan.status)}</p>
                    <h3>{plan.user.username} invited you to visit <Link to={`/place/${plan.place._id}`}>{plan.place.name}</Link></h3>
                    <p>{plan.place.scheduledDate ? new Date(plan.scheduledDate).toLocaleDateString('en-BH', options) : '- No date added yet -'}</p>
                    <p>{plan.place.description}</p>

                    {!user && (
                        <>
                            <p>Respond to this invite by <Link to='/sign-in'>Signing-In</Link></p>
                        </>
                    )}
                </>
            )
            }

        </main>
    )
}

export default PublicInvite