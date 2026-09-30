import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM =
  process.env.RESEND_FROM ||
  process.env.SMTP_FROM ||
  'Kaiser Tours <onboarding@resend.dev>';

const ADMIN_TO =
  process.env.RESEND_ADMIN_TO ||
  process.env.ADMIN_INITIAL_EMAIL ||
  'info@kaiser-tours.de';

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

/**
 * Send transactional email via Resend.
 * In development without API key, logs to console instead of failing.
 */
export async function sendEmail({ to, subject, html, text, replyTo }) {
  const payload = {
    from: FROM,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    text,
    replyTo,
  };

  if (!isEmailConfigured()) {
    console.log('[EMAIL DEV FALLBACK] Resend not configured — message logged only:');
    console.log(JSON.stringify({ ...payload, html: html?.slice(0, 200) + '…' }, null, 2));
    return { id: 'dev-fallback', skipped: true };
  }

  const { data, error } = await resend.emails.send(payload);

  if (error) {
    console.error('[Resend] send failed:', error);
    throw new Error(error.message || 'E-Mail-Versand fehlgeschlagen.');
  }

  return data;
}

export async function notifyAdminAndVisitor({
  adminSubject,
  adminHtml,
  visitorEmail,
  visitorSubject,
  visitorHtml,
  replyTo,
}) {
  const results = [];

  try {
    results.push(
      await sendEmail({
        to: ADMIN_TO,
        subject: adminSubject,
        html: adminHtml,
        replyTo: replyTo || visitorEmail,
      })
    );
  } catch (err) {
    console.error('Admin notification failed:', err);
  }

  if (visitorEmail) {
    try {
      results.push(
        await sendEmail({
          to: visitorEmail,
          subject: visitorSubject,
          html: visitorHtml,
        })
      );
    } catch (err) {
      console.error('Visitor confirmation failed:', err);
    }
  }

  return results;
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function registrationEmailTemplates({ tour, registration, publicId }) {
  const name = `${registration.firstName} ${registration.lastName}`;
  const salutation = registration.salutation === 'MS' ? 'Frau' : 'Herr';

  return {
    adminSubject: `Neue Anmeldung ${publicId} — ${tour.title}`,
    adminHtml: `
      <h2>Neue Reiseanmeldung</h2>
      <p><strong>Buchungsnummer:</strong> ${escapeHtml(publicId)}</p>
      <p><strong>Reise:</strong> ${escapeHtml(tour.title)}</p>
      <p><strong>Teilnehmer:</strong> ${escapeHtml(salutation)} ${escapeHtml(name)}</p>
      <p><strong>E-Mail:</strong> ${escapeHtml(registration.email)}</p>
      <p><strong>Zimmer:</strong> ${escapeHtml(registration.roomType)}</p>
      <p><strong>Zahlungsstatus:</strong> Online bezahlt (Stripe)</p>
    `,
    visitorSubject: `Ihre Anmeldung ${publicId} — Kaiser Tours`,
    visitorHtml: `
      <h2>Vielen Dank für Ihre Anmeldung</h2>
      <p>Guten Tag ${escapeHtml(salutation)} ${escapeHtml(registration.lastName)},</p>
      <p>wir haben Ihre Anmeldung für <strong>${escapeHtml(tour.title)}</strong> erhalten und die Online-Zahlung erfolgreich verbucht.</p>
      <p>Ihre Buchungsnummer lautet: <strong>${escapeHtml(publicId)}</strong></p>
      <p>Sie erhalten in Kürze die schriftliche Reisebestätigung. Bei Fragen antworten Sie einfach auf diese E-Mail.</p>
      <p>Herzliche Grüsse<br/>Kaiser Tours</p>
    `,
  };
}

export function inquiryEmailTemplates({ inquiry }) {
  const typeLabel = inquiry.type === 'GROUP' ? 'Gruppenanfrage' : 'Kontaktanfrage';
  return {
    adminSubject: `${typeLabel} von ${inquiry.name}`,
    adminHtml: `
      <h2>${escapeHtml(typeLabel)}</h2>
      <p><strong>Name:</strong> ${escapeHtml(inquiry.name)}</p>
      <p><strong>E-Mail:</strong> ${escapeHtml(inquiry.email)}</p>
      ${inquiry.phone ? `<p><strong>Telefon:</strong> ${escapeHtml(inquiry.phone)}</p>` : ''}
      ${inquiry.subject ? `<p><strong>Betreff:</strong> ${escapeHtml(inquiry.subject)}</p>` : ''}
      ${inquiry.participantsCount ? `<p><strong>Teilnehmer:</strong> ${inquiry.participantsCount}</p>` : ''}
      <p>${escapeHtml(inquiry.message).replace(/\n/g, '<br/>')}</p>
    `,
    visitorSubject: 'Wir haben Ihre Nachricht erhalten — Kaiser Tours',
    visitorHtml: `
      <h2>Vielen Dank für Ihre Nachricht</h2>
      <p>Guten Tag ${escapeHtml(inquiry.name)},</p>
      <p>wir haben Ihre Anfrage erhalten und melden uns so bald wie möglich.</p>
      <p>Herzliche Grüsse<br/>Kaiser Tours</p>
    `,
  };
}

export function interestEmailTemplates({ tour, signup }) {
  return {
    adminSubject: `Interessenliste: ${signup.name} — ${tour.title}`,
    adminHtml: `
      <h2>Neue Vormerkung Interessenliste</h2>
      <p><strong>Reise:</strong> ${escapeHtml(tour.title)}</p>
      <p><strong>Name:</strong> ${escapeHtml(signup.name)}</p>
      <p><strong>E-Mail:</strong> ${escapeHtml(signup.email)}</p>
      ${signup.notes ? `<p>${escapeHtml(signup.notes)}</p>` : ''}
    `,
    visitorSubject: `Vormerkung bestätigt — ${tour.title}`,
    visitorHtml: `
      <h2>Ihre Vormerkung ist eingegangen</h2>
      <p>Guten Tag ${escapeHtml(signup.name)},</p>
      <p>wir haben Sie auf der Interessenliste für <strong>${escapeHtml(tour.title)}</strong> vorgemerkt und benachrichtigen Sie, sobald die Anmeldung startet.</p>
      <p>Herzliche Grüsse<br/>Kaiser Tours</p>
    `,
  };
}
