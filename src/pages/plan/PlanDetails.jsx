import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import { Flex, Spin, Typography, Tag } from 'antd'
import { getOnePlan, updatePlan } from '../../services/planService'
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
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
        <main>
            {plan && (
                <>
                    <h3>{plan.place.name}</h3>
                    <span>
                        <Paragraph copyable={{ text: shareUrlLink }}>
                            {shareUrlLink}
                        </Paragraph >
                    </span>
                    <p>Planned on: {new Date(plan.scheduledDate).toLocaleDateString('en-BH', options)}</p>
                    {tagStatus(plan.status)}
                    <h3>Edit Plan Details</h3>
                    <button onClick={handleShowEditForm}>Edit</button>
                    {editForm && (
                        <>
                            <form onSubmit={handlesubmit}>
                                <div>
                                    <label htmlFor='scheduledDate'>Scheduled Date:</label>
                                    <input
                                        type='date'
                                        name='scheduledDate'
                                        id='scheduledDate'
                                        value={formData.scheduledDate || ''}
                                        autoComplete='off'
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor='status'>Plan Status:</label>
                                    <select 
                                    name='status'
                                    id='status' 
                                    value={formData.status} 
                                    onChange={handleChange}
                                    required
                                    >
                                        <option value='scheduled'>scheduled</option>
                                        <option value='completed'>completed</option>
                                        <option value='cancelled'>cancelled</option>
                                    </select>
                                </div>

                                <button type='button' onClick={handleHideEditForm}>Cancel</button>
                                <button type='submit'>Save Changes</button>
                            </form>
                        </>
                    )}


                </>
            )}
        </main>
    )
}

export default PlanDetails