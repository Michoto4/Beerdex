import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsername } from "../helper/helper";
import Landing from './Landing/Landing';

export default function Intersection() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setChecking(false);
      return;
    }

    getUsername()
      .then((user) => {
        if (user && user.username) {
          setIsAuth(true);
          navigate('/home', { replace: true });
        } else {
          localStorage.removeItem('token');
          setChecking(false);
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        setChecking(false);
      });
  }, [navigate]);

  if (checking || isAuth) {
    return null;
  }

  return <Landing />;
}