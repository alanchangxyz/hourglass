import React, { createContext, useContext, useState, useEffect } from 'react';
// import { auth } from '../firebase';
import { useBackend } from './Backend';
import { ALANS_EMAIL, OLIVIAS_EMAIL } from '@env';

const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

const USERS = [ALANS_EMAIL, OLIVIAS_EMAIL]; // TODO Replace placeholder

const AuthProvider = ({ children }) => {
  // TODO Replace with firebase auth
  const changeUser = async email => {
    try {
      const { data: user } = await backend.get(`/users/by-email/${email}`);
      console.log('user switched to', user);
      setCurrentUser(user);
    } catch (e) {
      console.log(e);
    }
  };

  const { backend } = useBackend();
  const [currentUser, setCurrentUser] = useState(() => changeUser(USERS[0]));
  const [loading, setLoading] = useState(true);

  // const signup = (email, password) => auth.createUserWithEmailAndPassword(email, password);
  // const login = (email, password) => auth.signInWithEmailAndPassword(email, password); // may have to change depending on server
  // const logout = async () => {
  //   await auth.signOut();
  //   navigate('/login');
  // };

  useEffect(() => {
    setLoading(false);
  }, []);
  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged(user => {
  //     setCurrentUser(user);
  //     setLoading(false);
  //   });

  //   return unsubscribe;
  // }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        changeUser,
        // signup,
        // login,
        // logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuth };
