import axios from 'axios'

// const url = process.env.NODE_ENV === 'development' ? 'http://localhost:3004' : 'https://topazgryphon.org:3004'
const url = 'https://topazgryphon.org:3004'

const instance = axios.create({
  baseURL: url
})

instance.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
instance.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

export default instance
