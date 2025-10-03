import axios from './axios'
import { defineStore } from 'pinia'

export default defineStore('upload', () => {
  const get = id => axios.get(`/upload/upload/${id}`)
  const post = data => axios.post('/upload/upload', data).catch(() => { })
  const del = id => axios.delete(`/upload/upload/${id}`).catch(() => { })
  return { get, post, del }
})