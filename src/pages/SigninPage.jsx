// src/components/SignInForm/SignInForm.jsx

import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router';

import { signIn } from '../services/authService';
import { useAuth } from '../context/AuthContext'; 
import styles from '../styles/SigninPage.module.css'


const SignInForm = ({}) => {
  const {setUser} = useAuth()
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  function handleChange(event){
    setFormData({ ...formData, [event.target.name]: event.target.value });


  }

  async function handleSubmit(event){
    event.preventDefault();
    try {
      const signedInUser = await signIn(formData);

      setUser(signedInUser);
      navigate('/recommended');
    } catch (err) {
      console.log(`Error: ${err}`)
      setError(err?.response?.data?.message);
    }
  };

  return (
    <main className={styles.main}>
      <h1>Welcome back!</h1>
      <p>Don't have an account? <span className={styles.link} onClick={() => navigate("/sign-up")}>Sign Up</span></p>
      <p className='error'>{error}</p>
      <div className={styles.content}>
      <form autoComplete='off' onSubmit={handleSubmit} className={styles.SignInForm}>
        <div className={styles.formElement}>
          <label htmlFor='email'>Email</label>
          <input
            type='text'
            autoComplete='off'
            id='email'
            placeholder='example@domain.com'
            value={formData.email}
            name='email'
            onChange={handleChange}
            required
            className={styles.formInput}
          />
        </div>
        <div className={styles.formElement}>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            autoComplete='off'
            id='password'
            value={formData.password}
            name='password'
            onChange={handleChange}
            required
            className={styles.formInput}

          />
        </div>
        <div className={styles.btnContainer}>
          <button className={styles.btnSign}>Sign In</button>
          
          <button className={styles.btnCancel}  onClick={() => navigate('/')}>Cancel</button>
        </div>
      </form>
      <img src="\src\images\BAHRAIN GATE.jpg" alt="" />
      </div>
    </main>
  );
};

export default SignInForm;

