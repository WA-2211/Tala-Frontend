import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import { Flex, Spin, Typography } from 'antd'
import { createPlan, getAllPlans } from '../../services/planService'

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
    const [copied, setCopied] = useState(null)

    async function handleCopy(planId, shareUrlLink){
        try {
            await navigator.clipboard.writeText(shareUrlLink)
            setCopied(planId)
    
            setTimeout(() =>{
                setCopied(null)
            },2000)
            
        } catch (err) {
            console.error(err)
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
        <main>
            <h1>Your Plans</h1>
            {url}
            {plans.length === 0 ? <p>You have no plans yet - Add yours Now!</p>
                : plans.map((onePlan) =>{
                const shareUrlLink = `${url}/plan/invite/${onePlan.inviteLink}`
                return(
                    <div key={onePlan._id}>
                        <h3>{onePlan.place.name}</h3>
                        <p>{new Date(onePlan.scheduledDate).toLocaleDateString('en-BH', options)}</p>
                        <p>{onePlan.status}</p>
                        <h3>Invite Friends</h3>
                        <span>
                            <Paragraph  copyable={{text: shareUrlLink}}>
                            {shareUrlLink}

                            </Paragraph >

                            </span>
                        <button onClick={() => handleCopy(onePlan._id, shareUrlLink)}>{copied === onePlan._id? 'Copied to clipboard!':'Copy'}</button>

                    </div>
                )}
                )}

        </main>
    )
}

export default AllPlans