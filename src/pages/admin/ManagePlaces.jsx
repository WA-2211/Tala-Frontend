import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import { Flex, Spin } from 'antd'
import { getAllPlaces, deletePlace } from '../../services/placeService'
import styles from '../../styles/ManagePlaces.module.css'

function ManagePlaces() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [places, setPlaces] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    async function loadPlaces() {
        try {
            setLoading(true)
            setError(false)

            const res = await getAllPlaces()
            setPlaces(res)
        } catch (err) {
            setError(err?.response?.data?.message)

        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(placeId) {
        try {
            await deletePlace(placeId)
            loadPlaces()
        } catch (err) {
            setError(err?.response?.data?.message)

        }
    }

    async function handleEdit(placeId){
        try {
            navigate(`/admin/place/${placeId}/edit`)
        } catch (err) {
            setError(err?.response?.data?.message)
            
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
            <h1>Manage Places</h1>
            <Link to='/admin/place/create' className={styles.addLink}>Add New Place</Link>
            {places.map((onePlace) =>
                <div key={onePlace._id} className={styles.placeContainer}>
                    <h3><Link to={`/place/${onePlace._id}`}>{onePlace.name}</Link></h3>
                    
                    <div className={styles.btnContainer}>
                    <button className={styles.btnDelete} onClick={() => handleDelete(onePlace._id)}>Delete</button>
                    <button className={styles.btnEdit} onClick={() => handleEdit(onePlace._id)}>Edit</button>
                    </div>
                    
                    <p className={styles.tags}>{onePlace.tags.join(' / ')} </p>
                    <p className={styles.description}>{onePlace.description}</p>
                    <p className={styles.price}>Price Range: {onePlace.priceRange.category} , {onePlace.priceRange.averageBHD}BHD average</p>

                </div>
            )}
        </main>
    )
}

export default ManagePlaces