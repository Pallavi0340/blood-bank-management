
import React from 'react';
import Form from '../../components/shared/Form/Form';
import { useSelector } from 'react-redux';
import Spinner from '../../components/shared/Spinner';
import './Login.css';

const Login = () => {
  const { loading, error } = useSelector((state) => state.auth);

  return (
    <div className="login-page">
      <div className="login-background" />

      <div className="login-overlay" />

      <div className="login-content">
        <div className="login-brand">
          <h1>Vital Drop</h1>
          <p>Donate blood. Save lives.</p>
        </div>

        <div className="login-card">
          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          {loading ? (
            <Spinner />
          ) : (
            <Form
              formTitle="Welcome Back"
              submitButton="Login"
              formType="login"
            />
          )}
        </div>

        <p className="login-footer">
          Every drop counts. Every life matters.
        </p>
      </div>
    </div>
  );
};

export default Login;
