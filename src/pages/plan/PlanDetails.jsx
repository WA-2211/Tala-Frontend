import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import { Flex, Spin, Typography, Tag } from 'antd'
import { getOnePlan, updatePlan } from '../../services/planService'
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined} from '@ant-design/icons'
function PlanDetails() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { planId } = useParams()
    const [plan, setPlan] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const { Paragraph } = Typography
    const [url, setUrl] = useState('none')
        const [formData, setFormData] = useState({
        status:'',
        scheduledDate:''
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

    function tagStatus(status){
        if(status === 'scheduled'){
            return <Tag color='warning' icon={<ClockCircleOutlined/>}>Scheduled</Tag>
        }
        else if(status === 'completed'){
            return <Tag color='success' icon={< CheckCircleOutlined/>}>Completed</Tag>
        }
        else {
            return <Tag color='error' icon={<CloseCircleOutlined/>}>Cancelled</Tag>
        }
    }
    async function loadPlanDetails() {
        try {
            setLoading(true)
            setError(false)

            const res = await getOnePlan(planId)
            setPlan(res)

        } catch (err) {
            setError(err?.response?.data?.message)

        } finally {
            setLoading(false)
        }
    }

    async function updatePlanDetails(planId){
        try {
            await updatePlan(planId, {})
            await loadPlanDetails()
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

                
                </>
            )}
        </main>
    )
}

export default PlanDetails