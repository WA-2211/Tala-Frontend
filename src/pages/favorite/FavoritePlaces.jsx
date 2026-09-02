import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import { Flex, Spin } from 'antd'
import { getAllFavorites, deleteFavorite } from '../../services/favoriteService'
import styles from '../../styles/FavoritePlaces.module.css'

function FavoritePlaces() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [favorites, setFavorites] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    async function handleRemoveFavorite(favoriteId){
    
        try {
        await deleteFavorite(favoriteId)
        setFavorites(favorites.filter((oneFavorite) => oneFavorite._id !== favoriteId))
        } catch (err) {
                        setError(err?.response?.data?.message)

        }
    }

    async function loadFavorites() {
        try {
            setLoading(true)
            setError(false)

            const res = await getAllFavorites()
            setFavorites(res)
        } catch (err) {
            setError(err?.response?.data?.message)

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadFavorites()
    }, [])

    if (loading) return <Flex align='center' gap='medium' justify='center'>
        <Spin size='large' description='Loading...' />
    </Flex>
    if (error) return <p>ERROR: {error}</p>
    return (
        <main className={styles.main}>
            <h1>Your Favorite Places</h1>
              {favorites.length === 0 ? <p>You have not favorited any places yet - Explore Now!</p>
                        :favorites.map((oneFavorite) =>
                            <div key={oneFavorite._id} className={styles.favoritesContainer}>
                                <h3><Link to={`/place/${oneFavorite.place._id}`}>{oneFavorite.place.name}</Link></h3>
                                <button onClick={() => handleRemoveFavorite(oneFavorite._id)} className={styles.btn}>Remove from Favorites</button>
                            </div>
                        )}
        </main>
    )
}

export default FavoritePlaces