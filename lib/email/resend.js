import { Resend } from 'resend';
import crypto from 'node:crypto';

let _resend = null;
export function emailEnabled() {
  return Boolean(process.env.RESEND_API_KEY);
}
function getResend() {
  if (!emailEnabled()) return null;
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

const FROM = () => process.env.RESEND_FROM_EMAIL || 'Inclex <onboarding@resend.dev>';

const fmt = (n) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n || 0);

function shell(inner) {
  return `<!doctype html><html><body style="margin:0;padding:0;background:#F8F7F4;font-family:Inter,Helvetica,Arial,sans-serif;color:#111">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F8F7F4;padding:40px 0">
      <tr><td align="center">
        <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:2px;overflow:hidden">
          <tr><td style="background:#0B0B0B;padding:22px 32px">
            <div style="letter-spacing:.42em;font-size:22px;font-weight:300;color:#fff">INCLEX</div>
          </td></tr>
          <tr><td style="padding:36px 32px">${inner}</td></tr>
          <tr><td style="background:#F8F7F4;padding:20px 32px;text-align:center;font-size:11px;color:#6B7280;border-top:1px solid rgba(0,0,0,.06)">
            Crafted to last • Designed to be remembered<br/>
            © ${new Date().getFullYear()} Inclex • support@inclex.com
          </td></tr>
        </table>
      </td></tr>
    </table></body></html>`;
}

export async function sendOrderEmail(order) {
  const resend = getResend();
  if (!resend || !order?.customer?.email) return { skipped: true };
  const itemsHtml = (order.items || []).map(it => `
    <tr>
      <td style="padding:10px 0;border-top:1px solid rgba(0,0,0,.06)">
        <b>${escape(it.name)}</b><br/>
        <span style="font-size:12px;color:#6B7280">${escape(it.color || '')}${it.engraving ? ` • “${escape(it.engraving)}”` : ''} × ${it.qty}</span>
      </td>
      <td align="right" style="padding:10px 0;border-top:1px solid rgba(0,0,0,.06)">₹${fmt(it.price * it.qty)}</td>
    </tr>`).join('');
  const html = shell(`
    <h1 style="font-family:'Playfair Display',Georgia,serif;font-size:28px;margin:0 0 6px">Thank you.</h1>
    <p style="margin:0 0 8px;color:#6B7280">We’ve received your order and are preparing it with care.</p>
    <div style="margin:22px 0 6px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#6B7280">Order</div>
    <div style="font-family:'Playfair Display',Georgia,serif;font-size:24px">${order.orderNumber}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:20px">
      ${itemsHtml}
      <tr><td style="padding:12px 0;border-top:2px solid #111"><b>Total</b></td><td align="right" style="padding:12px 0;border-top:2px solid #111"><b>₹${fmt(order.total)}</b></td></tr>
    </table>
    <p style="margin:24px 0 0;color:#6B7280;font-size:13px">Payment: <b style="color:#111">${(order.payment||'cod').toUpperCase()}</b> • Status: <b style="color:#C9A227">${order.status||'placed'}</b></p>
    <p style="margin:24px 0 0;font-size:13px">You’ll receive a tracking link within 24 hours of dispatch.</p>
  `);
  try {
    await resend.emails.send({ from: FROM(), to: order.customer.email, subject: `Order confirmed — ${order.orderNumber}`, html });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

export async function sendResetEmail(email, resetUrl) {
  const resend = getResend();
  if (!resend) return { skipped: true, resetUrl };
  const html = shell(`
    <h1 style="font-family:'Playfair Display',Georgia,serif;font-size:28px;margin:0 0 6px">Reset your password</h1>
    <p style="margin:0 0 22px;color:#6B7280">Someone (hopefully you) requested a password reset for your Inclex account. Click the button below to set a new password. This link expires in 30 minutes.</p>
    <a href="${resetUrl}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:14px 22px;border-radius:2px;font-weight:600;letter-spacing:.02em">Set a new password</a>
    <p style="margin:22px 0 0;font-size:12px;color:#6B7280">If the button doesn’t work, paste this URL into your browser:<br/><span style="word-break:break-all;color:#111">${resetUrl}</span></p>
    <p style="margin:22px 0 0;font-size:12px;color:#6B7280">Didn’t request this? Ignore this email — your password stays unchanged.</p>
  `);
  try {
    await resend.emails.send({ from: FROM(), to: email, subject: 'Reset your Inclex password', html });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

export function makeResetToken() {
  return crypto.randomBytes(32).toString('hex');
}

function escape(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
