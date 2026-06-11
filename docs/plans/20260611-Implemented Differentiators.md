### 1. Implemented Differentiators

• Heating Load Calculator: Created the HeizlastCalculator.vue component. It automatically calculates the optimal kW rating for a room based on area, height, and insulation factors.
• BImSchV Ofen-Check: Created the BimschvChecker.vue component to help users check if their fireplace is compliant with environmental emissions regulations.
• Prefilled Form Connections: Updated ContactForm.vue and ContactView.vue to automatically parse calculator results from query parameters, pre-filling the message body for the user.
• Dynamic Integrations: Embedded the calculators into ServiceDetailView.vue for the corresponding stove building and chimney renovation pages.
• Regional Landing Pages: Created the regions.js data config and wired  /region/:slug  inside the router (index.js) and HomeView.vue to dynamically personalize headers, descriptions, sitemaps, and SEO schemas.
• Audits & Smoke Tests: Updated sitemap generation (generate-seo-assets.mjs) and the browser smoke checks (smoke-seo-browser.mjs / smoke-deployment.mjs) to ensure region routes are fully tested.

• Adding FAQs, Knowledge Bases & Case Studies: Highly recommended. Structured Q&A formatting is the primary source cited by AI search engines (like Gemini, Perplexity, and Copilot). Case studies with specific technical numbers increase topical authority.
• Search Engine Compatibility: Vital baseline. Traditional crawlability and structured Schema.org JSON-LD data are required before any search agent can correctly parse and summarize your business profile.
