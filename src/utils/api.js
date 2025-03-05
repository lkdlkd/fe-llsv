import axios from 'axios';

const API_URL = `${process.env.REACT_APP_URL}/api`;

export const api = axios.create({
  baseURL: API_URL,
});