
import React from 'react';
import Form from '../../components/shared/Form/Form';
import { useSelector } from 'react-redux';
import Spinner from '../../components/shared/Spinner';
import './Login.css';

const Register = () => {
  const { loading, error } = useSelector((state) => state.auth);

  return (
    <div className="login-page register-page">
      <div className="login-background" />
      <div className="login-overlay" />

      <div className="login-content register-content">
        <div className="login-brand">
          <h1>Vital Drop</h1>
          <p>Join us. Help save lives.</p>
        </div>

        <div className="login-card register-card">
          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          {loading ? (
            <Spinner />
          ) : (
            <Form
              formTitle="Create Your Account"
              submitButton="Register"
              formType="register"
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

export default Register;
