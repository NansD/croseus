import React from 'react';
import { Link } from 'react-router-dom';
import NAVIGATION from '../../navigation.json';

export default function UnauthenticatedNavBar({ setShowMenu }) {
  return (
    <div className="navbar-end">
      <div className="navbar-item">
        <div className="buttons">
          <Link to={NAVIGATION.SIGNUP} onClick={() => setShowMenu(false)} className="button is-primary">
            <strong>Sign up</strong>
          </Link>
          <Link to={NAVIGATION.LOGIN} onClick={() => setShowMenu(false)} className="button is-light">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}