import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; // Import Toast components
import 'react-toastify/dist/ReactToastify.css'; // Import Toast CSS
import './SignupLoginForm.css'; 
import Dashboard from './components/tickets/UserTicketDashboard';
import Admin from './components/tickets/AdminDashboard'
import AgentDashboard from './components/tickets/AgentDashboard';

const SignupLoginPage = () => {
  const [signupData, setSignupData] = useState({ username: '', email: '', password: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');

    if (signUpButton && signInButton && container) {
      signUpButton.addEventListener('click', () => {
        container.classList.add("right-panel-active");
      });

      signInButton.addEventListener('click', () => {
        container.classList.remove("right-panel-active");
      });
    }

    return () => {
      if (signUpButton && signInButton) {
        signUpButton.removeEventListener('click', () => {});
        signInButton.removeEventListener('click', () => {});
      }
    };
  }, []);

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData({ ...signupData, [name]: value });
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3306/users/signup', signupData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      setMessage(response.data.message); // Handle success response
      setIsError(false);
      toast.success(response.data.message); // Show success toast notification
      setSignupData({ username: '', email: '', password: '' });
      document.getElementById('container').classList.remove("right-panel-active");
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Signup failed. Please try again.';
      setMessage(errorMsg); 
      setIsError(true);
      toast.error(errorMsg); // Show error toast notification
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3306/users/login', loginData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      let userRole = response.data.userRole;
      console.log('userROLES',userRole)
      localStorage.setItem('token', response.data.token);
      console.log('response.data.userRole',response.data.userRole)
      localStorage.setItem('userRole', response.data.userRole); // Store the role in localStorage
      setMessage(`Login successful: ${response.data.message}`);
      setIsError(false);
      toast.success(response.data.message); // Show success toast notification
      // toast.success('Login successful!');
    // Redirect to the appropriate dashboard based on role
      if (userRole === 'admin') {
        //window.location.href = '/Admin';
         navigate('/admin');
        
      } 
      else if(userRole === 'agent'){
        navigate('/agent')
      }
      else {
        // window.location.href = '/Dashboard';
         navigate('/dashboard');
      }

       // window.location.href = '/Dashboard';
      }
      catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed. Please try again.';
      setMessage(errorMsg);
      setIsError(true);
      toast.error(errorMsg); // Show error toast notification
    }
  };

  return (
    <div className="container" id="container">
      <div className="form-container sign-up-container">
        <form onSubmit={handleSignupSubmit}>
          <h1>Create Account</h1>
          <div className="social-container">
            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
          </div>
          <span>or use your email for registration</span>
          <input type="text" placeholder="Name" name="username" value={signupData.username} onChange={handleSignupChange} required />
          <input type="email" placeholder="Email" name="email" value={signupData.email} onChange={handleSignupChange} required />
          <input type="password" placeholder="Password" name="password" value={signupData.password} onChange={handleSignupChange} required />
          <button type="submit">Sign Up</button>
        </form>
      </div>
      <div className="form-container sign-in-container">
        <form onSubmit={handleLoginSubmit}>
          <h1>Sign in</h1>
          <div className="social-container">
            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
          </div>
          <span>or use your account</span>
          <input type="email" placeholder="Email" name="email" value={loginData.email} onChange={handleLoginChange} required />
          <input type="password" placeholder="Password" name="password" value={loginData.password} onChange={handleLoginChange} required />
          <a href="#">Forgot your password?</a>
          <button type="submit">Sign In</button>
        </form>
      </div>
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button className="ghost" id="signIn">Sign In</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Ticket Managment System!</h1>
            <p>Enter your personal details and start your journey with us</p>
            <button className="ghost" id="signUp">Sign Up</button>
          </div>
        </div>
      </div>
      {/* Toast Container for displaying messages */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      {message && (
        <p style={{ color: isError ? 'red' : 'green' }}>{message}</p>
      )}
    </div>
  );
};

export default SignupLoginPage;
