import axios from 'axios'

const config = {
  secure: false,
  ip: '172.16.0.151',
  port: 8080
}

const client = axios.create({
  baseURL: `${config.secure ? 'https' : 'http'}://${config.ip}:${config.port}/api/`,
  timeout: 10000
})

export default client
