import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://topazgryphon.org:3004'
})

instance.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
instance.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

export default instance
