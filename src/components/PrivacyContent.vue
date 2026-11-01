<script setup>
import { company } from '@/data/company'
import { legalProfile } from '@/data/legal'
import { demoOperator } from '@/config/demoOperator'

// In demo builds the fictional business is not the controller; the operator is.
const controller = demoOperator.enabled
  ? [demoOperator.name, demoOperator.street, demoOperator.city].filter(Boolean).join(', ')
  : `${company.legalName}, ${company.address.street}, ${company.address.zip} ${company.address.city}`
const controllerEmail = demoOperator.enabled ? demoOperator.email : company.email.label
const analyticsConfigured = Boolean(import.meta.env.VITE_GA_MEASUREMENT_ID)
</script>

<template>
  <div class="space-y-6 leading-relaxed text-content-muted">
    <h2 class="font-display text-xl font-semibold text-content">1. Verantwortliche Stelle</h2>
    <p>
      {{ controller }}.<br />
      E-Mail: {{ controllerEmail }}
    </p>
    <p v-if="demoOperator.enabled">
      Diese Website ist eine Demo. Das dargestellte Unternehmen „{{ company.name }}“ ist fiktiv und
      verarbeitet keine Daten; verantwortlich ist allein der oben genannte Betreiber.
    </p>

    <h2 class="font-display text-xl font-semibold text-content">2. Hosting und Server-Logs</h2>
    <p>
      Die Website wird bei Cloudflare Pages gehostet (Cloudflare, Inc., 101 Townsend St, San
      Francisco, CA 94107, USA). Beim Aufruf verarbeitet Cloudflare technisch notwendige Daten wie
      IP-Adresse, Zeitpunkt, aufgerufene Adresse und Browserkennung, um die Seite auszuliefern und
      vor Angriffen zu schützen (Art. 6 Abs. 1 lit. f DSGVO). Cloudflare ist unter dem EU-US Data
      Privacy Framework zertifiziert; mit Cloudflare besteht ein Vertrag zur Auftragsverarbeitung.
    </p>

    <h2 class="font-display text-xl font-semibold text-content">3. Schriftarten</h2>
    <p>
      Alle Schriftarten werden von unserem eigenen Webspace geladen. Es findet keine Verbindung zu
      Google Fonts oder anderen Schriftanbietern statt.
    </p>

    <h2 class="font-display text-xl font-semibold text-content">4. Kontaktformular</h2>
    <p v-if="demoOperator.enabled">
      Das Kontaktformular ist eine Vorführung. Ihre Eingaben werden lediglich technisch entgegen-
      genommen, um eine Bestätigung anzuzeigen; sie werden weder gespeichert noch versendet. Bitte
      geben Sie keine echten persönlichen Daten ein.
    </p>
    <p v-else>
      Wenn Sie uns über das Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben inklusive
      der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall
      von Anschlussfragen bei uns gespeichert (Art. 6 Abs. 1 lit. b DSGVO).
    </p>

    <h2 class="font-display text-xl font-semibold text-content">5. Standortermittlung</h2>
    <p>
      Nur wenn Sie im Kontaktformular „Standort automatisch ermitteln“ anklicken und die Abfrage in
      Ihrem Browser erlauben, werden Ihre Koordinaten an den Dienst Nominatim der OpenStreetMap
      Foundation (St John’s Innovation Centre, Cowley Road, Cambridge, CB4 0WS, Vereinigtes
      Königreich) übermittelt, um daraus Postleitzahl und Ort zu bestimmen. Dabei wird auch Ihre
      IP-Adresse übertragen. Rechtsgrundlage ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO); für
      das Vereinigte Königreich besteht ein Angemessenheitsbeschluss der EU-Kommission.
    </p>

    <h2 class="font-display text-xl font-semibold text-content">6. Cookies und Analyse</h2>
    <p>
      Technisch notwendige Daten werden nur für Grundfunktionen der Website im Browser gespeichert.
      <template v-if="analyticsConfigured">
        Analyse durch Google Analytics wird erst geladen, wenn Sie der Kategorie Analyse im
        Cookie-Hinweis zustimmen; ohne diese Zustimmung wird Google Analytics nicht geladen.
      </template>
      <template v-else>Analysedienste werden auf dieser Website nicht eingesetzt.</template>
    </p>

    <h2 class="font-display text-xl font-semibold text-content">7. Google Maps</h2>
    <p>
      Die eingebettete Google-Maps-Karte auf der Kontaktseite wird erst geladen, wenn Sie Komfort-
      Cookies akzeptieren oder die Karte ausdrücklich über „Karte laden“ freigeben (Art. 6 Abs. 1
      lit. a DSGVO). Anbieter ist Google Ireland Limited, Gordon House, Barrow Street, Dublin 4,
      Irland. Der externe Routenlink öffnet Google Maps erst nach Ihrer aktiven Auswahl.
    </p>

    <h2 class="font-display text-xl font-semibold text-content">8. Ihre Rechte</h2>
    <p>
      Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
      Datenübertragbarkeit und Widerspruch sowie das Recht, eine erteilte Einwilligung jederzeit zu
      widerrufen. Außerdem können Sie sich bei einer Datenschutz-Aufsichtsbehörde beschweren.
    </p>

    <template v-if="!demoOperator.enabled && legalProfile.privacyNeedsReview">
      <h2 class="font-display text-xl font-semibold text-content">9. Hinweis zur Vorlage</h2>
      <p>
        Angaben zu eingesetzten Dienstleistern, Auftragsverarbeitung, Speicherdauer und
        Rechtsgrundlagen müssen mit den finalen Betreiberangaben geprüft und ergänzt werden.
        {{ legalProfile.privacyReviewNote }}
      </p>
    </template>
  </div>
</template>
