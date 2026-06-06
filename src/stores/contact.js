import { defineStore } from 'pinia'
import { ref } from 'vue'
import { submitContactForm } from '@/services/contactService'

/**
 * Example domain store: handles the contact-form submission lifecycle
 * (loading / success / error) using the Axios service layer.
 */
export const useContactStore = defineStore('contact', () => {
  const isSubmitting = ref(false)
  const error = ref(null)
  const succeeded = ref(false)

  async function submit(payload) {
    isSubmitting.value = true
    error.value = null
    succeeded.value = false
    try {
      await submitContactForm(payload)
      succeeded.value = true
      return true
    } catch (err) {
      error.value = err?.normalizedMessage || 'Senden fehlgeschlagen. Bitte erneut versuchen.'
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  function reset() {
    error.value = null
    succeeded.value = false
  }

  return { isSubmitting, error, succeeded, submit, reset }
})
