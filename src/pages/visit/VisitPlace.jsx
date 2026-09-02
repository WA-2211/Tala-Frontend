import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import { Flex, Spin } from 'antd'
import { getAllVisits } from '../../services/visitService'
import styles from '../../styles/VisitPlace.module.css'

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
        <main className={styles.main}>
            <h1>Your Visit History</h1>

            {visits.length === 0 ? <p className={styles.noVisits}>You have no visits yet - Explore Now!</p>
                : visits.map((oneVisit) =>
                    <div key={oneVisit._id} className={styles.visitContainer}>
                        <h3>
                            {oneVisit.place ? (
                                < Link to={`/place/${oneVisit.place._id}`}>{oneVisit.place.name}</Link>
                            ) : ('Plac is no longer available')}
                        </h3>
                        <p className={styles.visitDate}><span style={{ fontWeight: 'bold' }}>Visited on:</span> {new Date(oneVisit.visitedAt).toLocaleDateString('en-BH', options)}</p>
                        {new Date(oneVisit.coolDownUntil) > new Date() ? <p className={styles.visitData}><span style={{ fontWeight: 'bold' }}>CoolDown until:</span> {new Date(oneVisit.coolDownUntil).toLocaleDateString('en-BH', options)}</p> : <p className={styles.visitData}>This place is available to visit again</p>}

                    </div>
                )}
        </main>
    )
}

export default VisitPlace