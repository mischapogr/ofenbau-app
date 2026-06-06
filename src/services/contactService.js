import httpClient from './httpClient'

/**
 * Contact form submission. Posts to the configured API base URL.
 * In local dev without a backend, point VITE_API_BASE_URL at a mock or
 * wire a small mailer that relays to Mailpit (smtp: mailpit:1025).
 *
 * @param {{ name: string, email: string, message: string }} payload
 */
export function submitContactForm(payload) {
  return httpClient.post('/contact', payload).then((res) => res.data)
}
