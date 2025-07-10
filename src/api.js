// src/api/tmdb.js
import axios from 'axios'

const API_KEY = 'SUA_API_KEY_AQUI'
const BASE_URL = 'https://api.themoviedb.org/3'

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'pt-BR'
  }
})

export const getPopularMovies = async () => {
  const response = await tmdb.get('/movie/popular')
  return response.data.results
}

export const searchMovies = async (query) => {
  const response = await tmdb.get('/search/movie', {
    params: { query }
  })
  return response.data.results
}
