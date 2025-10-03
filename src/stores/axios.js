/* eslint-disable */
import axios from 'axios'
import useHttpStore from '@/stores/http'
import useSnackbarStore from '@/stores/snackbar'

axios.defaults.withCredentials = true
axios.defaults.baseURL = import.meta.env.VITE_API_URL
axios.defaults.timeout = 300000 // To manage slow networks (eg. Teletrabajo) 
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest' // for all requests: used by web2py request.ajax

axios.interceptors.response.use(
  response => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    useHttpStore().lastServerAccess = new Date()
    return response
  },
  error => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    console.log(error)
    useSnackbarStore().add(error.message)
    return Promise.reject(error)
  }
)

export default axios
