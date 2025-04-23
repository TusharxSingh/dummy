import React from 'react';
import LoginForm from '../components/LoginForm';
import '../styles/Login.css'; // optional if you want to add custom styles

const Login = () => {
  return (
    <div className="container-fluid vh-100 d-flex p-0">
      <div className="col-md-6 p-0 d-none d-md-block">
          <img
      src="/thapar.png"
      alt="campus"
      className="img-fluid h-100 w-100 object-fit-cover"
    />
      </div>
      <div className="col-md-6 d-flex align-items-center justify-content-center bg-light">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
