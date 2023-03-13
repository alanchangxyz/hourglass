import axios from 'axios';
import React, { createContext, useContext } from 'react';
import { REACT_APP_API_URL_PROD } from '@env';

const baseURL = REACT_APP_API_URL_PROD;
console.log('backend baseURL is', REACT_APP_API_URL_PROD);

const BackendContext = createContext();
const useBackend = () => useContext(BackendContext);

const BackendProvider = ({ children }) => {
  const backend = axios.create({
    baseURL,
    withCredentials: false,
  });

  return <BackendContext.Provider value={{ backend }}>{children}</BackendContext.Provider>;
};

export { BackendProvider, useBackend };
