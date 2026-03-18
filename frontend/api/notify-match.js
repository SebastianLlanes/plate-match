export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { plate, contactLost, contactFound, city, province } = req.body;

  if (!plate || !contactLost || !contactFound) {
    return res.status(400).json({ error: "Datos incompletos." });
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API key no configurada." });
  }

  try {
    await Promise.all([
      sendMatchEmail({
        apiKey,
        to: contactLost,
        role: "lost",
        plate,
        otherContact: contactFound,
        city,
        province,
      }),
      sendMatchEmail({
        apiKey,
        to: contactFound,
        role: "found",
        plate,
        otherContact: contactLost,
        city,
        province,
      }),
    ]);

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Error enviando emails:", error);
    return res.status(500).json({ error: "Error enviando emails." });
  }
}

async function sendMatchEmail({ apiKey, to, role, plate, otherContact, city, province }) {
  const isLost = role === "lost";
  const location = city && province ? `${city}, ${province}` : null;

  const subject = isLost
    ? `¡Encontramos tu patente ${plate}!`
    : `El dueño de la patente ${plate} fue notificado`;

  const headline = isLost
    ? `¡Tu patente <strong>${plate}</strong> fue encontrada!`
    : `¡Hiciste match con el dueño de la patente <strong>${plate}</strong>!`;

  const instruction = isLost
    ? `Alguien encontró tu chapa patente. Contactate lo antes posible para coordinar la devolución.`
    : `El dueño de la patente que encontraste ya fue notificado. Podés contactarte directamente.`;

  const contactLabel = isLost ? "Contacto de quien la encontró" : "Contacto del dueño";

  const locationHtml = location
    ? `<p style="color:#6b7280;font-size:14px;margin:0">📍 Ubicación: ${location}</p>`
    : "";

  const html = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:system-ui,-apple-system,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:520px;background:#ffffff;border-radius:16px;padding:36px;box-shadow:0 4px 24px rgba(0,0,0,0.06)">
          <tr>
            <td style="padding-bottom:24px;border-bottom:1px solid #f3f4f6">
              <span style="font-size:22px;font-weight:700;color:#111827">Chapa</span>
              <span style="font-size:22px;font-weight:700;color:#10b981">Match</span>
              <p style="margin:4px 0 0;font-size:12px;color:#9ca3af">Alguien la tiene. Nosotros los conectamos.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 0 16px;text-align:center">
              <span style="display:inline-block;background:linear-gradient(135deg,#10b981,#059669);color:#ffffff;font-size:12px;font-weight:600;padding:6px 16px;border-radius:999px;letter-spacing:0.5px">
                MATCH CONFIRMADO
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:8px;text-align:center">
              <h2 style="margin:0;font-size:20px;font-weight:700;color:#111827;line-height:1.4">
                ${headline}
              </h2>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 0;text-align:center">
              <span style="display:inline-block;background:#111827;color:#10b981;font-family:'Courier New',monospace;font-size:28px;font-weight:700;padding:10px 24px;border-radius:8px;letter-spacing:4px">
                ${plate}
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:16px;text-align:center">${locationHtml}</td>
          </tr>
          <tr>
            <td style="padding-bottom:20px">
              <p style="margin:0;font-size:15px;color:#374151;line-height:1.6;text-align:center">
                ${instruction}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:28px">
              <div style="background:#f3f4f6;border-radius:10px;padding:16px;text-align:center">
                <p style="margin:0 0 6px;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px">${contactLabel}</p>
                <p style="margin:0;font-size:18px;font-weight:700;color:#111827;word-break:break-word">${otherContact}</p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:28px;text-align:center">
              <a href="https://www.chapamatch.com.ar/dashboard"
                style="display:inline-block;background:#111827;color:#ffffff;font-size:14px;font-weight:600;padding:12px 28px;border-radius:10px;text-decoration:none">
                Ver en ChapaMatch
              </a>
            </td>
          </tr>
          <tr>
            <td style="border-top:1px solid #f3f4f6;padding-top:20px;text-align:center">
              <p style="margin:0;font-size:12px;color:#9ca3af">
                Este email fue enviado automáticamente por ChapaMatch.<br>
                Si no esperabas este mensaje, podés ignorarlo.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "ChapaMatch <noreply@chapamatch.com.ar>",
      to: [to], 
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend error: ${error}`);
  }

  return response.json();
}