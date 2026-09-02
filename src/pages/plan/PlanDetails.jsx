import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import { Flex, Spin, Typography, Tag } from 'antd'
import { getOnePlan, updatePlan, deletePlan } from '../../services/planService'
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import styles from '../../styles/PlanDetails.module.css'

function PlanDetails() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { planId } = useParams()
    const [plan, setPlan] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const { Paragraph } = Typography
    const [url, setUrl] = useState('none')
    const [editForm, setEditForm] = useState(false)
    const [formData, setFormData] = useState({
        status: '',
        scheduledDate: ''
    })
    const shareUrlLink = `${url}/plan/invite/${plan.inviteLink}`
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
    async function loadPlanDetails() {
        try {
            setLoading(true)
            setError(false)

            const res = await getOnePlan(planId)
            setPlan(res)
            setFormData({
                status: res.status,
                scheduledDate: res.scheduledDate
            })

        } catch (err) {
            setError(err?.response?.data?.message)

        } finally {
            setLoading(false)
        }
    }

    async function handleDeletePlan(planId) {
        try {
            const newPlanList = await deletePlan(planId)
            navigate('/plan')
        } catch (err) {
            setError(err?.response?.data?.message)

        }
    }
    async function updatePlanDetails(planId) {
        try {
            await updatePlan(planId, {})
            await loadPlanDetails()
        } catch (err) {
            setError(err?.response?.data?.message)

        }
    }

    function handleShowEditForm() {
        setEditForm(true)
    }

    function handleHideEditForm() {
        setEditForm(false)

    }
    function handleChange(event) {
        const { name, type, value, checked } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    async function handlesubmit(event) {
        try {
            event.preventDefault()
            const res = await updatePlan(planId, formData)
            setPlan(res)
            setEditForm(false)
        } catch (err) {
            setError(err?.response?.data?.message)
        }
    }

    useEffect(() => {
        loadPlanDetails()
        const currentUrl = window.location.origin
        setUrl(currentUrl)
    }, [])

    if (loading) return <Flex align='center' gap='medium' justify='center'>
        <Spin size='large' description='Loading...' />
    </Flex>
    if (error) return <p>ERROR: {error}</p>

    return (
        <main className={styles.main}>
            {plan && (
                <div className={styles.planContainer}>
                    <div className={styles.planTitle}>
                        <h3>{plan.place.name}</h3>
                        {tagStatus(plan.status)}
                    </div>
                    <p className={styles.planData}>{plan.scheduledDate ? `Planned on: ${ new Date(plan.scheduledDate).toLocaleDateString('en-BH', options) }`: '- No date added yet -'}</p>

                    <div className={styles.linkContainer}>
                        <p style={{ fontWeight: '700', textAlign:'left', fontSize:'25px' }}>Invite Friends</p>
                        <span>
                            <Paragraph copyable={{ text: shareUrlLink }} className={styles.inviteLink}>
                                {shareUrlLink}
                            </Paragraph >
                        </span>
                    </div>
                    <h3 style={{ marginTop: '1.2rem' }}>Edit Plan Details</h3>

                    <button className={styles.btnDelete} onClick={() => handleDeletePlan(planId)}>Delete</button>
                    <button className={styles.btnEdit} onClick={handleShowEditForm}>Edit</button>
                    {editForm && (
                        <>
                            <form onSubmit={handlesubmit} className={styles.editForm}>
                                <div className={styles.formElement}>
                                    <label htmlFor='scheduledDate'>Scheduled Date</label>
                                    <input
                                        type='date'
                                        name='scheduledDate'
                                        id='scheduledDate'
                                        value={formData.scheduledDate || ''}
                                        autoComplete='off'
                                        onChange={handleChange}
                                        required
                                        className={styles.formInput}
                                    />
                                </div>

                                <div className={styles.formElement}>
                                    <label htmlFor='status'>Plan Status</label>
                                    <select
                                        name='status'
                                        id='status'
                                        value={formData.status}
                                        onChange={handleChange}
                                        required
                                        className={styles.formInput}
                                    >
                                        <option value='scheduled'>scheduled</option>
                                        <option value='completed'>completed</option>
                                        <option value='cancelled'>cancelled</option>
                                    </select>
                                </div>

                                <div className={styles.btnContainer}>
                                    <button type='button' onClick={handleHideEditForm} className={styles.btnCancel}>Cancel</button>
                                    <button className={styles.btnSave} type='submit'>Save Changes</button>
                                </div>
                            </form>
                        </>
                    )}


                </div>
            )}
        </main>
    )
}

export default PlanDetails