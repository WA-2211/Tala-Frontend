import { useState } from "react";
import { useNavigate } from "react-router";
import { signUp } from "../services/authService";
import styles from '../styles/SignupPage.module.css'
function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConf: "",
  });
  const [ submitting, setSubmitting ] = useState(false)

  const { username,email, password, passwordConf } = formData;

  function handleChange(event){
    setError("");
    setFormData({ ...formData, [event.target.name]: event.target.value });

  }


  async function handleSubmit(event){
    event.preventDefault();
    try {
      setSubmitting(true)
      await signUp(formData);
      navigate('/sign-in')
    } catch (err) {
      setError(err.response.data.message);
      setSubmitting(false)
    }
  }

  function isFormInvalid(){
    return !(username && email && password && password === passwordConf);
  };

  return (
    <main className={styles.main}>
      <h1>Create New Account</h1>
      <p className={styles.error}>{error}</p>
      <p>Already have an account? <span className={styles.link} onClick={() => navigate("/sign-in")}>Sign In</span></p>
      <div className={styles.content}>
      <img src='\src\images\image1.jpg' alt="" />
      <form onSubmit={handleSubmit} className={styles.formSignUp}>
        <div className={styles.formElement}>
          <label htmlFor="username" className={styles.formLabel}>Username</label>
          <input
            type="text"
            id="username"
            value={username}
            name="username"
            onChange={handleChange}
            required
            className={styles.formInput}
          />
        </div>
        <div className={styles.formElement}> 
          <label htmlFor="email" className={styles.formLabel}>Email</label>
          <input
            type="email"
            placeholder="example@domain.com"
            pattern="[^@\s]+@[^@\s]+\.[^@\s]+" title="Invalid email address!"
            id="email"
            value={email}
            name="email"
            onChange={handleChange}
            required
            className={styles.formInput}
          />
        </div>
        <div className={styles.formElement}>
          <label htmlFor="password" className={styles.formLabel}>Password</label>
          <input
            type="password"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            title="Must be a minimum of 8 characters and include at least one number, as well as both uppercase and lowercase letters!"
            id="password"
            value={password}
            name="password"
            onChange={handleChange}
            required
            className={styles.formInput}
          />
        </div>
        <div className={styles.formElement}>
          <label htmlFor="confirm" className={styles.formLabel}>Confirm Password</label>
          <input
            type="password"
            id="confirm"
            value={passwordConf}
            name="passwordConf"
            onChange={handleChange}
            required
            className={styles.formInput}
          />
        </div>
        <div className={styles.btnContainer}>
          <button className={styles.btnSign} disabled={isFormInvalid() || submitting}>{submitting ? 'Signing up...' : 'Sign Up'}</button>
          <button className={styles.btnCancel} onClick={() => navigate("/")}>Cancel</button>
        </div>
      </form>
      </div>
    </main>
  );
}
export default Signup;
