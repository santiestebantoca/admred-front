import axios from './axios'
import { defineStore } from 'pinia'

export default defineStore('attachment', () => {
  const del = id => axios.delete(`/attachment/attachment/${id}`).catch(() => { })
  return { del }
})