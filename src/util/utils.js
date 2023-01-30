import axios from 'axios';
import Config from 'react-native-config';

console.log('Config');
console.log(Config);

const Backend = axios.create({
  baseURL: Config.REACT_APP_API_URL,
  withCredentials: true,
});

export { Backend };
