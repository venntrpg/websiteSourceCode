import axios from 'axios'

// TODO: Make this https
const instance = axios.create({
  baseURL: 'http://topazgryphon.org:3004'
})

export default instance
