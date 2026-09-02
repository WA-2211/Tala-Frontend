import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import { Flex, Spin, Tag } from 'antd'
import { getAllPlaces, getNearMePlaces } from '../../services/placeService'
import styles from '../../styles/Allplaces.module.css'

function Allplaces() {

    const navigate = useNavigate()
    const { user } = useAuth()
    const [places, setPlaces] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [showFilter, setShowFilter] = useState(false)
    const [coords, setCoords] = useState(null)
    const [nearby, setNearby] = useState(false)
    const [filter, setFilter] = useState({
        category: '',
        priceRange: '',
        ratingMin: ''
    })
    const categories = ['cafe', 'restaurant', 'event', 'cinema', 'shopping', 'bookstore', 'sports', 'activity', 'workshop', 'gallery', 'park', 'museum', 'other']
    const priceRangeData = ['affordable', 'midrange', 'premium']
    const ratings = [
        { label: '1+', value: 1 },
        { label: '2+', value: 2 },
        { label: '3+', value: 3 },
        { label: '4+', value: 4 },
        { label: '4.5+', value: 4.5 },
        { label: '5', value: 5 }
    ]

    function handleCategoryChange(value) {

        setFilter((prev) => ({
            ...prev,
            category: value || ''
        }));
    }

    function handlePriceRangeChange(value) {
        setFilter((prev) => ({
            ...prev,
            priceRange: value || ''
        }))
    }

    function handleRatingChange(value) {
        setFilter((prev) => ({
            ...prev,
            ratingMin: value || ''
        }))
    }

    function handleNearMePlaces() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const addCoordinates = {
                    lat: position.coords.latitude,
                    long: position.coords.longitude
                }

                setCoords(addCoordinates)
                setNearby(true)
            },
            (err) => {
                setError('Could not get location')
            }
        )
    }

    function handleShowFilters() {
        setShowFilter((filter) => !filter)
    }

    async function loadPlaces() {
        try {
            setLoading(true)
            setError(false)

            let res
            if (nearby && coords) {
                res = await getNearMePlaces(coords.lat, coords.long, filter)
            }
            else {
                res = await getAllPlaces(filter)
            }
            setPlaces(res)

        } catch (err) {
            setError(err?.response?.data?.message)

        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        loadPlaces()
    }, [])

    if (loading) return <Flex align='center' gap='medium' justify='center'>
        <Spin size='large' description='Loading...' />
    </Flex>
    if (error) return <p>ERROR: {error}</p>


    return (
        <main className={styles.main}>
            <p className={styles.error}>{error}</p>

            <div className={styles.filterContent}>
                {user && (
                    <button onClick={handleShowFilters} className={styles.btnFilter}>{showFilter ? 'Hide Filters' : 'Filters'}</button>
                )}

                {user && showFilter && (
                    <>
                        <div className={styles.filterContainer}>
                            <div className={styles.filterElement}>
                                <h4>By category:</h4>
                                <div className={styles.filterTags}>
                                    <Tag.CheckableTagGroup
                                        options={categories}
                                        value={filter.category || null}
                                        onChange={handleCategoryChange}
                                    />
                                </div>
                            </div>
                            <div className={styles.filterElement}>
                                <h4>By price range:</h4>
                                <div className={styles.filterTags}>
                                    <Tag.CheckableTagGroup
                                        options={priceRangeData}
                                        value={filter.priceRange || null}
                                        onChange={handlePriceRangeChange}
                                    />
                                </div>
                            </div>

                            <div className={styles.filterElement}>
                                <h4>By Rating:</h4>
                                <div className={styles.filterTags}>
                                    <Tag.CheckableTagGroup
                                        options={ratings}
                                        value={filter.ratingMin || null}
                                        onChange={handleRatingChange}
                                    />
                                </div>
                            </div>

                            <div className={styles.filterElement}>
                                <h4>By Location:</h4>
                                <div className={styles.filterTags}>
                                    <Tag.CheckableTag
                                        checked={nearby} onChange={(checked) => {
                                            if (checked) {
                                                handleNearMePlaces()
                                            } else {
                                                setNearby(false)
                                            }
                                        }}>
                                        Near Me
                                    </Tag.CheckableTag>
                                </div>
                            </div>
                        </div>

                        <button onClick={loadPlaces} className={styles.btnFilter}>Apply Filters</button>
                    </>
                )}
            </div>
            <h1>Where To Go?</h1>
            {places.map((onePlace) =>
                <Link to={`/place/${onePlace._id}`} key={onePlace._id} className={styles.placeContainer}>



                    <h3>{onePlace.name}</h3>
                    <p>{onePlace.description}</p>

                    <div className={styles.header}>

                        <p className={styles.placeTags}>{onePlace.tags.join(' / ')} </p>
                        <p className={styles.placePrice}><span style={{ fontFamily: 'serif' }}>{onePlace.priceRange.averageBHD}</span> BHD average</p>
                    </div>
                </Link>
            )}
        </main>
    )
}

export default Allplaces