import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import { Flex, Spin, Rate } from 'antd'
import { getOnePlace } from '../../services/placeService'
import { getReview } from '../../services/reviewService'
import { addToFavorite, getAllFavorites, deleteFavorite } from '../../services/favoriteService'
import { createVisit, getAllVisits } from '../../services/visitService'

function PlaceDetails() {

    const navigate = useNavigate()
    const { user } = useAuth()
    const { placeId } = useParams()
    const [place, setPlace] = useState({})
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [visitError, setVisitError] = useState('')
    const [favorite, setFavorite] = useState(false)
    const [favoriteId, setFavoriteId] = useState(null)
    const [visit, setVisit] = useState(false)
    const [coolDown, setCoolDown] = useState(null)

    async function handleFavorite() {
        try {
            if (favorite) {
                 await deleteFavorite(favoriteId)
                setFavorite(false)
                setFavoriteId(null)
             }
            else {
                const favoritePlace = await addToFavorite(placeId)
                setFavorite(true)
                setFavoriteId(favoritePlace._id)
            }

        } catch (err) {
            setError(err?.response?.data?.message)

        }
    }

    async function handleVisit(){
        try {
      
              const createdVisit = await createVisit(placeId)
                setVisit(true)
                setCoolDown(createdVisit.coolDownUntil)
                setVisitError('')
            }
         catch (err) {
            setVisitError(err?.response?.data?.message)

        }
    }
    async function loadData() {
        try {
            setLoading(true)
            setError(false)

            const [resPlace, resReview, resFavorite, resVisit] = await Promise.all([
                getOnePlace(placeId),
                getReview(placeId),
                getAllFavorites(),
                getAllVisits()
            ])

            setPlace(resPlace)
            setReviews(resReview)

            const foundFavorite = resFavorite.find((oneFavorite) => oneFavorite.place._id === placeId)
            if (foundFavorite) {
                setFavorite(true)
                setFavoriteId(foundFavorite._id)
            }
            const foundVisit = resVisit.find((oneVisit) => oneVisit.place._id === placeId  && new Date(oneVisit.coolDownUntil) > new Date())
            if (foundVisit) {
                setVisit(true)
                setCoolDown(foundVisit.coolDownUntil)
            }


        } catch (err) {
            setError(err?.response?.data?.message)

        } finally {
            setLoading(false)
        }
    }



    useEffect(() => {
        loadData()
    }, [placeId])


    if (loading) return <Flex align='center' gap='medium' justify='center'>
        <Spin size='large' description='Loading...' />
    </Flex>
    if (error) return <p>ERROR: {error}</p>

    return (
        <main>
            {place && (
                <>
                    <h1>{place.name}</h1>
                    <button onClick={handleFavorite}>{favorite?'Unfavorite Place' :"Favorite Place"}</button>
                    <button onClick={handleVisit} disabled={visit}>{visit? `On cooldown until ${new Date(coolDown).toLocaleDateString()}`:'Visit Place'}</button>
                    <p>{visitError}</p>
                    <p>{place.category}</p>
                    <p>{place.tags?.join(' / ')}</p>
                    <p>{place.description}</p>
                    <p>{place.priceRange?.category} , {place.priceRange?.averageBHD}BHD average</p>
                    <p>{place.ratingAvg} / 5</p>
                    <button>Add Review</button>
                    {reviews.map((oneReview) =>
                        <div key={oneReview._id}>
                            <h3>Recent Reviews</h3>
                            <p>{oneReview.user?.username}</p>
                            <Flex align='center' gap='small'>
                                <Rate allowHalf disabled value={place.ratingAvg} />
                                <span>{place.ratingAvg} / 5</span>
                            </Flex>
                            <p>{oneReview.reviewText}</p>
                        </div>
                    )}

                </>
            )}

        </main>
    )
}

export default PlaceDetails