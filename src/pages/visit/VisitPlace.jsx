import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import { Flex, Spin } from 'antd'
import { getAllVisits } from '../../services/visitService'

function VisitPlace() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [visits, setVisits] = useState([])
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
    async function loadVisits() {
        try {
            setLoading(true)
            setError(false)

            const res = await getAllVisits()
            setVisits(res)
        } catch (err) {
            setError(err?.response?.data?.message)

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadVisits()
    }, [])

    if (loading) return <Flex align='center' gap='medium' justify='center'>
        <Spin size='large' description='Loading...' />
    </Flex>
    if (error) return <p>ERROR: {error}</p>

    return (
        <main>
            <h1>Your Visit History</h1>

            {visits.length === 0 ? <p>You have no visits yet - Explore Now!</p>
            :visits.map((oneVisit) =>
                <div key={oneVisit._id}>
                    <h3><Link to={`/place/${oneVisit.place._id}`}>{oneVisit.place.name}</Link></h3>
                    <p>{new Date(oneVisit.visitedAt).toLocaleDateString('en-BH', options)}</p>
                    {new Date(oneVisit.coolDownUntil) > new Date()? <p>CoolDown until: {new Date(oneVisit.coolDownUntil).toLocaleDateString('en-BH', options)}</p>:<p>This place is available to visit again</p>}

                </div>
            )}
        </main>
    )
}

export default VisitPlace