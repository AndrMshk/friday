import axios from 'axios';

export const instance = axios.create({
  baseURL: process.env.REACT_APP_BACK_URL || '//neko-back.herokuapp.com/2.0/' || 'http://localhost:7542/2.0/',
  withCredentials: true,
});
