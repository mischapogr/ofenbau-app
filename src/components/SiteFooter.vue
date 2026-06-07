<script setup>
import { RouterLink } from 'vue-router'
import BaseContainer from './BaseContainer.vue'
import AppIcon from './AppIcon.vue'
import { company, socialLinks } from '@/data/company'
import { services } from '@/data/services'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="mt-auto bg-ink-900 text-white/70">
    <BaseContainer class="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Company -->
      <div class="sm:col-span-2 lg:col-span-1">
        <div class="flex items-center gap-2 font-display text-lg font-semibold text-white">
          <img src="/logo.svg" alt="" class="h-8 w-8" />
          Ofenbau <span class="text-brand-400">Mustermann</span>
        </div>
        <p class="mt-4 max-w-xs text-sm leading-relaxed">
          Meisterhafter Kachel- &amp; Kaminofenbau und Fliesenarbeiten. Gesunde Wärme und Handwerk
          für Ihr Zuhause.
        </p>
        <ul class="mt-5 flex gap-3">
          <li v-for="s in socialLinks" :key="s.name">
            <a
              :href="s.href"
              target="_blank"
              rel="noopener"
              :aria-label="s.name"
              class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-white/80 transition-colors hover:bg-brand-500 hover:text-white"
            >
              <AppIcon :name="s.icon" class="h-5 w-5" />
            </a>
          </li>
        </ul>
      </div>

      <!-- Services -->
      <nav aria-label="Leistungen">
        <h4 class="text-sm font-semibold uppercase tracking-label text-white">Leistungen</h4>
        <ul class="mt-4 space-y-2.5 text-sm">
          <li v-for="s in services" :key="s.slug">
            <RouterLink
              :to="{ name: 'service-detail', params: { slug: s.slug } }"
              class="transition-colors hover:text-brand-400"
            >
              {{ s.title }}
            </RouterLink>
          </li>
          <li>
            <RouterLink :to="{ name: 'projects' }" class="transition-colors hover:text-brand-400">
              Projekte
            </RouterLink>
          </li>
        </ul>
      </nav>

      <!-- Company links -->
      <nav aria-label="Unternehmen">
        <h4 class="text-sm font-semibold uppercase tracking-label text-white">Unternehmen</h4>
        <ul class="mt-4 space-y-2.5 text-sm">
          <li>
            <RouterLink :to="{ name: 'about' }" class="transition-colors hover:text-brand-400">
              Über uns
            </RouterLink>
          </li>
          <li>
            <RouterLink :to="{ name: 'contact' }" class="transition-colors hover:text-brand-400">
              Kontakt
            </RouterLink>
          </li>
          <li>
            <RouterLink :to="{ name: 'imprint' }" class="transition-colors hover:text-brand-400">
              Impressum
            </RouterLink>
          </li>
          <li>
            <RouterLink :to="{ name: 'privacy' }" class="transition-colors hover:text-brand-400">
              Datenschutz
            </RouterLink>
          </li>
        </ul>
      </nav>

      <!-- Contact -->
      <div>
        <h4 class="text-sm font-semibold uppercase tracking-label text-white">Kontakt</h4>
        <address class="mt-4 space-y-3 text-sm not-italic">
          <p class="flex items-start gap-2.5">
            <AppIcon name="pin" class="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
            <span
              >{{ company.address.street }}<br />{{ company.address.zip }}
              {{ company.address.city }}</span
            >
          </p>
          <p class="flex items-center gap-2.5">
            <AppIcon name="phone" class="h-4 w-4 shrink-0 text-brand-400" />
            <a :href="company.phone.href" class="hover:text-brand-400">{{ company.phone.label }}</a>
          </p>
          <p class="flex items-start gap-2.5">
            <AppIcon name="whatsapp" class="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
            <span>
              <a :href="company.whatsapp.href" class="hover:text-brand-400">
                WhatsApp {{ company.whatsapp.label }}
              </a>
              <span class="mt-0.5 block text-xs text-white/45">
                {{ company.whatsapp.availability }}
              </span>
            </span>
          </p>
          <p class="flex items-center gap-2.5">
            <AppIcon name="mail" class="h-4 w-4 shrink-0 text-brand-400" />
            <a :href="company.email.href" class="hover:text-brand-400">{{ company.email.label }}</a>
          </p>
          <p class="flex items-center gap-2.5">
            <AppIcon name="clock" class="h-4 w-4 shrink-0 text-brand-400" />
            <span>{{ company.hours }}</span>
          </p>
        </address>
      </div>
    </BaseContainer>

    <div class="border-t border-white/10">
      <BaseContainer
        class="flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/50 sm:flex-row"
      >
        <p>&copy; {{ year }} {{ company.name }}. Alle Rechte vorbehalten.</p>
        <p class="flex gap-4">
          <RouterLink :to="{ name: 'imprint' }" class="hover:text-brand-400">Impressum</RouterLink>
          <RouterLink :to="{ name: 'privacy' }" class="hover:text-brand-400"
            >Datenschutz</RouterLink
          >
        </p>
      </BaseContainer>
    </div>
  </footer>
</template>
