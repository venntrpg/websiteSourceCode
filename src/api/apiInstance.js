import axios from 'axios'

const instance = axios.create({
  baseURL: 'topazgryphon.org:3004'
})

export default instance
