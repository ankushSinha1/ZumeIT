import axios from 'axios';
export const rootRoute = axios.create({
    baseURL: 'https://zumeit-server.onrender.com',
})
