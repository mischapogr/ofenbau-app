import axios from 'axios'

/**
 * Central Axios instance. All API calls should go through here so timeouts,
 * base URL, headers and error normalisation are applied consistently.
 */
const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// --- Request interceptor: attach auth token if present. ---
httpClient.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('auth_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  } catch (_e) {
    // ignore storage errors
  }
  return config
})

// --- Response interceptor: normalise errors into a predictable shape. ---
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status ?? null
    const data = error?.response?.data

    let normalizedMessage = 'Ein unbekannter Fehler ist aufgetreten.'
    if (error.code === 'ECONNABORTED') {
      normalizedMessage = 'Zeitüberschreitung der Anfrage.'
    } else if (!error.response) {
      normalizedMessage = 'Keine Verbindung zum Server.'
    } else if (data?.message) {
      normalizedMessage = data.message
    } else if (status === 404) {
      normalizedMessage = 'Ressource nicht gefunden.'
    } else if (status >= 500) {
      normalizedMessage = 'Serverfehler. Bitte später erneut versuchen.'
    }

    // Attach normalized fields without losing the original error.
    error.normalizedMessage = normalizedMessage
    error.status = status
    return Promise.reject(error)
  }
)

export default httpClient
