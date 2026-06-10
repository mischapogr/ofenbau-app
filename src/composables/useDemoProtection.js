import { computed, reactive } from 'vue'

const SESSION_KEY = 'ofenbau-demo-access'

function parseList(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
}

function hostMatches(hostname, allowedHost) {
  if (allowedHost.startsWith('*.')) {
    const suffix = allowedHost.slice(1)
    return hostname.endsWith(suffix) && hostname.length > suffix.length
  }

  return hostname === allowedHost
}

async function sha256Hex(value) {
  const data = new TextEncoder().encode(value)
  const hash = await window.crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

function applyNoindexMeta() {
  let meta = document.head.querySelector('meta[name="robots"]')
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('name', 'robots')
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', 'noindex,nofollow,noarchive')
}

export function useDemoProtection() {
  const env = import.meta.env
  const isDemo =
    env.VITE_APP_ENV === 'demo' ||
    (env.MODE === 'demo' && env.VITE_DEMO_PROTECTION_ENABLED !== 'false')
  const protectionEnabled = isDemo && env.VITE_DEMO_PROTECTION_ENABLED !== 'false'
  const accessCodeHash = String(env.VITE_DEMO_ACCESS_CODE_HASH || '')
    .trim()
    .toLowerCase()
  const allowedHosts = parseList(env.VITE_DEMO_ALLOWED_HOSTS)
  const hostname = window.location.hostname.toLowerCase()
  const isFileProtocol = window.location.protocol === 'file:'
  const isAllowedHost =
    !protectionEnabled ||
    (hostname &&
      allowedHosts.length > 0 &&
      allowedHosts.some((host) => hostMatches(hostname, host)))
  const storedAccess = window.sessionStorage.getItem(SESSION_KEY)

  if (protectionEnabled) {
    applyNoindexMeta()
  }

  const state = reactive({
    isDemo: protectionEnabled,
    customerName: env.VITE_DEMO_CUSTOMER_NAME || 'Demo',
    authorName: env.VITE_DEMO_AUTHOR_NAME || 'Mischa Pogrebnyak',
    authorEmail: env.VITE_DEMO_AUTHOR_EMAIL || '66591935+mischapogr@users.noreply.github.com',
    watermarkEnabled: protectionEnabled && env.VITE_DEMO_WATERMARK_ENABLED !== 'false',
    watermarkFactor: Math.max(
      0,
      Math.min(5, parseFloat(env.VITE_DEMO_WATERMARK_FACTOR ?? '1') || 1)
    ),
    watermarkText: `${env.VITE_DEMO_CUSTOMER_NAME || 'Demo'} · ${hostname || 'local'} · © ${
      env.VITE_DEMO_AUTHOR_NAME || 'Mischa Pogrebnyak'
    } · nicht zur Weitergabe`,
    copyrightNotice:
      env.VITE_DEMO_COPYRIGHT_NOTICE ||
      'Urheberrechtlich geschuetzte Demo. Nutzung nur zur internen Pruefung. Kopieren, Weitergabe, Nachbau und produktive Verwendung sind ohne schriftliche Freigabe untersagt.',
    blockedReason: isFileProtocol
      ? 'Diese Demo kann nicht direkt als Datei geoeffnet werden.'
      : !isAllowedHost
        ? 'Diese Demo ist fuer diese Domain nicht freigegeben.'
        : '',
    unlocked: !accessCodeHash || storedAccess === accessCodeHash,
    accessError: '',
    verifying: false,
    async verifyAccessCode(code) {
      state.accessError = ''
      if (!accessCodeHash) {
        state.unlocked = true
        return true
      }
      if (!window.crypto?.subtle) {
        state.accessError = 'Dieser Browser unterstuetzt die Demo-Freigabe nicht.'
        return false
      }

      state.verifying = true
      try {
        const candidateHash = await sha256Hex(String(code || ''))
        if (candidateHash !== accessCodeHash) {
          state.accessError = 'Der Zugangscode ist nicht korrekt.'
          return false
        }

        window.sessionStorage.setItem(SESSION_KEY, accessCodeHash)
        state.unlocked = true
        return true
      } finally {
        state.verifying = false
      }
    },
  })

  state.requiresAccessCode = computed(
    () => protectionEnabled && Boolean(accessCodeHash) && !state.unlocked
  )
  state.blocksApp = computed(
    () => protectionEnabled && (Boolean(state.blockedReason) || !state.unlocked)
  )

  return state
}
