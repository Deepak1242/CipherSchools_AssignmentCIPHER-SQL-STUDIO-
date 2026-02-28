import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from './Button';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <Link to="/assignments" className="navbar__brand">
          CipherSQLStudio
        </Link>
        <div className="navbar__nav">
          {user && (
            <>
              <div className="navbar__user">
                <span className="navbar__username">{user.name}</span>
                <Button size="small" variant="secondary" onClick={logout}>
                  Logout
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
