import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import { Flex, Spin, Typography, Tag } from 'antd'
import { createPlan, getAllPlans } from '../../services/planService'
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import styles from '../../styles/AllPlans.module.css'

function AllPlans() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [plans, setPlans] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const { Paragraph } = Typography
    const [url, setUrl] = useState('none')
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

    async function loadPlans() {
        try {
            setLoading(true)
            setError(false)

            const res = await getAllPlans()
            setPlans(res)
        } catch (err) {
            setError(err?.response?.data?.message)

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadPlans()
        const currentUrl = window.location.origin
        setUrl(currentUrl)
    }, [])

    if (loading) return <Flex align='center' gap='medium' justify='center'>
        <Spin size='large' description='Loading...' />
    </Flex>
    if (error) return <p>ERROR: {error}</p>

    return (
        <main className={styles.main}>
            <h1>Your Plans</h1>
            {plans.length === 0 ?
                <div style={{ textAlign: 'center' }}>
                    <p className={styles.noPlans}>You have no plans yet - Add yours Now!</p>
                    <Link to='/recommended' className={styles.link}>Get a recommendation</Link>
                </div>
                : plans.map((onePlan) => {
                    const shareUrlLink = `${url}/plan/invite/${onePlan.inviteLink}`
                    return (
                        <div key={onePlan._id} className={styles.planContainer}>
                            <div className={styles.planTitle}>
                                <h3><Link to={`/plan/${onePlan._id}`}>{onePlan.place.name}</Link></h3>
                                {tagStatus(onePlan.status)}
                            </div>
                            <p className={styles.planData}>
                                {onePlan.scheduledDate ? new Date(onePlan.scheduledDate).toLocaleDateString('en-BH', options) : '- No date added yet -'}
                            </p>
                            <h4>Invite Friends</h4>
                            <span>
                                <Paragraph copyable={{ text: shareUrlLink }} className={styles.inviteLink}>
                                    {shareUrlLink}
                                </Paragraph >
                            </span>

                        </div>
                    )
                }
                )}

        </main>
    )
}

export default AllPlans