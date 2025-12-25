import { API_URL } from '@/constants/config';
import ServiceError from '@/errors/ServiceError';
import axios, { isAxiosError } from 'axios';

//interfaces body request
export interface RegisterPayload {
    email: string;
    password: string;
}
export interface LoginPayload {
    email: string;
    password: string;
}
//interfaces body response
export interface AuthData {
    token: string;
    userId: string;
}

export interface LoginResponse{
    success: boolean;
    data: AuthData;
}
export interface RegisterResponse{
    success: boolean;
    data: AuthData;
};

export default function getAuthService() {
    const apiClient = axios.create({
        baseURL: `${API_URL}/auth`,
    })

    //funciones register y login
    async function register(RegisterPayload: RegisterPayload) {
        try {
        const response = await apiClient.post('/register', RegisterPayload) //en caso de que este dato pase se retorna la response data
        return response.data;
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                if (error.response.status === 401) {
                    throw new ServiceError('Email o Password incorrectos')
                } else  {
                    throw new ServiceError(`Cliente falló con estatus ${error.response.status}`)
                }
            }
            console.log(error); 
            throw error;
        }
    }
    async function login(LoginPayload: LoginPayload) {
        try {
        const response = await apiClient.post('/login', LoginPayload) //en caso de que este dato pase se retorna la response data
        return response.data;
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                if (error.response.status === 401) {
                    throw new ServiceError('Email o Password incorrectos')
                } else  {
                    throw new ServiceError(`Cliente falló con estatus ${error.response.status}`)
                }
            }
            console.log(error);
            throw error;
        }
    }

    return {
        register,
        login,
    }
}
/* response body ejemplo
{
  "success": true,
  "data": {
    "user": {
      "id": "fyeFisqiR1ohtTsNZxpC3",
      "email": "lennybrm@gmail.com",
      "createdAt": "2025-12-13T02:51:37.708Z",
      "updatedAt": "2025-12-13T02:51:37.708Z"
    },
    "token": "eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Imxlbm55YnJtQGdtYWlsLmNvbSIsInN1YiI6ImZ5ZUZpc3FpUjFvaHRUc05aeHBDMyIsImlhdCI6MTc2NTU5OTcxMSwiZXhwIjoxNzY2MjA0NTExfQ.YjWryP_eP3g-RvqaBwXFY0Vcj8_EwhkVa1LWcYYep6c"
  }
}
*/