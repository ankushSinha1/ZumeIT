import axios from 'axios';
export const rootRoute = axios.create({
    baseURL: 'http://localhost:4000/',
})
