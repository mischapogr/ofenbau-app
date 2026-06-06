import httpClient from './httpClient'

/**
 * Example read service used by the useApi composable demo on the Home page.
 * Returns the list of services/offerings. Falls back gracefully when no
 * backend is configured (see useApi error handling in the component).
 */
export function fetchServices() {
  return httpClient.get('/services').then((res) => res.data)
}
