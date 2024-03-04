import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const baseURL = 'http://127.0.0.1:8000/api';

const busApi = axios.create({ baseURL });

busApi.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    }
)

export default busApi;
