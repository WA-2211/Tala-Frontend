import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import { Flex, Spin, Rate } from 'antd'
import { getOnePlace } from '../../services/placeService'
import { getReview, createReview } from '../../services/reviewService'
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
    const [reviewForm, setReviewForm] = useState(false)
    const [reviewFormData, setReviewFormData] = useState({
        rating:'',
        reviewText:''
    })

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

        function handleChange(event){
        const { name, type, value, checked } = event.target;

    setReviewFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }
    
    function handleShowReviewForm(){
            setReviewForm(true)
    }

        function handleHideReviewForm(){
            setReviewForm(false)
   
    }

   async function handleSubmit(event){
        try {
            event.preventDefault()
            const res = await createReview(placeId, reviewFormData)
            setReviewFormData({
                rating:'',
                reviewText:''
            })
            setReviews([...reviews, res])
            getReview(placeId)
            setReviewForm(false)
            
        } catch (err) {
            setVisitError(err?.response?.data?.message)
            
        }
    }


  
    async function loadData() {
        try {
            setLoading(true)
            setError(false)

            const [resPlace, resReview] = await Promise.all([
                getOnePlace(placeId),
                getReview(placeId)
            ])

            setPlace(resPlace)
            setReviews(resReview)

            if(user){
                const [resFavorite, resVisit] = await Promise.all([

                getAllFavorites(),
                getAllVisits()
            ])
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
                    {user && (
                        <>
                    <button onClick={handleFavorite}>{favorite?'Unfavorite Place' :"Favorite Place"}</button>
                    <button onClick={handleVisit} disabled={visit}>
                        {visit? `On cooldown until ${new Date(coolDown).toLocaleDateString()}`:'Visit Place'}
                    </button>
                        </>
                    )}
                    <p>{visitError}</p>
                    <p>{place.category}</p>
                    <p>{place.tags?.join(' / ')}</p>
                    <p>{place.description}</p>
                    <p>{place.priceRange?.category} , {place.priceRange?.averageBHD}BHD average</p>
                    <p>{place.ratingAvg} / 5</p>
                    <hr></hr>

                    
                    <button onClick={handleShowReviewForm} disabled={!user}>{user?'Add Review':'Sign in to add review'}</button>
                    {reviewForm && (
                        <>
                        <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor='rating'>Your Rating</label>
                            <input 
                            type='number'
                            name='rating'
                            id='rating'
                            value={reviewFormData.rating}
                            autoComplete='off'
                            onChange={handleChange}
                            required
                             />
                        </div>

                        <div>
                            <label htmlFor='reviewText'>Place Review</label>
                            <textarea
                            id='reviewText'
                            name='reviewText'
                            value={reviewFormData.reviewText}
                            autoComplete='off'
                            onChange={handleChange}
                            ></textarea>
                        </div>  

                        <div>
                            <button type='button' onClick={handleHideReviewForm}>Cancel</button>
                            <button type='submit'>Submit</button>

                        </div>                      
                    </form>
                        </>
                    )}
                    
                    <h3>Recent Reviews</h3>
                    {reviews.map((oneReview) =>
                        <div key={oneReview._id}>
                            <p>{oneReview.user?.username}</p>
                            <Flex align='center' gap='small'>
                                <Rate allowHalf disabled value={oneReview.rating} />
                                <span>{oneReview.rating} / 5</span>
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