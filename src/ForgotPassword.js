import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; // Import Toast components
import 'react-toastify/dist/ReactToastify.css'; // Import Toast CSS
import './SignupLoginForm.css'; 

const ForgotPassword = () => {
//   const [signupData, setSignupData] = useState({ username: '', email: '', password: '',confirmPassword:'' });
// //   const [loginData, setLoginData] = useState({ email: '', password: '' });
//   const [message, setMessage] = useState('');
//   const [isError, setIsError] = useState(false);

//   useEffect(() => {
//     const signUpButton = document.getElementById('signUp');
//     const signInButton = document.getElementById('signIn');
//     const container = document.getElementById('container');

//     if (signUpButton && signInButton && container) {
//       signUpButton.addEventListener('click', () => {
//         container.classList.add("right-panel-active");
//       });

//       signInButton.addEventListener('click', () => {
//         container.classList.remove("right-panel-active");
//       });
//     }

//     return () => {
//       if (signUpButton && signInButton) {
//         signUpButton.removeEventListener('click', () => {});
//         signInButton.removeEventListener('click', () => {});
//       }
//     };
//   }, []);

//   const handleSignupChange = (e) => {
//     const { name, value } = e.target;
//     setSignupData({ ...signupData, [name]: value });
//   };

//   const handleLoginChange = (e) => {
//     const { name, value } = e.target;
//     setLoginData({ ...loginData, [name]: value });
//   };

//   const handleSignupSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:3306/users/signup', signupData, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         withCredentials: true,
//       });
//       setMessage(response.data.message); // Handle success response
//       setIsError(false);
//       toast.success(response.data.message); // Show success toast notification
//       setSignupData({ username: '', email: '', password: '' });
//       document.getElementById('container').classList.remove("right-panel-active");
//     } catch (error) {
//       const errorMsg = error.response?.data?.message || 'Signup failed. Please try again.';
//       setMessage(errorMsg); 
//       setIsError(true);
//       toast.error(errorMsg); // Show error toast notification
//     }
//   };

//   const handleLoginSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:3306/users/login', loginData, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         withCredentials: true,
//       });
//       setMessage(`Login successful: ${response.data.message}`);
//       setIsError(false);
//       toast.success(response.data.message); // Show success toast notification
//     } catch (error) {
//       const errorMsg = error.response?.data?.message || 'Login failed. Please try again.';
//       setMessage(errorMsg);
//       setIsError(true);
//       toast.error(errorMsg); // Show error toast notification
//     }
//   };

  return (
    <div>Forgot password</div>
  );
};

export default ForgotPassword;