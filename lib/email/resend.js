import { Resend } from "resend";
import crypto from "node:crypto";

let _resend = null;

export function emailEnabled() {
  return Boolean(process.env.RESEND_API_KEY);
}

function getResend() {
  if (!emailEnabled()) return null;

  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }

  return _resend;
}

const FROM = () => {
  if (!process.env.RESEND_FROM_EMAIL) {
    throw new Error(
      "RESEND_FROM_EMAIL is not configured"
    );
  }

  return process.env.RESEND_FROM_EMAIL;
};

const fmt = (n) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(n || 0);

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

/**
 * Escape user/order data before inserting it into HTML.
 */
function escape(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Common INCLEX email wrapper.
 */
function shell(inner) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#F8F7F4;font-family:Inter,Helvetica,Arial,sans-serif;color:#111">
    <table
      role="presentation"
      width="100%"
      cellspacing="0"
      cellpadding="0"
      style="background:#F8F7F4;padding:40px 0"
    >
      <tr>
        <td align="center">
          <table
            role="presentation"
            width="560"
            cellspacing="0"
            cellpadding="0"
            style="background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:2px;overflow:hidden"
          >

            <!-- Header -->
            <tr>
              <td style="background:#0B0B0B;padding:22px 32px">
                <div
                  style="letter-spacing:.42em;font-size:22px;font-weight:300;color:#fff"
                >
                  INCLEX
                </div>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:36px 32px">
                ${inner}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                style="background:#F8F7F4;padding:20px 32px;text-align:center;font-size:11px;color:#6B7280;border-top:1px solid rgba(0,0,0,.06)"
              >
                Crafted to last • Designed to be remembered<br/>
                © ${new Date().getFullYear()} Inclex • support@inclex.com
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/**
 * Order items section.
 */
function orderItemsHtml(order) {
  return (order.items || [])
    .map(
      (it) => `
        <tr>
          <td style="padding:10px 0;border-top:1px solid rgba(0,0,0,.06)">
            <b>${escape(it.name)}</b>
            <br/>
            <span style="font-size:12px;color:#6B7280">
              ${escape(it.color || "")}
              ${
                it.engraving
                  ? ` • “${escape(it.engraving)}”`
                  : ""
              }
              × ${escape(it.qty)}
            </span>
          </td>

          <td
            align="right"
            style="padding:10px 0;border-top:1px solid rgba(0,0,0,.06)"
          >
            ₹${fmt(it.price * it.qty)}
          </td>
        </tr>
      `,
    )
    .join("");
}

/**
 * Common order information.
 */
function orderSummaryHtml(order) {
  return `
    <div
      style="margin:22px 0 6px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#6B7280"
    >
      Order
    </div>

    <div
      style="font-family:'Playfair Display',Georgia,serif;font-size:24px"
    >
      ${escape(order.orderNumber)}
    </div>

    <table
      role="presentation"
      width="100%"
      cellspacing="0"
      cellpadding="0"
      style="margin-top:20px"
    >
      ${orderItemsHtml(order)}

      <tr>
        <td
          style="padding:12px 0;border-top:2px solid #111"
        >
          <b>Total</b>
        </td>

        <td
          align="right"
          style="padding:12px 0;border-top:2px solid #111"
        >
          <b>₹${fmt(order.total)}</b>
        </td>
      </tr>
    </table>

    <p
      style="margin:24px 0 0;color:#6B7280;font-size:13px"
    >
      Payment:
      <b style="color:#111">
        ${escape((order.payment || "cod").toUpperCase())}
      </b>
    </p>
  `;
}

/**
 * Track order button.
 */
function trackingButton(url, label = "Track Your Order") {
  if (!url) return "";

  return `
    <div style="margin:28px 0">
      <a
        href="${escape(url)}"
        style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:14px 22px;border-radius:2px;font-weight:600;letter-spacing:.02em"
      >
        ${escape(label)}
      </a>
    </div>
  `;
}

/**
 * Build email content for a particular order status.
 */
function buildStatusEmail(order, status) {
  const customerName =
    order.customer?.name || "there";

  const name = escape(customerName);
  const orderNumber = escape(order.orderNumber);

  switch (status) {
    case "placed":
      return {
        subject: `Order received — ${orderNumber}`,
        html: shell(`
          <h1
            style="font-family:'Playfair Display',Georgia,serif;font-size:28px;margin:0 0 6px"
          >
            Thank you, ${name}.
          </h1>

          <p style="margin:0 0 8px;color:#6B7280">
            We've received your INCLEX order and are preparing it with care.
          </p>

          ${orderSummaryHtml(order)}

          <p style="margin:24px 0 0;font-size:13px;color:#6B7280">
            We'll keep you updated as your order moves through each stage.
          </p>
        `),
      };

    case "confirmed":
      return {
        subject: `Your INCLEX order is confirmed — ${orderNumber}`,
        html: shell(`
          <h1
            style="font-family:'Playfair Display',Georgia,serif;font-size:28px;margin:0 0 6px"
          >
            Order confirmed.
          </h1>

          <p style="margin:0 0 8px;color:#6B7280">
            Hello ${name}, your order has been confirmed and is now being prepared.
          </p>

          ${orderSummaryHtml(order)}

          <p style="margin:24px 0 0;font-size:13px">
            We'll notify you when your order is packed and ready for dispatch.
          </p>
        `),
      };

    case "packed":
      return {
        subject: `Your INCLEX order is packed — ${orderNumber}`,
        html: shell(`
          <h1
            style="font-family:'Playfair Display',Georgia,serif;font-size:28px;margin:0 0 6px"
          >
            Your order is packed.
          </h1>

          <p style="margin:0 0 8px;color:#6B7280">
            Hello ${name}, your INCLEX order has been carefully packed and is ready for dispatch.
          </p>

          ${orderSummaryHtml(order)}

          <p style="margin:24px 0 0;font-size:13px">
            You'll receive another email as soon as your order is shipped.
          </p>
        `),
      };

    case "shipped": {
      const shipping = order.shipping || {};

      const courier = escape(
        shipping.courier || "Our delivery partner",
      );

      const trackingNumber = escape(
        shipping.trackingNumber || "",
      );

      const trackingUrl = shipping.trackingUrl || "";

      return {
        subject: `Your INCLEX order has shipped — ${orderNumber}`,
        html: shell(`
          <h1
            style="font-family:'Playfair Display',Georgia,serif;font-size:28px;margin:0 0 6px"
          >
            Your order is on its way.
          </h1>

          <p style="margin:0 0 8px;color:#6B7280">
            Hello ${name}, your INCLEX order has been shipped.
          </p>

          ${orderSummaryHtml(order)}

          <div
            style="margin-top:26px;padding:18px;background:#F8F7F4;border:1px solid rgba(0,0,0,.06)"
          >
            <div
              style="font-size:10px;text-transform:uppercase;letter-spacing:.16em;color:#6B7280"
            >
              Shipping Details
            </div>

            <div style="margin-top:10px;font-size:14px">
              <b>Courier:</b> ${courier}
            </div>

            ${
              trackingNumber
                ? `
                  <div style="margin-top:7px;font-size:14px">
                    <b>Tracking Number:</b> ${trackingNumber}
                  </div>
                `
                : ""
            }
          </div>

          ${trackingButton(trackingUrl)}

          <p style="margin:20px 0 0;font-size:12px;color:#6B7280">
            Tracking information may take some time to become active after dispatch.
          </p>
        `),
      };
    }

    case "delivered":
      return {
        subject: `Your INCLEX order has been delivered — ${orderNumber}`,
        html: shell(`
          <h1
            style="font-family:'Playfair Display',Georgia,serif;font-size:28px;margin:0 0 6px"
          >
            Order delivered.
          </h1>

          <p style="margin:0 0 8px;color:#6B7280">
            Hello ${name}, your INCLEX order has been successfully delivered.
          </p>

          ${orderSummaryHtml(order)}

          <p style="margin:24px 0 0;font-size:13px">
            We hope you enjoy your INCLEX product.
          </p>

          <p style="margin:14px 0 0;font-size:13px;color:#6B7280">
            Thank you for choosing INCLEX.
          </p>
        `),
      };

    case "cancelled":
      return {
        subject: `Your INCLEX order has been cancelled — ${orderNumber}`,
        html: shell(`
          <h1
            style="font-family:'Playfair Display',Georgia,serif;font-size:28px;margin:0 0 6px"
          >
            Order cancelled.
          </h1>

          <p style="margin:0 0 8px;color:#6B7280">
            Hello ${name}, your INCLEX order has been cancelled.
          </p>

          ${orderSummaryHtml(order)}

          ${
            order.cancellationReason
              ? `
                <div
                  style="margin-top:22px;padding:16px;background:#F8F7F4;font-size:13px"
                >
                  <b>Reason:</b>
                  ${escape(order.cancellationReason)}
                </div>
              `
              : ""
          }

          <p style="margin:24px 0 0;font-size:13px;color:#6B7280">
            If you believe this was unexpected, please contact us at support@inclex.com.
          </p>
        `),
      };

    case "returned":
      return {
        subject: `Return update for INCLEX order — ${orderNumber}`,
        html: shell(`
          <h1
            style="font-family:'Playfair Display',Georgia,serif;font-size:28px;margin:0 0 6px"
          >
            Return update.
          </h1>

          <p style="margin:0 0 8px;color:#6B7280">
            Hello ${name}, we've updated the status of your INCLEX order return.
          </p>

          ${orderSummaryHtml(order)}

          <p style="margin:24px 0 0;font-size:13px">
            Our team will process the returned item according to our return policy.
          </p>

          <p style="margin:14px 0 0;font-size:13px;color:#6B7280">
            We'll contact you if any additional information is required.
          </p>
        `),
      };

    case "refunded":
      return {
        subject: `Your INCLEX refund has been processed — ${orderNumber}`,
        html: shell(`
          <h1
            style="font-family:'Playfair Display',Georgia,serif;font-size:28px;margin:0 0 6px"
          >
            Refund processed.
          </h1>

          <p style="margin:0 0 8px;color:#6B7280">
            Hello ${name}, your refund for the following INCLEX order has been processed.
          </p>

          ${orderSummaryHtml(order)}

          ${
            order.refundAmount != null
              ? `
                <div
                  style="margin-top:24px;padding:18px;background:#F8F7F4;border:1px solid rgba(0,0,0,.06)"
                >
                  <div
                    style="font-size:10px;text-transform:uppercase;letter-spacing:.16em;color:#6B7280"
                  >
                    Refund Amount
                  </div>

                  <div
                    style="margin-top:8px;font-family:'Playfair Display',Georgia,serif;font-size:24px"
                  >
                    ₹${fmt(order.refundAmount)}
                  </div>
                </div>
              `
              : ""
          }

          ${
            order.refundReference
              ? `
                <p style="margin:20px 0 0;font-size:13px">
                  Refund reference:
                  <b>${escape(order.refundReference)}</b>
                </p>
              `
              : ""
          }

          <p style="margin:20px 0 0;font-size:12px;color:#6B7280">
            Depending on your payment provider, the refund may take additional time to appear in your account.
          </p>
        `),
      };

    default:
      return null;
  }
}

/**
 * Send an email for a specific order status.
 *
 * This is the main function the backend will use when
 * an admin changes an order status.
 */
export async function sendOrderStatusEmail(order, status) {
  const resend = getResend();

  if (!resend) {
    return {
      skipped: true,
      reason: "Email is not configured",
    };
  }

  if (!order?.customer?.email) {
    return {
      skipped: true,
      reason: "Customer email is missing",
    };
  }

  const email = buildStatusEmail(order, status);

  if (!email) {
    return {
      skipped: true,
      reason: `No email template for status: ${status}`,
    };
  }

  try {
    const result = await resend.emails.send({
      from: FROM(),
      to: order.customer.email,
      subject: email.subject,
      html: email.html,
    });

    return {
      ok: true,
      id: result?.data?.id || null,
    };
  } catch (e) {
    console.error(
      `❌ Failed to send ${status} email for ${order.orderNumber}:`,
      e,
    );

    return {
      ok: false,
      error: e.message,
    };
  }
}

/**
 * Backward-compatible order email function.
 *
 * Existing checkout/payment code already calls sendOrderEmail().
 * We keep it so those existing flows do not break.
 */
export async function sendOrderEmail(order) {
  return sendOrderStatusEmail(
    order,
    order?.status || "placed",
  );
}

/**
 * Password reset email.
 */
export async function sendResetEmail(email, resetUrl) {
  const resend = getResend();

  if (!resend) {
    return {
      skipped: true,
      resetUrl,
    };
  }

  const html = shell(`
    <h1
      style="font-family:'Playfair Display',Georgia,serif;font-size:28px;margin:0 0 6px"
    >
      Reset your password
    </h1>

    <p style="margin:0 0 22px;color:#6B7280">
      Someone (hopefully you) requested a password reset for your Inclex account.
      Click the button below to set a new password.
      This link expires in 30 minutes.
    </p>

    <a
      href="${escape(resetUrl)}"
      style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:14px 22px;border-radius:2px;font-weight:600;letter-spacing:.02em"
    >
      Set a new password
    </a>

    <p style="margin:22px 0 0;font-size:12px;color:#6B7280">
      If the button doesn't work, paste this URL into your browser:
      <br/>
      <span style="word-break:break-all;color:#111">
        ${escape(resetUrl)}
      </span>
    </p>

    <p style="margin:22px 0 0;font-size:12px;color:#6B7280">
      Didn't request this? Ignore this email — your password stays unchanged.
    </p>
  `);

  try {
    const result = await resend.emails.send({
      from: FROM(),
      to: email,
      subject: "Reset your Inclex password",
      html,
    });

    return {
      ok: true,
      id: result?.data?.id || null,
    };
  } catch (e) {
    console.error("❌ Failed to send password reset email:", e);

    return {
      ok: false,
      error: e.message,
    };
  }
}

export function makeResetToken() {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Send an admin reply to a customer inquiry.
 */
export async function sendInquiryReplyEmail({
  to,
  customerName,
  subject,
  originalMessage,
  reply,
}) {
  const resend = getResend();

  if (!resend) {
    return {
      skipped: true,
      reason: "Email is not configured",
    };
  }

  if (!to) {
    return {
      skipped: true,
      reason: "Customer email is missing",
    };
  }

  const safeName = escape(customerName || "there");
  const safeSubject = escape(subject || "Your INCLEX inquiry");
  const safeOriginalMessage = escape(originalMessage || "");
  const safeReply = escape(reply || "");

  const html = shell(`
    <div
      style="font-size:10px;text-transform:uppercase;letter-spacing:.18em;color:#C9A227;margin-bottom:12px"
    >
      INCLEX Support
    </div>

    <h1
      style="font-family:'Playfair Display',Georgia,serif;font-size:28px;margin:0 0 8px"
    >
      Hello ${safeName}.
    </h1>

    <p style="margin:0 0 24px;color:#6B7280;font-size:14px">
      Thank you for contacting INCLEX. Our support team has replied to your
      inquiry.
    </p>

    <div
      style="margin:22px 0;padding:18px;background:#F8F7F4;border:1px solid rgba(0,0,0,.06)"
    >
      <div
        style="font-size:10px;text-transform:uppercase;letter-spacing:.16em;color:#6B7280"
      >
        Subject
      </div>

      <div style="margin-top:8px;font-size:15px;font-weight:600">
        ${safeSubject}
      </div>
    </div>

    <div style="margin-top:28px">
      <div
        style="font-size:10px;text-transform:uppercase;letter-spacing:.16em;color:#6B7280;margin-bottom:10px"
      >
        Your message
      </div>

      <div
        style="padding:16px;border-left:3px solid #D1D5DB;background:#FAFAFA;color:#555;line-height:1.7;white-space:pre-wrap"
      >
        ${safeOriginalMessage}
      </div>
    </div>

    <div style="margin-top:28px">
      <div
        style="font-size:10px;text-transform:uppercase;letter-spacing:.16em;color:#C9A227;margin-bottom:10px"
      >
        INCLEX Support
      </div>

      <div
        style="padding:18px;background:#111;color:#fff;line-height:1.7;white-space:pre-wrap"
      >
        ${safeReply}
      </div>
    </div>

    <p style="margin:28px 0 0;color:#6B7280;font-size:13px">
      If you have any further questions, simply reply to this email.
    </p>
  `);

  try {
    const result = await resend.emails.send({
      from: FROM(),
      to,
      subject: `Re: ${subject || "Your INCLEX inquiry"}`,
      reply_to: FROM(),
      html,
    });

    return {
      ok: true,
      id: result?.data?.id || null,
    };
  } catch (e) {
    console.error("❌ Failed to send inquiry reply:", e);

    return {
      ok: false,
      error: e.message,
    };
  }
}