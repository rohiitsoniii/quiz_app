import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postData } from "../../api";
import "./SignUp.css";

const SignUp = ({ setActiveTab }) => {


  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'password') {
      checkPasswordStrength(value);
      checkPasswordMatch(value, formData.confirmPassword);
    }

    if (name === 'confirmPassword') {
      checkPasswordMatch(formData.password, value);
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = '';
    if (password.length < 6) {
      strength = 'Weak';
    } else if (password.length < 10) {
      strength = 'Intermediate';
    } else {
      strength = 'Strong';
    }
    setPasswordStrength(strength);
  };

  const checkPasswordMatch = (password, confirmPassword) => {
    if (password && confirmPassword) {
      setPasswordMatch(password === confirmPassword);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        const response = await postData("/user/register", formData); // Adjust the endpoint as necessary
        toast.success("Sign up successful!");
        setActiveTab('login');
       
      } catch (error) {
        toast.error(`Sign up failed: ${error.message}`);
        console.error("Sign up failed:", error.message);
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ToastContainer />

      <div className="signup_main_div">


        <div className="input_filed_text">
          <p>Name</p>
          <input
            type="text"
            name="name"
            className='input'
            value={formData.name}
            onChange={handleChange}
            placeholder={errors.name}
            disabled={loading}
          />
        </div>
        <div className="input_filed_text">
          <p>Email</p>
          <input
            type="text"
            name="email"
            className='input'
            value={formData.email}
            onChange={handleChange}
            placeholder={errors.email}
            disabled={loading}
          />
        </div>
        <div className="input_filed_text">
          <p>PassWord</p>
          <div className="inner_input_div">


            <input
              type="password"
              name="password"
              className={`input ${passwordStrength.toLowerCase()}`}
              value={formData.password}
              onChange={handleChange}
              placeholder={errors.password}
              disabled={loading}
            />
            {passwordStrength && (
              <span className={`strength ${passwordStrength.toLowerCase()}`}>
                {passwordStrength}
              </span>
            )}
          </div>
        </div>
        <div className="input_filed_text">
          <p>Confirm Password</p>
          <div className="inner_input_div">


            <input
              type="password"
              name="confirmPassword"
              className='input'
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
            />
            {!passwordMatch && (
              <span className='error'>Passwords do not match</span>
            )}
            {errors.confirmPassword && <span className='error'>{errors.confirmPassword}</span>}
          </div>
        </div>

      </div>


      <button className='Signup' type="submit" disabled={loading}>
        {loading ? "Signing up..." : "Sign Up"}
      </button>
    </form>
  );
};

export default SignUp;
