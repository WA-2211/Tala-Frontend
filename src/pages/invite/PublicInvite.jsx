import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import { Flex, Spin, Typography, Tag } from 'antd'
import { getPlanByLink, acceptPublicInvite } from '../../services/inviteService'
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import styles from '../../styles/Publicinvite.module.css'

function PublicInvite() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { inviteLink } = useParams()
    const [plan, setPlan] = useState({})
    const [joinPlan, setJoinPlan] = useState(false)
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

    async function joinPlanByLink(){
        try {
            setJoinPlan(true)
            setError(false)

            await acceptPublicInvite(inviteLink)
            navigat('/invite')
        } catch (err) {
            setError(err?.response?.data?.message)
            setJoinPlan(false)
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
        <main className={styles.main}>
            {plan && (
                <div className={styles.inviteContainer}>
                    <p>{tagStatus(plan.status)}</p>
                    <h3>{plan.user.username} invited you to visit <Link to={`/place/${plan.place._id}`}>{plan.place.name}</Link></h3>
                    <p className={styles.date}>{plan.scheduledDate ? `Planned on: ${new Date(plan.scheduledDate).toLocaleDateString('en-BH', options)}` : '- No date added yet -'}</p>
                    <p className={styles.description}>{plan.place.description}</p>

                    {user ? (
                        
                        <button className={styles.btnAccept} onClick={joinPlanByLink} disabled={joinPlan}>{joinPlan? 'Joining ..' : 'Accept Invitation'}</button>
                        ):(
                            
                            <p className={styles.message}>Respond to this invite by <Link to='/sign-in' className={styles.link}>Signing-In</Link></p>
                        
                    )}
                </div>
            
            )}

        </main>
    )
}

export default PublicInvite