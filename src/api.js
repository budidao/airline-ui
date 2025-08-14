import axios from 'axios';

export const checkVouchers = (data) => axios.post('/api/check', data);
export const generateVouchers = (data) => axios.post('/api/generate', data);
export const regenerateVouchers = (data) => axios.post('/api/regenerate', data);
