import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import { Flex, Spin, Typography, Tag } from 'antd'
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { createInvite, getAllInvites } from '../../services/inviteService'

function CreateInvite() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { planId } = useParams()
    const [invites, setInvites] = useState([])
    const [formData, setFormData] = useState({
        status: '',
        username: ''
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const { Paragraph } = Typography
    const options = {
        timeZone: 'Asia/Bahrain',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    }

    function tagStatus(status) {
        if (status === 'pending') {
            return <Tag color='warning' icon={<ClockCircleOutlined />}>Pending</Tag>
        }
        else if (status === 'accepted') {
            return <Tag color='success' icon={< CheckCircleOutlined />}>Accepted</Tag>
        }
        else {
            return <Tag color='error' icon={<CloseCircleOutlined />}>Rejected</Tag>
        }
    }

    async function loadInvite() {
        try {
            setLoading(true)
            setError(false)

            const res = await getAllInvites(planId)
            setInvites(res)

        } catch (err) {
            setError(err?.response?.data?.message)
        } finally {
            setLoading(false)
        }
    }

    function handleChange(event) {
        const { name, type, value, checked } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    async function handlesubmit(event) {
        try {
            event.preventDefault()
            await createInvite(planId, formData.username)
            setFormData({
                status: '', 
                username: ''
            })
           loadInvite()

        } catch (err) {
            setError(err?.response?.data?.message)
        }
    }
    useEffect(() => {
        loadInvite()

    }, [])

    if (loading) return <Flex align='center' gap='medium' justify='center'>
        <Spin size='large' description='Loading...' />
    </Flex>
    if (error) return <p>ERROR: {error}</p>
    return (

        <main>
           <form onSubmit={handlesubmit}>
            <div>
                <label htmlFor='username'>Send To:</label>
                <input type='text' id='username' name='username' value={formData.username} autoComplete='off' onChange={handleChange} required></input>
            </div>
            <button type='submit'>Invite Friends</button>
           </form>
           <hr></hr>
           <h3>Invitations</h3>
          {invites.length === 0 ? <p>You have no invites yet - Invite friends Now!</p>
                : invites.map((oneInvite) =>{   
                    return (
                        <div key={oneInvite._id}>
                            <h4>{oneInvite.user.username}</h4>
                            {tagStatus(oneInvite.status)}
                           
                        </div>
                    )
                  }
          )}     
        </main>
    )
}

export default CreateInvite