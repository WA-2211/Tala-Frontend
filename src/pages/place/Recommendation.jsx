import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import { Flex, Spin } from 'antd'
import { getRecommendation } from '../../services/placeService'

function Recommendation() {

    const navigate = useNavigate()
    const { user } = useAuth()
    const [recommendations, setRecommendations] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    async function loadRecommendations() {
        try {
            setLoading(true)
            setError(false)

            const res = await getRecommendation()
            setRecommendations(res)

        } catch (err) {
            setError(err?.response?.data?.message)

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadRecommendations()
    }, [])

    if (loading) return <Flex align='center' gap='medium' justify='center'>
        <Spin size='large' description='Loading...' />
    </Flex>
    if (error) return <p>ERROR: {error}</p>


    return (
        <main>
            <h1>Recommended For You</h1>
            {recommendations.map((oneRecommendation) =>
                <div key={oneRecommendation.place._id}>
                    <h3>{oneRecommendation.place.name}</h3>
                    <p>{oneRecommendation.place.description}</p>
                </div>
            )}

        </main>
    )
}

export default Recommendation