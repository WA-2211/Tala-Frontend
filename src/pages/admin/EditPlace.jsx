import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import { Flex, Spin } from 'antd'
import { updatePlace, getOnePlace } from '../../services/placeService'

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
        tags: ''
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
            const res = await updatePlace(placeId, { ...formData, tags: tagsArray })
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
            setFormData({ ...res, tags: res.tags.join(', ') })
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
        <main>
            <h1>Edit Place</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='name'>Name:</label>
                    <input
                        type='text'
                        name='name'
                        id='name'
                        value={formData.name}
                        autoComplete='off'
                        onChange={handleChange}
                        required
                    ></input>
                </div>

                <div>
                    <label htmlFor='category'>Category:</label>
                    <select
                        type='text'
                        name='category'
                        id='category'
                        value={formData.category}
                        autoComplete='off'
                        onChange={handleChange}
                        required
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

                <div>
                    <label htmlFor='description'>Description:</label>
                    <textarea
                        name='description'
                        id='description'
                        value={formData.description}
                        autoComplete='off'
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>

                <div>
                    <label htmlFor='priceRangeCategory'>Price Range - Category:</label>
                    <select
                        id='priceRangeCategory'
                        name='priceRange.category'
                        value={formData.priceRange.category}
                        autoComplete='off'
                        onChange={handleChange}
                        required
                    >
                        <option value=''>-Select Category-</option>
                        <option value='affordable'>Affordable</option>
                        <option value='midrange'>MidRange</option>
                        <option value='premium'>Premium</option>

                    </select>
                </div>

                <div>
                    <label htmlFor='priceRangeAverageBHD'>Price Range - Average BHD:</label>
                    <input
                        type='number'
                        name='priceRange.averageBHD'
                        id='priceRangeAverageBHD'
                        value={formData.priceRange.averageBHD}
                        autoComplete='off'
                        onChange={handleChange}
                        required
                    ></input>
                </div>
                <div>
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
                    ></input>
                </div>
                <button type='button' onClick={() => handleCancel()}>Cancel</button>
                <button type='submit'>Submit</button>
            </form>
        </main>
    )
}

export default EditPlace