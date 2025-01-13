import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="container mt-5">
      <div className="jumbotron">
      <h1 className="display-4">Welcome to the Health Clinic</h1>
      <p className="lead">Explore our collection of books and resources.</p>
      <hr className="my-4" />
      <p>Sign in to access your account and manage your appointments.</p>
      </div>
    </div>
  );
};

export default HomePage;
