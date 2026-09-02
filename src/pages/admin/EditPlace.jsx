import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import { Flex, Spin } from 'antd'
import { updatePlace, getOnePlace } from '../../services/placeService'
import styles from '../../styles/EditPlace.module.css'

function EditPlace() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { placeId } = useParams()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        priceRange: {
            category: '',
            averageBHD: ''
        },
        tags: '',
        location: {
            lat: '',
            long: ''
        }

    })


    function handleChange(event) {
        const { name, type, value, checked } = event.target;

        if (name.includes('.')) {
            const [groupValue, fieldValue] = name.split('.')
            setFormData((prev) => ({
                ...prev,
                [groupValue]: { ...prev[groupValue], [fieldValue]: value }
            }))

        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            }));
        }
    }

    async function handleSubmit(event) {
        try {
            event.preventDefault()
            const tagsArray = formData.tags.split(',').map((oneTag) => oneTag.trim())
            const locationInfo = {
                type: 'Point',
                coordinates: [Number(formData.location.long), Number(formData.location.lat)]
            }

            const res = await updatePlace(placeId, { ...formData, tags: tagsArray, location: locationInfo })
            navigate('/admin/place')

        } catch (err) {
            setError(err?.response?.data?.message)
        }
    }

    
    async function handleCancel(){
        try {
            navigate(`/admin/place`)
        } catch (err) {
            setError(err?.response?.data?.message)
            
        }
    }

    async function loadDetails() {
        try {
            setLoading(true)
            setError(false)

            const res = await getOnePlace(placeId)
            setFormData({ ...res, tags: res.tags.join(', '), location:{
                long:res.location.coordinates[0],
                lat: res.location.coordinates[1]
            } })
        } catch (err) {
            setError(err?.response?.data?.message)

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadDetails()
    }, [])

    if (loading) return <Flex align='center' gap='medium' justify='center'>
        <Spin size='large' description='Loading...' />
    </Flex>
    if (error) return <p>ERROR: {error}</p>

    return (
        <main className={styles.main}>
            <h1>Edit Place</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formElement}>
                    <label htmlFor='name'>Name:</label>
                    <input
                        type='text'
                        name='name'
                        id='name'
                        value={formData.name}
                        autoComplete='off'
                        onChange={handleChange}
                        required
                        className={styles.formInput}
                    ></input>
                </div>

                <div className={styles.formElement}>
                    <label htmlFor='category'>Category:</label>
                    <select
                        type='text'
                        name='category'
                        id='category'
                        value={formData.category}
                        autoComplete='off'
                        onChange={handleChange}
                        required
                        className={styles.formInput}
                    >
                        <option value=''>-Select Category-</option>
                        <option value='cafe'>Cafe</option>
                        <option value='restaurant'>Restaurant</option>
                        <option value='event'>Event</option>
                        <option value='cinema'>Cinema</option>
                        <option value='shopping'>Shopping</option>
                        <option value='bookstore'>Bookstore</option>
                        <option value='sports'>Sports</option>
                        <option value='activity'>Activity</option>
                        <option value='workshop'>Workshop</option>
                        <option value='gallery'>Gallery</option>
                        <option value='park'>Park</option>
                        <option value='museum'>Museum</option>
                        <option value='other'>Other</option>
                    </select>
                </div>

                <div className={styles.formElement}>
                    <label htmlFor='description'>Description:</label>
                    <textarea
                        name='description'
                        id='description'
                        value={formData.description}
                        autoComplete='off'
                        onChange={handleChange}
                        required
                        className={styles.formTextarea}
                    ></textarea>
                </div>

                <div className={styles.formElement}>
                    <label htmlFor='priceRangeCategory'>Price Range - Category:</label>
                    <select
                        id='priceRangeCategory'
                        name='priceRange.category'
                        value={formData.priceRange.category}
                        autoComplete='off'
                        onChange={handleChange}
                        required
                        className={styles.formInput}
                    >
                        <option value=''>-Select Category-</option>
                        <option value='affordable'>Affordable</option>
                        <option value='midrange'>MidRange</option>
                        <option value='premium'>Premium</option>

                    </select>
                </div>

                <div className={styles.formElement}>
                    <label htmlFor='priceRangeAverageBHD'>Price Range - Average BHD:</label>
                    <input
                        type='number'
                        name='priceRange.averageBHD'
                        id='priceRangeAverageBHD'
                        value={formData.priceRange.averageBHD}
                        autoComplete='off'
                        onChange={handleChange}
                        required
                        className={styles.formInput}
                    ></input>
                </div>
                <div className={styles.formElement}>
                    <label htmlFor='tags'>Tags:</label>
                    <input
                        type='text'
                        name='tags'
                        id='tags'
                        value={formData.tags}
                        autoComplete='off'
                        onChange={handleChange}
                        required
                        placeholder='Separate tags with a comma'
                        className={styles.formInput}
                    ></input>
                </div>

                 <div className={styles.formElement}>
                    <label htmlFor='location.lat'>Location Latitude:</label>
                    <input
                        type='number'
                        name='location.lat'
                        id='location.lat'
                        value={formData.location.lat}
                        autoComplete='off'
                        onChange={handleChange}
                        required
                        className={styles.formInput}
                    ></input>
                </div>

                <div className={styles.formElement}>
                    <label htmlFor='location.long'>Location Longitude:</label>
                    <input
                        type='number'
                        name='location.long'
                        id='location.long'
                        value={formData.location.long}
                        autoComplete='off'
                        onChange={handleChange}
                        required
                        className={styles.formInput}
                    ></input>
                </div>

                <div className={styles.btnContainer}>
                <button className={styles.btnCancel} type='button' onClick={() => handleCancel()}>Cancel</button>
                <button className={styles.btnSubmit} type='submit'>Submit</button>
           </div>
           
            </form>
        </main>
    )
}

export default EditPlace