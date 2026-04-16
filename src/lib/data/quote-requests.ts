"use server"

import { Resend } from "resend"

export type QuoteRequestPayload = {
  product_id: string
  variant_id: string | null
  product_title: string
  quantity: number
  delivery_type: "livrare" | "ridicare"
  full_name: string
  phone: string
  email: string
  address: string | null
  turnstileToken: string
}

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    console.error("[CereOferta] TURNSTILE_SECRET_KEY not set")
    return false
  }

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    }
  )

  const data = await res.json()
  return data.success === true
}

function buildOfertaEmailHtml(payload: Omit<QuoteRequestPayload, "turnstileToken">): string {
  const deliveryLabel = payload.delivery_type === "livrare" ? "Livrare la adresă" : "Ridicare personală"

  return `<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8" />
  <title>Cerere ofertă nouă - ${payload.product_title}</title>
</head>
<body style="margin:0;padding:0;background-color:#F5F5F5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#F5F5F5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table cellpadding="0" cellspacing="0" border="0" width="560" style="max-width:560px;width:100%;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <img src="https://i.ibb.co/G3pkSmmJ/favico.png" alt="Orizont" width="44" height="44" style="display:block;border-radius:8px;" />
              <p style="margin:6px 0 0;font-size:18px;font-weight:700;color:#1A1A1A;">Orizont</p>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#FFFFFF;border-radius:16px;border:1px solid #EEEEEE;padding:28px;">

              <!-- Header -->
              <h1 style="margin:0 0 4px;font-size:20px;font-weight:700;color:#1A1A1A;">Cerere ofertă nouă</h1>
              <p style="margin:0 0 24px;font-size:14px;color:#888888;">Un client a trimis o cerere de ofertă prin site.</p>

              <!-- Product -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:20px;background:#FFF3E6;border:1px solid rgba(242,122,26,0.2);border-radius:10px;padding:14px;">
                <tr>
                  <td>
                    <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#F27A1A;text-transform:uppercase;letter-spacing:0.05em;">Produs</p>
                    <p style="margin:0;font-size:15px;font-weight:600;color:#1A1A1A;">${payload.product_title}</p>
                    ${payload.variant_id ? `<p style="margin:4px 0 0;font-size:12px;color:#888888;">Variantă ID: ${payload.variant_id}</p>` : ""}
                  </td>
                  <td align="right" style="white-space:nowrap;padding-left:16px;">
                    <p style="margin:0 0 2px;font-size:11px;color:#888888;">Cantitate</p>
                    <p style="margin:0;font-size:22px;font-weight:700;color:#F27A1A;">${payload.quantity}</p>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #F0F0F0;margin:0 0 20px;" />

              <!-- Client details -->
              <p style="margin:0 0 12px;font-size:12px;font-weight:700;color:#1A1A1A;text-transform:uppercase;letter-spacing:0.05em;">Date client</p>
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="padding-bottom:10px;width:130px;font-size:13px;color:#888888;vertical-align:top;">Nume</td>
                  <td style="padding-bottom:10px;font-size:13px;font-weight:600;color:#1A1A1A;">${payload.full_name}</td>
                </tr>
                <tr>
                  <td style="padding-bottom:10px;font-size:13px;color:#888888;vertical-align:top;">Telefon</td>
                  <td style="padding-bottom:10px;font-size:13px;font-weight:600;color:#1A1A1A;">${payload.phone}</td>
                </tr>
                <tr>
                  <td style="padding-bottom:10px;font-size:13px;color:#888888;vertical-align:top;">Email</td>
                  <td style="padding-bottom:10px;font-size:13px;font-weight:600;color:#1A1A1A;">${payload.email}</td>
                </tr>
                <tr>
                  <td style="padding-bottom:10px;font-size:13px;color:#888888;vertical-align:top;">Tip livrare</td>
                  <td style="padding-bottom:10px;font-size:13px;font-weight:600;color:#1A1A1A;">${deliveryLabel}</td>
                </tr>
                ${payload.address ? `
                <tr>
                  <td style="padding-bottom:10px;font-size:13px;color:#888888;vertical-align:top;">Adresă</td>
                  <td style="padding-bottom:10px;font-size:13px;font-weight:600;color:#1A1A1A;">${payload.address}</td>
                </tr>` : ""}
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:16px;">
              <p style="margin:0;font-size:12px;color:#AAAAAA;">Orizont · cerere trimisă prin test.orizont-srl.ro</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function submitQuoteRequest(
  payload: QuoteRequestPayload
): Promise<{ ok: true } | { error: string }> {
  // 1. Verify Turnstile token
  const valid = await verifyTurnstile(payload.turnstileToken)
  if (!valid) {
    return { error: "Verificarea de securitate a eșuat. Te rugăm să încerci din nou." }
  }

  // 2. Send email to shop owner
  const resend = new Resend(process.env.RESEND_API_KEY)
  const from = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev"
  const shopEmail = process.env.SHOP_EMAIL
  if (!shopEmail) {
    console.error("[CereOferta] SHOP_EMAIL not set")
    return { error: "Configurație lipsă. Contactați administratorul." }
  }

  const { turnstileToken: _, ...emailPayload } = payload

  const { error } = await resend.emails.send({
    from,
    to: shopEmail,
    reply_to: payload.email,
    subject: `Cerere ofertă: ${payload.product_title} (${payload.quantity} buc)`,
    html: buildOfertaEmailHtml(emailPayload),
  })

  if (error) {
    console.error("[CereOferta] Resend error:", error)
    return { error: "Eroare la trimiterea cererii. Te rugăm să încerci din nou." }
  }

  return { ok: true }
}
