import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import { Flex, Spin, Tag } from 'antd'
import { getAllPlaces } from '../../services/placeService'

function Allplaces() {

    const navigate = useNavigate()
    const { user } = useAuth()
    const [places, setPlaces] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
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

    async function loadPlaces() {
        try {
            setLoading(true)
            setError(false)

            const res = await getAllPlaces(filter)
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
        <main>
            <div>
                <h4>By category:</h4>
                <div>
                    <Tag.CheckableTagGroup
                        options={categories}
                        value={filter.category || null}
                        onChange={handleCategoryChange}
                    />
                </div>
            </div>

            <div>
                <h4>By price range:</h4>
                <div>
                    <Tag.CheckableTagGroup
                        options={priceRangeData}
                        value={filter.priceRange || null}
                        onChange={handlePriceRangeChange}
                    />
                </div>
            </div>

            <div>
                <h4>By Rating:</h4>
                <div>
                    <Tag.CheckableTagGroup
                        options={ratings}
                        value={filter.ratingMin || null}
                        onChange={handleRatingChange}
                    />
                </div>
            </div>

            <button onClick={loadPlaces}>Apply Filters</button>
            <h1>Where To Go?</h1>
            {places.map((onePlace) =>
                <div key={onePlace._id}>
                    <h3><Link to={`/place/${onePlace._id}`}>{onePlace.name}</Link></h3>
                    <p>{onePlace.tags.join(' / ')} </p>
                    <p>{onePlace.description}</p>
                    <p>Price Range: {onePlace.priceRange.category} , {onePlace.priceRange.averageBHD}BHD average</p>

                </div>
            )}
        </main>
    )
}

export default Allplaces