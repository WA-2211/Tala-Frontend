import React from 'react'
import 'leaflet/dist/leaflet.css'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import { Flex, Spin, Rate } from 'antd'
import { getOnePlace } from '../../services/placeService'
import { getReview, createReview } from '../../services/reviewService'
import { addToFavorite, getAllFavorites, deleteFavorite } from '../../services/favoriteService'
import { createVisit, getAllVisits } from '../../services/visitService'
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import styles from '../../styles/PlaceDetails.module.css'

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
        rating: '',
        reviewText: ''
    })
    const position = [place.location?.coordinates?.[1], place.location?.coordinates?.[0]]

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

    async function handleVisit() {
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

    function handleChange(event) {
        const { name, type, value, checked } = event.target;

        setReviewFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    function handleShowReviewForm() {
        setReviewForm(true)
    }

    function handleHideReviewForm() {
        setReviewForm(false)

    }

    async function handleSubmit(event) {
        try {
            event.preventDefault()
            const res = await createReview(placeId, reviewFormData)
            setReviewFormData({
                rating: '',
                reviewText: ''
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

            if (user) {
                const [resFavorite, resVisit] = await Promise.all([

                    getAllFavorites(),
                    getAllVisits()
                ])
                const foundFavorite = resFavorite.find((oneFavorite) => oneFavorite.place._id === placeId)
                if (foundFavorite) {
                    setFavorite(true)
                    setFavoriteId(foundFavorite._id)
                }
                const foundVisit = resVisit.find((oneVisit) => oneVisit.place._id === placeId && new Date(oneVisit.coolDownUntil) > new Date())
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
        <main className={styles.main}>
            {place && (
                <div className={styles.placeContainer}>
                    <h1>{place.name}</h1>
                    {user && (
                        <div className={styles.btnContainer}>
                            <button onClick={handleFavorite} className={styles.btnFavorite}>
                                {favorite ? 'Unfavorite Place' : "Favorite Place"}
                            </button>
                            <button onClick={handleVisit} disabled={visit} className={styles.btn}>
                                {visit ? `On cooldown until ${new Date(coolDown).toLocaleDateString()}` : 'Visit Place'}
                            </button>
                        </div>
                    )}
                    {visitError && <p className={styles.error}>{visitError}</p>} 
                    <p className={styles.placeCategory}>{place.category}</p>
                    <p className={styles.placeTags}>{place.tags?.join(' / ')}</p>
                    <p className={styles.placeDescription}>{place.description}</p>
                    <p className={styles.placePrice}>{place.priceRange?.category} , {place.priceRange?.averageBHD}BHD average</p>
                    <p className={styles.placeRating}>{place.ratingAvg} / 5</p>
                    {place.location?.coordinates?  (
                        <>
                    <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{height: '350px', width:'100%'}}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={position}>
                            <Popup>
                                {place.name}
                            </Popup>
                        </Marker>
                    </MapContainer>
                        </>
                    ) : (<p>Location not available for thie place</p>

                    )
                    }
                    <hr className={styles.hr}></hr>


                    <button className={styles.btn} onClick={handleShowReviewForm} disabled={!user}>
                        {user ? 'Add Review' : 'Sign in to add review'}
                    </button>
                    {reviewForm && (
                        <>
                            <form onSubmit={handleSubmit} className={styles.reviewForm}>
                                <div className={styles.formElement}>
                                    <label htmlFor='rating'>Your Rating</label>
                                    <input
                                        type='number'
                                        name='rating'
                                        id='rating'
                                        value={reviewFormData.rating}
                                        autoComplete='off'
                                        onChange={handleChange}
                                        required
                                        className={styles.formInput}
                                    />
                                </div>

                                <div className={styles.formElement}>
                                    <label htmlFor='reviewText'>Place Review</label>
                                    <textarea
                                        id='reviewText'
                                        name='reviewText'
                                        value={reviewFormData.reviewText}
                                        autoComplete='off'
                                        onChange={handleChange}
                                        className={styles.formInput}
                                    ></textarea>
                                </div>

                                <div>
                                    <button type='button' onClick={handleHideReviewForm} className={styles.btn}>
                                        Cancel
                                    </button>
                                    <button type='submit' className={styles.btn}>
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </>
                    )}

                    <h3>Recent Reviews</h3>
                    {reviews.map((oneReview) =>
                        <div key={oneReview._id} className={styles.reviewContainer}>
                            <p className={styles.reviewUser}>{oneReview.user?.username}</p>
                            <Flex align='center' gap='small'>
                                <Rate allowHalf disabled value={oneReview.rating} />
                                <span>{oneReview.rating} / 5</span>
                            </Flex>
                            <p className={styles.reviewText}>{oneReview.reviewText}</p>
                        </div>
                    )}

                </div>
            )}

        </main>
    )
}

export default PlaceDetails