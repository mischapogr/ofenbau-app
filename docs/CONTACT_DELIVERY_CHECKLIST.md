# Contact Delivery Checklist

Generated: 2026-06-11T06:09:43.012Z

Use this worksheet for production contact-form delivery handoff. It records
deployment env readiness and the proof required before launch. Do not store
SMTP passwords, mailbox credentials or private mailbox screenshots in this
repository.

## Current Contact Inputs

| Input | Current state | Launch requirement | Source |
| --- | --- | --- | --- |
| Production URL | http://localhost:5173 (open) | Used as the target for `/api/healthz` and `/api/contact` delivery proof. | Deployment env -> `VITE_APP_URL` |
| Contact API base URL | /api (ready) | Same-origin `/api` is expected when using the bundled contact API service. | Deployment env -> `VITE_API_BASE_URL` |
| SMTP host | mailpit (open) | Real SMTP server reachable from the production contact API container. | Deployment env -> `MAIL_HOST` |
| SMTP port | 1025 (ready) | Numeric SMTP port. | Deployment env -> `MAIL_PORT` |
| SMTP sender | no-reply@ofenbau-mustermann.test (open) | Sender address allowed by the SMTP provider. | Deployment env -> `MAIL_FROM` |
| Recipient mailbox | (empty) (open) | Mailbox that receives website contact requests and is monitored by the operator. | Deployment env -> `MAIL_TO` |
| SMTP timeout | 8000 (ready) | Timeout in milliseconds for the contact API SMTP handoff. | Deployment env -> `SMTP_TIMEOUT_MS` |

## Production Verification Steps

| Step | Command or action | Expected result | Evidence to record |
| --- | --- | --- | --- |
| Local API smoke | `npm run contact:smoke` | Health endpoint, method rejection, validation, honeypot, fake SMTP handoff and rate limiting pass. | Attach command output or preflight evidence. |
| Production API health | `npm run deploy:all -- https://domain.example` or open `/api/healthz` | `/api/healthz` returns ok=true when bundled API is used. | Record URL, status and timestamp. |
| Dry-run delivery command | `npm run contact:delivery -- https://domain.example` | Command prints target endpoint and payload summary without sending. | Attach command output before the real send. |
| Real mailbox delivery | `CONTACT_DELIVERY_CONFIRM=send CONTACT_DELIVERY_REPLY_TO=launch-test@example.de npm run contact:delivery -- https://domain.example` | Production API returns ok=true and the marked message is received in the real mailbox. | Record recipient mailbox checker, timestamp and subject line in launch ticket. |
| Reply-To check | Open received test message in the production mailbox | Reply-To matches `CONTACT_DELIVERY_REPLY_TO` so the operator can answer the prospect. | Record mailbox checker and timestamp. |
| Spam-folder check | Check inbox and spam/junk folder after delivery test | The marked launch message is visible to the operator or deliverability issue is tracked. | Record inbox/spam result in launch ticket. |

## Delivery Test Payload

| Field | Default value | Override env var |
| --- | --- | --- |
| Name | Launch Delivery Test | `CONTACT_DELIVERY_NAME` |
| Reply-To | launch-test@example.invalid | `CONTACT_DELIVERY_REPLY_TO` |
| Subject | Launch Kontaktformular Test | `CONTACT_DELIVERY_SUBJECT` |
| Recipient | info@ofenbau-mustermann.test | Deployment env -> `MAIL_TO` |

## Useful Commands

```bash
npm run launch:contact
npm run contact:smoke
npm run contact:delivery -- https://domain.example
CONTACT_DELIVERY_CONFIRM=send CONTACT_DELIVERY_REPLY_TO=launch-test@example.de npm run contact:delivery -- https://domain.example
npm run launch:report
npm run preflight
```
