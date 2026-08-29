import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import { Flex, Spin } from 'antd'
import { createPlan, getAllPlans } from '../../services/planService'

function AllPlans() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [plans, setPlans] = useState([])
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
    }, [])

    if (loading) return <Flex align='center' gap='medium' justify='center'>
        <Spin size='large' description='Loading...' />
    </Flex>
    if (error) return <p>ERROR: {error}</p>

    return (
        <main>
            <h1>Your Plans</h1>
            {plans.length === 0? <p>You have no plans yet - Add yours Now!</p>
            : plans.map((onePlan) => 
            <div key={onePlan._id}>
                <h3>{onePlan.place.name}</h3>
                <p>{new Date(onePlan.scheduledDate).toLocaleDateString('en-BH', options)}</p>
                <p>{onePlan.status}</p>
                <p>{onePlan.inviteLink}</p>


            </div>
        )}

        </main>
    )
}

export default AllPlans