import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { GraphQLClient } from 'graphql-request';

let BASE_URL = ''
if (process.env.NODE_ENV === 'development') {
  BASE_URL = 'http://localhost:8080/v1'
} else {
  BASE_URL = 'https://railstutorialapi.herokuapp.com/v1'
}

axios.defaults.xsrfCookieName = 'CSRF-TOKEN';

axios.defaults.xsrfHeaderName = 'X-CSRF-Token';

axios.defaults.withCredentials = true;

const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'x-lang': 'EN'
  },
});

API.interceptors.request.use(
  function (config: AxiosRequestConfig) {
    if (
      localStorage.getItem('token') && localStorage.getItem('token') !== 'undefined'
    ) 
    {
      config.headers!.Authorization = `Bearer ${localStorage.getItem('token')} ${localStorage.getItem('remember_token')}`
    }
    else if (
      sessionStorage.getItem('token') && sessionStorage.getItem('token') !== 'undefined'
    ) 
    {
      config.headers!.Authorization = `Bearer ${sessionStorage.getItem('token')} ${sessionStorage.getItem('remember_token')}`
    }
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers!.Authorization = `Bearer ${token}`
    // }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// API.interceptors.response.use((response) => {
//   return response
// }, async function (error) {
//   const originalRequest = error.config;

//   if (error.response.status === 401 && originalRequest.url === `${BASE_URL}/v1/auth/refresh-tokens`) {
//       history.push('/login');
//       return Promise.reject(error);
//   }

//   if (error.response.status === 401 && !originalRequest._retry) {

//       originalRequest._retry = true;
//       const refreshToken = localStorage.getItem('refreshToken')
//       const res = await axios.post(`${BASE_URL}/v1/auth/refresh-tokens`,
//       {
//         'refreshToken': refreshToken
//       });
//     if (res.status === 200) {
//       localStorage.setItem('token', res.data.refresh.token);
//       axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
//       return axios(originalRequest);
//     }
//   }
//   return Promise.reject(error);
// });

API.interceptors.response.use(
  function (response: AxiosResponse) {
    return response.data;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default API;

const graphQLClient = new GraphQLClient(
  `${BASE_URL}/graphql`, {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'x-lang': 'EN',
    'Authorization': '',
  },
  credentials: 'include',
});

if (
  localStorage.getItem('token') && localStorage.getItem('token') !== 'undefined'
) 
{
  graphQLClient.setHeader('Authorization', `Bearer ${localStorage.getItem('token')} ${localStorage.getItem('remember_token')}`)
}
else if (
  sessionStorage.getItem('token') && sessionStorage.getItem('token') !== 'undefined'
) 
{
  graphQLClient.setHeader('Authorization', `Bearer ${sessionStorage.getItem('token')} ${sessionStorage.getItem('remember_token')}`)
}

export { graphQLClient };