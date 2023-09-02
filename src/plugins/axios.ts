import router from '@/router'
import {
  SnackbarType,
  useSnackbarStore,
} from '@/views/apps/snackbar/useSnackbarStore.ts'
import axios from 'axios'

const responseErrorConfigMessage: { [key: string]: string } = {
  put: 'saving',
  post: 'creating',
  delete: 'deleting',
}

const axiosIns = axios.create({
  // You can add your headers here
  // ================================
  baseURL: import.meta.env.VITE_APP_API_URL,
  // headers: {'X-Custom-Header': 'foobar'}
})

// ℹ️ Add request interceptor to send the authorization header on each subsequent request after login
axiosIns.interceptors.request.use((config) => {
  // Retrieve token from localStorage
  const token = localStorage.getItem('accessToken')

  // If token is found
  if (token) {
    // Get request headers and if headers is undefined assign blank object
    config.headers = config.headers || {}

    // Set authorization header
    // ℹ️ JSON.parse will convert token to string
    config.headers.Authorization = token ? `Bearer ${JSON.parse(token)}` : ''
  }

  // Return modified config
  return config
})

// ℹ️ Add response interceptor to handle 401 response
axiosIns.interceptors.response.use(
  (response) => {
    if (
      response.config.method === 'post' ||
      response.config.method === 'put' ||
      response.config.method === 'delete'
    ) {
      const snackbarStore = useSnackbarStore()

      snackbarStore.showSnackbar({
        title: response?.data?.message || 'Success',
        type: SnackbarType.SUCCESS,
        description: '',
        action: {
          text: '',
          handler: () => {},
        },
      })
    }

    return response
  },
  (error) => {
    // Handle error

    if (error.response.status === 500 || error.response.status === 400) {
      const snackbarStore = useSnackbarStore()

      snackbarStore.showSnackbar({
        title:
          error?.response?.data?.message ||
          `Error ${responseErrorConfigMessage[error.config.method]} data`,
        type: SnackbarType.ERROR,
        description: '',
        action: {
          text: '',
          handler: () => {},
        },
      })
    }
    if (error.response.status === 401) {
      // ℹ️ Logout user and redirect to login page
      // Remove "userData" from localStorage
      localStorage.removeItem('userData')

      // Remove "accessToken" from localStorage
      localStorage.removeItem('accessToken')
      localStorage.removeItem('userAbilities')

      // If 401 response returned from api
      router.push('/login')
    } else {
      return Promise.reject(error)
    }
  }
)

export default axiosIns
