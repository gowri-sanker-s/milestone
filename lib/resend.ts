import { Resend } from "resend";
import { prisma } from "./prisma";
import { formatCurrency, formatDate } from "./utils";

const resendApiKey = process.env.RESEND_API;
const adminEmail = process.env.ADMIN_EMAIL || "amyv461@gmail.com";

// Initialize Resend with key or dummy to prevent crash on missing key during builds
const resend = new Resend(resendApiKey || "re_dummy");

interface ShippingAddress {
  fullName: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string;
}

/**
 * Sends order confirmation emails to the user and a notification to the administrator.
 */
export async function sendOrderConfirmationEmail(orderId: string, paymentStatus?: "SUCCESS" | "FAILED") {
  if (!resendApiKey) {
    console.warn("RESEND_API key is not set. Skipping order emails.");
    return;
  }

  try {
    // Fetch detailed order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderitems: true,
        user: { select: { name: true, email: true } },
      },
    });

    if (!order) {
      console.error(`Order not found for Resend email: ${orderId}`);
      return;
    }

    const { user, orderitems, totalPrice, itemsPrice, taxPrice, shippingPrice, createdAt, paymentMethod, isPaid, paidAt } = order;
    const address = order.shippingAddress as unknown as ShippingAddress;

    const formattedDate = formatDate(createdAt).dateTime;
    const currentYear = new Date().getFullYear();

    // Format currency fields
    const formattedTotalPrice = formatCurrency(totalPrice);
    const formattedItemsPrice = formatCurrency(itemsPrice);
    const formattedTaxPrice = formatCurrency(taxPrice);
    const formattedShippingPrice = formatCurrency(shippingPrice);

    let paymentStatusText = "Pending Payment";
    let paymentStatusColorStyle = "background-color: #e9dfd9; color: #442917; border: 1px solid #d6cbc4;";

    if (paymentStatus === "SUCCESS" || isPaid) {
      paymentStatusText = `Paid on ${formatDate(paidAt || new Date()).dateTime}`;
      paymentStatusColorStyle = "background-color: #442917; color: #ffffff;";
    } else if (paymentStatus === "FAILED") {
      paymentStatusText = "Failed";
      paymentStatusColorStyle = "background-color: #fce8e6; color: #a51b24; border: 1px solid #f3c2c2;";
    }

    // Generate items rows
    let itemsHtml = "";
    for (const item of orderitems) {
      itemsHtml += `
        <tr style="border-bottom: 1px solid #d6cbc4;">
          <td style="padding: 16px 0; font-size: 14px; color: #442917; font-weight: 500;">
            <div style="display: flex; align-items: center;">
              ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width: 44px; height: 56px; object-fit: cover; border-radius: 6px; margin-right: 16px; border: 1px solid #d6cbc4;" />` : ""}
              <div style="display: inline-block; vertical-align: middle;">
                <span style="font-weight: 700; color: #442917; font-size: 15px; display: block; font-family: Georgia, serif;">${item.name}</span>
              </div>
            </div>
          </td>
          <td style="padding: 16px 0; font-size: 14px; color: #442917; text-align: center; font-weight: 600;">${item.qty}</td>
          <td style="padding: 16px 0; font-size: 14px; color: #442917; text-align: right; font-weight: 700;">${formatCurrency(item.price)}</td>
        </tr>
      `;
    }

    const logoUrl = `https://res.cloudinary.com/doaukkerp/image/upload/v1782071677/logo_i8gszq.png`;

    // Base Email layout
    const emailLayout = (title: string, bodyContent: string) => `
      <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9f6f3; padding: 40px 20px; color: #442917; min-height: 100%;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(68, 41, 23, 0.05), 0 8px 16px -8px rgba(68, 41, 23, 0.05); border: 1px solid #d6cbc4;">
          <!-- Header -->
          <div style="text-align: center; padding: 32px 24px; background-color: #e9dfd9; border-bottom: 1px solid #d6cbc4;">
            <img src="${logoUrl}" alt="Milestone Books" style="width: 80px; height: 80px; object-fit: cover; display: block; margin: 0 auto; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 4px 10px rgba(68, 41, 23, 0.15);" />
            <h1 style="margin: 16px 0 0 0; font-size: 24px; font-weight: 700; color: #442917; letter-spacing: -0.5px; text-transform: lowercase; font-family: Georgia, serif;">milestone books</h1>
            <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.8; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; color: #442917;">${title}</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 32px 24px;">
            ${bodyContent}
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f9f6f3; padding: 24px; text-align: center; border-top: 1px solid #d6cbc4; font-size: 12px; color: #7a6e65;">
            <p style="margin: 0 0 8px 0; line-height: 1.5;">This email was sent regarding your activity at Milestone Books.</p>
            <p style="margin: 0; font-weight: 600;">&copy; ${currentYear} Milestone Books. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;

    // Customer email content
    const customerBody = `
      <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 700; color: #442917; font-family: Georgia, serif;">Thank you for your purchase!</h2>
      <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #442917; opacity: 0.9;">
        Hi <strong>${user.name}</strong>, we've received your order and we're getting it ready to ship. Below are your order details and summary.
      </p>
      
      <div style="background-color: #f9f6f3; border-radius: 12px; padding: 16px; margin-bottom: 24px; border: 1px solid #d6cbc4;">
        <div style="font-size: 13px; color: #7a6e65; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Order ID</div>
        <div style="font-size: 17px; font-weight: 700; color: #442917; font-family: monospace;">#${orderId}</div>
        <div style="font-size: 13px; color: #7a6e65; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 12px; margin-bottom: 4px;">Placed on</div>
        <div style="font-size: 15px; font-weight: 600; color: #442917;">${formattedDate}</div>
      </div>
      
      <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #7a6e65;">Order Summary</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <thead>
          <tr style="border-bottom: 2px solid #d6cbc4; text-align: left;">
            <th style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #7a6e65;">Item</th>
            <th style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #7a6e65; text-align: center; width: 60px;">Qty</th>
            <th style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #7a6e65; text-align: right; width: 100px;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      
      <div style="background-color: #e9dfd9; border-radius: 12px; padding: 20px; margin-bottom: 24px; border: 1px solid #d6cbc4;">
        <table style="width: 100%; font-size: 14px; border-collapse: collapse; color: #442917;">
          <tr>
            <td style="padding: 6px 0; font-weight: 500; opacity: 0.8;">Items Price</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 600;">${formattedItemsPrice}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: 500; opacity: 0.8;">Tax</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 600;">${formattedTaxPrice}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: 500; opacity: 0.8;">Shipping</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 600;">${formattedShippingPrice}</td>
          </tr>
          <tr style="border-top: 1px solid #d6cbc4;">
            <td style="padding: 12px 0 0 0; font-weight: 700; font-size: 17px; color: #442917;">Total Price</td>
            <td style="padding: 12px 0 0 0; text-align: right; font-weight: 800; font-size: 17px; color: #442917;">${formattedTotalPrice}</td>
          </tr>
        </table>
      </div>
      
      <div style="border-top: 1px solid #d6cbc4; padding-top: 24px; width: 100%;">
        <div style="float: left; width: 48%; padding-right: 2%; min-height: 120px;">
          <h4 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #7a6e65;">Shipping Address</h4>
          <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #442917;">
            <strong>${address.fullName}</strong><br/>
            ${address.streetAddress}<br/>
            ${address.city}, ${address.postalCode}<br/>
            ${address.country}
          </p>
        </div>
        <div style="float: right; width: 48%; padding-left: 2%; min-height: 120px;">
          <h4 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #7a6e65;">Payment Info</h4>
          <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #442917;">
            Method: <strong>${paymentMethod}</strong><br/>
            Status: <span style="display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; ${paymentStatusColorStyle}">${paymentStatusText}</span>
          </p>
        </div>
        <div style="clear: both;"></div>
      </div>
    `;

    // Admin email content
    const adminBody = `
      <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 700; color: #442917; font-family: Georgia, serif;">New Order Placed</h2>
      <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #442917; opacity: 0.9;">
        Customer <strong>${user.name}</strong> (${user.email}) has just placed a new order.
      </p>
      
      <div style="background-color: #f9f6f3; border-radius: 12px; padding: 16px; margin-bottom: 24px; border: 1px solid #d6cbc4;">
        <div style="font-size: 13px; color: #7a6e65; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Order ID</div>
        <div style="font-size: 17px; font-weight: 700; color: #442917; font-family: monospace;">#${orderId}</div>
        <div style="font-size: 13px; color: #7a6e65; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 12px; margin-bottom: 4px;">Placed on</div>
        <div style="font-size: 15px; font-weight: 600; color: #442917;">${formattedDate}</div>
      </div>
      
      <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #7a6e65;">Order Summary</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <thead>
          <tr style="border-bottom: 2px solid #d6cbc4; text-align: left;">
            <th style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #7a6e65;">Item</th>
            <th style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #7a6e65; text-align: center; width: 60px;">Qty</th>
            <th style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #7a6e65; text-align: right; width: 100px;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      
      <div style="background-color: #e9dfd9; border-radius: 12px; padding: 20px; margin-bottom: 24px; border: 1px solid #d6cbc4;">
        <table style="width: 100%; font-size: 14px; border-collapse: collapse; color: #442917;">
          <tr>
            <td style="padding: 6px 0; font-weight: 500; opacity: 0.8;">Items Price</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 600;">${formattedItemsPrice}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: 500; opacity: 0.8;">Tax</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 600;">${formattedTaxPrice}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: 500; opacity: 0.8;">Shipping</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 600;">${formattedShippingPrice}</td>
          </tr>
          <tr style="border-top: 1px solid #d6cbc4;">
            <td style="padding: 12px 0 0 0; font-weight: 700; font-size: 17px; color: #442917;">Total Price</td>
            <td style="padding: 12px 0 0 0; text-align: right; font-weight: 800; font-size: 17px; color: #442917;">${formattedTotalPrice}</td>
          </tr>
        </table>
      </div>
      
      <div style="border-top: 1px solid #d6cbc4; padding-top: 24px; width: 100%;">
        <div style="float: left; width: 48%; padding-right: 2%; min-height: 120px;">
          <h4 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #7a6e65;">Shipping Address</h4>
          <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #442917;">
            <strong>${address.fullName}</strong><br/>
            ${address.streetAddress}<br/>
            ${address.city}, ${address.postalCode}<br/>
            ${address.country}
          </p>
        </div>
        <div style="float: right; width: 48%; padding-left: 2%; min-height: 120px;">
          <h4 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #7a6e65;">Payment Info</h4>
          <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #442917;">
            Method: <strong>${paymentMethod}</strong><br/>
            Status: <span style="display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; ${paymentStatusColorStyle}">${paymentStatusText}</span>
          </p>
        </div>
        <div style="clear: both;"></div>
      </div>
    `;

    const fromName = user.name && user.name !== "NO_NAME" ? user.name : "Customer";

    let customerSubject = `Your Milestone Books Receipt - Order #${orderId.substring(0, 8)}`;
    let customerTitle = `Order Receipt - #${orderId.substring(0, 8)}`;
    let adminSubject = `New Order Placed: #${orderId.substring(0, 8)} by ${fromName}`;
    let adminTitle = `Admin Alert: New Order Placed`;

    if (paymentStatus === "FAILED") {
      customerSubject = `Payment Failed for Order #${orderId.substring(0, 8)} - Milestone Books`;
      customerTitle = `Payment Failed - #${orderId.substring(0, 8)}`;
      adminSubject = `Payment FAILED: #${orderId.substring(0, 8)} by ${fromName}`;
      adminTitle = `Admin Alert: Payment Failed`;
    }

    // 1. Send confirmation email to Customer (Try-catch wrapped for Sandbox safety)
    try {
      console.log(`Sending order confirmation to customer: ${user.email}`);
      await resend.emails.send({
        from: "Milestone Books <onboarding@resend.dev>",
        to: user.email,
        subject: customerSubject,
        html: emailLayout(customerTitle, customerBody),
      });
      console.log(`Order confirmation successfully sent to ${user.email}`);
    } catch (customerEmailErr) {
      console.error(`Failed to send order email to customer (${user.email}):`, customerEmailErr);
    }

    // 2. Send notification email to Admin
    try {
      console.log(`Sending new order notification to admin: ${adminEmail}`);
      await resend.emails.send({
        from: `${fromName} via Milestone <onboarding@resend.dev>`,
        to: adminEmail,
        replyTo: user.email,
        subject: adminSubject,
        html: emailLayout(adminTitle, adminBody),
      });
      console.log(`Admin order notification successfully sent to ${adminEmail}`);
    } catch (adminEmailErr) {
      console.error(`Failed to send order notification to admin (${adminEmail}):`, adminEmailErr);
    }

  } catch (error) {
    console.error("Critical error in sendOrderConfirmationEmail handler:", error);
  }
}

/**
 * Sends contact form inquiry details to the admin and a copy/receipt to the submitter.
 */
export async function sendContactFormEmail(messageId: string) {
  if (!resendApiKey) {
    console.warn("RESEND_API key is not set. Skipping contact form emails.");
    return;
  }

  try {
    // Fetch contact message details
    const message = await prisma.contactMessage.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      console.error(`Contact message not found for Resend email: ${messageId}`);
      return;
    }

    const { name, email, phone, reason, description, bookName, author } = message;
    const currentYear = new Date().getFullYear();

    const bookRequestGridRow = reason === "book_request"
      ? `
        <tr style="border-bottom: 1px solid #d6cbc4;">
          <td style="padding: 10px 0; color: #7a6e65; font-weight: 600; width: 120px;">Book Title:</td>
          <td style="padding: 10px 0; color: #442917; font-weight: 700; font-family: Georgia, serif;">${bookName}</td>
        </tr>
        <tr style="border-bottom: 1px solid #d6cbc4;">
          <td style="padding: 10px 0; color: #7a6e65; font-weight: 600;">Book Author:</td>
          <td style="padding: 10px 0; color: #442917; font-weight: 700; font-family: Georgia, serif;">${author}</td>
        </tr>
      `
      : "";

    const bookRequestReceiptSummary = reason === "book_request"
      ? `
        <div style="margin-bottom: 16px; font-weight: 700; color: #442917; font-family: Georgia, serif; font-size: 16px; border-bottom: 1px solid #d6cbc4; padding-bottom: 10px;">
          Requested Book: <span style="font-style: italic;">"${bookName}"</span> by ${author}
        </div>
      `
      : "";

    const logoUrl = `${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"}/logo.png`;

    // Base Email layout
    const emailLayout = (title: string, bodyContent: string) => `
      <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9f6f3; padding: 40px 20px; color: #442917; min-height: 100%;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(68, 41, 23, 0.05), 0 8px 16px -8px rgba(68, 41, 23, 0.05); border: 1px solid #d6cbc4;">
          <!-- Header -->
          <div style="text-align: center; padding: 32px 24px; background-color: #e9dfd9; border-bottom: 1px solid #d6cbc4;">
            <img src="${logoUrl}" alt="Milestone Books" style="width: 80px; height: 80px; object-fit: cover; display: block; margin: 0 auto; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 4px 10px rgba(68, 41, 23, 0.15);" />
            <h1 style="margin: 16px 0 0 0; font-size: 24px; font-weight: 700; color: #442917; letter-spacing: -0.5px; text-transform: lowercase; font-family: Georgia, serif;">milestone books</h1>
            <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.8; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; color: #442917;">${title}</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 32px 24px;">
            ${bodyContent}
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f9f6f3; padding: 24px; text-align: center; border-top: 1px solid #d6cbc4; font-size: 12px; color: #7a6e65;">
            <p style="margin: 0 0 8px 0; line-height: 1.5;">This email was automatically generated from the Milestone Books website.</p>
            <p style="margin: 0; font-weight: 600;">&copy; ${currentYear} Milestone Books. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;

    // Admin email content
    const adminBody = `
      <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 700; color: #442917; font-family: Georgia, serif;">New Message Received</h2>
      <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #442917; opacity: 0.9;">
        You have received a new contact submission with the details listed below:
      </p>
      
      <div style="background-color: #f9f6f3; border-radius: 12px; padding: 20px; margin-bottom: 24px; border: 1px solid #d6cbc4;">
        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #d6cbc4;">
            <td style="padding: 10px 0; color: #7a6e65; width: 120px; font-weight: 600;">Name:</td>
            <td style="padding: 10px 0; color: #442917; font-weight: 700;">${name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #d6cbc4;">
            <td style="padding: 10px 0; color: #7a6e65; font-weight: 600;">Email:</td>
            <td style="padding: 10px 0; color: #442917;"><a href="mailto:${email}" style="color: #442917; text-decoration: underline; font-weight: 700;">${email}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #d6cbc4;">
            <td style="padding: 10px 0; color: #7a6e65; font-weight: 600;">Phone:</td>
            <td style="padding: 10px 0; color: #442917; font-weight: 600;">${phone || "Not provided"}</td>
          </tr>
          <tr style="border-bottom: 1px solid #d6cbc4;">
            <td style="padding: 10px 0; color: #7a6e65; font-weight: 600;">Reason:</td>
            <td style="padding: 10px 0; color: #442917; font-weight: 700; text-transform: capitalize;">${reason.replace("_", " ")}</td>
          </tr>
          ${bookRequestGridRow}
        </table>
      </div>
      
      <h3 style="margin: 0 0 12px 0; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #7a6e65;">Message Details</h3>
      <div style="background-color: #e9dfd9; border-left: 4px solid #442917; padding: 16px; margin: 0; font-size: 15px; line-height: 1.6; color: #442917; font-style: italic; white-space: pre-wrap; border-radius: 0 12px 12px 0;">
        "${description}"
      </div>
    `;

    // Customer receipt content
    const customerBody = `
      <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 700; color: #442917; font-family: Georgia, serif;">Thank you for contacting us!</h2>
      <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #442917; opacity: 0.9;">
        Hi <strong>${name}</strong>,<br/><br/>
        We've successfully received your message regarding <strong>${reason.replace("_", " ")}</strong>. Our curating team is currently reviewing your inquiry and will get back to you shortly.
      </p>
      
      <h3 style="margin: 0 0 12px 0; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #7a6e65;">Inquiry Summary</h3>
      <div style="background-color: #f9f6f3; border-radius: 12px; padding: 20px; border: 1px solid #d6cbc4; font-size: 14px; line-height: 1.6; color: #442917;">
        ${bookRequestReceiptSummary}
        <div style="font-style: italic; white-space: pre-wrap; margin-top: 4px;">"${description}"</div>
      </div>
    `;

    // 1. Send notification email to Admin (with reply-to pointing to the sender)
    try {
      console.log(`Sending contact form notification to admin: ${adminEmail}`);
      await resend.emails.send({
        from: `${name} via Milestone <onboarding@resend.dev>`,
        to: adminEmail,
        replyTo: email,
        subject: `New Inquiry [${reason.toUpperCase().replace("_", " ")}]: ${name}`,
        html: emailLayout(`New Contact Inquiry - ${name}`, adminBody),
      });
      console.log(`Admin contact form notification successfully sent to ${adminEmail}`);
    } catch (adminErr) {
      console.error(`Failed to send contact notification to admin (${adminEmail}):`, adminErr);
    }

    // 2. Send receipt email to Submitter (Try-catch wrapped for Sandbox safety)
    try {
      console.log(`Sending contact receipt to submitter: ${email}`);
      await resend.emails.send({
        from: "Milestone Books <onboarding@resend.dev>",
        to: email,
        subject: `We've received your inquiry - Milestone Books`,
        html: emailLayout("We Received Your Message", customerBody),
      });
      console.log(`Contact receipt successfully sent to ${email}`);
    } catch (submitterErr) {
      console.error(`Failed to send contact receipt to submitter (${email}):`, submitterErr);
    }

  } catch (error) {
    console.error("Critical error in sendContactFormEmail handler:", error);
  }
}
