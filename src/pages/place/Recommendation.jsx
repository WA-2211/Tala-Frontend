import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import { Flex, Spin } from 'antd'
import { getRecommendation } from '../../services/placeService'
import { createPlan } from '../../services/planService'

function Recommendation() {

    const navigate = useNavigate()
    const { user } = useAuth()
    const [recommendations, setRecommendations] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [saveError, setSaveError] = useState('')
    const [savedPlans , setSavedPlans] = useState([])

    async function handleSaveRecommendation(placeId){
        try {
            const addToPlan = await createPlan(placeId)
            setSavedPlans([...savedPlans, {placeId, planId: addToPlan._id}])

        } catch (err) {
            setSaveError(err?.response?.data?.message)

        }
    }
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
            {recommendations.map((oneRecommendation) =>{
                const isSaved = savedPlans.find((onePlan)=> onePlan.placeId === oneRecommendation.place._id)
            // const isSaved = savedIds.includes(oneRecommendation.place._id)
             return (
                <div key={oneRecommendation.place._id}>
                    <h3>{oneRecommendation.place.name}</h3>
                    <p>{saveError}</p>
                    <p>{oneRecommendation.place.description}</p>

                    <button onClick={() => handleSaveRecommendation(oneRecommendation.place._id)}
                     disabled={!!isSaved}>{isSaved? 'Saved' : 'Save To Plans'}
                     </button>

                     {isSaved && (
                        <>
                        <Link to={`/plan/${isSaved.planId}`}>View Plan</Link>
                        </>
                     )}
                </div>
                )
            })}

        </main>
    )
}

export default Recommendation