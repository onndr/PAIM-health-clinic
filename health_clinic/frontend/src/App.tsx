import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './components/HomePage';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import AppointmentListPage from './components/AppointmentListPage'; // Strona do listy wizyt
import AppointmentDetailPage from './components/AppointmentDetailPage'; // Strona szczegółów wizyty
import AddAppointmentPage from './components/AddAppointmentPage'; // Strona dodawania wizyty
import UserDetailPage from './components/UserDetailPage'; // Strona szczegółów użytkownika
import './App.css';
import { useAuth } from './context/AuthContext';

const App: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <Router>
      <header>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">Health Clinic</Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                {isLoggedIn ? (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/appointments">Appointments</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/me">Account</Link>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#" onClick={logout}>Logout</a>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/login">Login</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/register">Register</Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/appointments" element={<AppointmentListPage />} /> {/* Lista wizyt */}
        <Route path="/appointments/add" element={<AddAppointmentPage />} /> {/* Dodawanie wizyty */}
        <Route path="/appointments/:id" element={<AppointmentDetailPage />} /> {/* Szczegóły wizyty */}
        <Route path="/me" element={<UserDetailPage />} /> {/* Dane użytkownika */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App;
