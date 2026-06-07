<script setup>
import { company } from '@/data/company'
import { legalProfile } from '@/data/legal'
</script>

<template>
  <div class="space-y-6 leading-relaxed text-content-muted">
    <h2 class="font-display text-xl font-semibold text-content">1. Verantwortliche Stelle</h2>
    <p>
      {{ company.legalName }}, {{ company.address.street }}, {{ company.address.zip }}
      {{ company.address.city }}.
    </p>
    <h2 class="font-display text-xl font-semibold text-content">2. Kontaktformular</h2>
    <p>
      Wenn Sie uns über das Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben inklusive
      der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von
      Anschlussfragen bei uns gespeichert.
    </p>
    <h2 class="font-display text-xl font-semibold text-content">3. Cookies und Analyse</h2>
    <p>
      Technisch notwendige Daten werden nur für Grundfunktionen der Website gespeichert. Analyse
      durch Google Analytics wird erst geladen, wenn Sie der Kategorie Analyse im Cookie-Hinweis
      zustimmen. Ohne diese Zustimmung wird Google Analytics nicht geladen.
    </p>
    <h2 class="font-display text-xl font-semibold text-content">4. Google Maps</h2>
    <p>
      Die eingebettete Google-Maps-Karte auf der Kontaktseite wird erst geladen, wenn Sie Komfort-
      Cookies akzeptieren oder die Karte ausdrücklich über „Karte laden“ freigeben. Der externe
      Routenlink zu Google Maps bleibt als normaler Link verfügbar und öffnet Google Maps erst nach
      Ihrer aktiven Auswahl.
    </p>
    <h2 class="font-display text-xl font-semibold text-content">5. Ihre Rechte</h2>
    <p>
      Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der
      Verarbeitung Ihrer gespeicherten personenbezogenen Daten.
    </p>
    <h2 class="font-display text-xl font-semibold text-content">6. Auftragsverarbeitung</h2>
    <p>
      Angaben zu eingesetzten Dienstleistern, Auftragsverarbeitung, Speicherdauer und Rechtsgrundlagen
      müssen mit den finalen Betreiberangaben geprüft und ergänzt werden.
      <template v-if="legalProfile.privacyNeedsReview">
        {{ legalProfile.privacyReviewNote }}
      </template>
    </p>
  </div>
</template>
