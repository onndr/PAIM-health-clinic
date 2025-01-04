import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';
import BookService from '../services/BookService';
import { useAuth } from '../context/AuthContext';

const UserDetailPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loans, setLoans] = useState<any>([]);
  const { isLoggedIn, isLibrarian, logout } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }

    UserService.getCurrentUserDetails().then((response) => {
      setUser(response.data);

      BookService.getLoans().then((response) => {
        setLoans(response);
      }).catch((error) => {
        console.error('Error:', error);
        alert('Failed to fetch loans');
      });

    }).catch((error) => {
      console.error('Error:', error);
      alert('Failed to fetch user details');
    });

  }, [isLoggedIn]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    UserService.updateUser(user).then((response: any) => {
      // check if response contains book data
      if (response.data.id) {
        alert('Your account details updated successfully');
      } else {
        alert('Failed to update book');
      }
    }).catch((error) => {
      console.error('Error:', error);
      if (error.status === 409) {
        alert('The book has been updated in another transaction. Please refresh the page.');
      }
    });
  };

  const isElligibleToDeleteAccount = () => {
    return loans.filter((loan: any) => loan.user_id === user.id && (loan.status === 'TAKEN' || loan.status === 'RESERVED')).length === 0;
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Account Detail</h1>
      {user && (
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
        <label htmlFor="title" className="form-label">Username</label>
        <input type="text" className="form-control" id="username" name="username" value={user.username} onChange={handleChange} />
        </div>
        <div className="mb-3">
        <label htmlFor="author" className="form-label">Email</label>
        <input type="text" className="form-control" id="email" name="email" value={user.email} onChange={handleChange} />
        </div>
        <div className="mb-3">
        <label htmlFor="publication_date" className="form-label">First name</label>
        <input type="text" className="form-control" id="first_name" name="first_name" value={user.first_name} onChange={handleChange} />
        </div>
        <div className="mb-3">
        <label htmlFor="publication_date" className="form-label">Last name</label>
        <input type="text" className="form-control" id="last_name" name="last_name" value={user.last_name} onChange={handleChange} />
        </div>
        <div className="mb-3">
        <label htmlFor="price" className="form-label">Phone number</label>
        <input type="text" className="form-control" id="phone_number" name="phone_number" value={user.phone_number} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary">Update</button>
      </form>
      )}
      {!isLibrarian && (<input type="button" className="btn btn-danger" value="Delete account" onClick={() => {
        if (!isElligibleToDeleteAccount()) {
        alert('You have active loans or reservations. Please return or cancel them before deleting your account.');
        return;
        }
        UserService.deleteMe().then(() => {
        logout();
        navigate('/');
        alert('Account deleted successfully');
        }).catch((error) => {
        console.error('Error:', error);
        alert('Failed to delete account');
        });
    }} />)}
    </div>
  );
};

export default UserDetailPage;
