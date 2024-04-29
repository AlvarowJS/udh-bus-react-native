import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Platform } from "react-native";

let baseURL
// const baseURL = 'http://127.0.0.1:8000/api';
// const baseURL = 'http://10.0.2.2:8000/api';
// const baseURL = 'http://161.132.39.123:81/api';
if (Platform.OS === 'ios') {
    baseURL = 'http://127.0.0.1:8000/api';
} else if (Platform.OS === 'android') {
    baseURL = 'http://10.0.2.2:8000/api';
}

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
