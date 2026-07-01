import { jsPDF } from "jspdf";
import { formatCurrency, formatDate, formatId } from "@/lib/utils";

type InvoiceItem = {
  name: string;
  qty: number;
  price: number;
};

type InvoiceOrder = {
  id: string;
  createdAt: Date;
  totalPrice: number;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  paymentMethod: string;
  isPaid: boolean;
  paidAt: Date | null;
  isCancelled: boolean;
  shippingAddress: {
    fullName: string;
    streetAddress: string;
    city: string;
    postalCode: string;
    country: string;
  };
  orderitems: InvoiceItem[];
  user?: {
    name: string;
    email: string;
  };
};

export function generateInvoicePDF(order: InvoiceOrder): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Base configurations
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  const marginX = 20;
  let currentY = 25;

  // Colors
  const primaryColor = "#442917"; // Milestone dark brown
  const secondaryColor = "#b04a26"; // Milestone orange-rust
  const textDark = "#2d2d2d";
  const textLight = "#777777";
  const lightBg = "#fdfbf9";
  const lineLight = "#e9dfd9";

  // Helper to draw horizontal lines
  const drawLine = (y: number, color = lineLight) => {
    doc.setDrawColor(color);
    doc.setLineWidth(0.3);
    doc.line(marginX, y, pageWidth - marginX, y);
  };

  // --- 1. HEADER SECTION ---
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(primaryColor);
  doc.text("MILESTONE BOOKS", marginX, currentY);

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(secondaryColor);
  doc.text("INVOICE", pageWidth - marginX - 30, currentY);

  currentY += 8;
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(textLight);
  doc.text("Curated books, combo deals, and bookmarks", marginX, currentY);
  doc.text("milestonebooks.in", marginX, currentY + 4);

  currentY += 12;
  drawLine(currentY);

  // --- 2. ORDER DETAILS GRID ---
  currentY += 10;
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(primaryColor);
  doc.text("BILL TO:", marginX, currentY);
  doc.text("ORDER INFORMATION:", pageWidth / 2 + 10, currentY);

  currentY += 6;
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(textDark);
  
  // Shipping Address block
  const sa = order.shippingAddress;
  const addressLines = [
    sa.fullName,
    sa.streetAddress,
    `${sa.city} - ${sa.postalCode}`,
    sa.country,
  ].filter(Boolean);

  let addressY = currentY;
  addressLines.forEach((line) => {
    doc.text(line, marginX, addressY);
    addressY += 4.5;
  });

  // Order Details block
  let detailsY = currentY;
  const orderDetails = [
    `Invoice ID: #${formatId(order.id)}`,
    `Date: ${formatDate(order.createdAt).dateTime}`,
    `Method: ${order.paymentMethod}`,
    `Status: ${order.isCancelled ? "Cancelled" : order.isPaid ? "Paid" : "Pending Payment"}`,
  ];
  orderDetails.forEach((detail) => {
    doc.text(detail, pageWidth / 2 + 10, detailsY);
    detailsY += 4.5;
  });

  // Move currentY past both grid blocks
  currentY = Math.max(addressY, detailsY) + 8;
  drawLine(currentY);

  // --- 3. PRODUCTS TABLE ---
  currentY += 10;
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(primaryColor);
  doc.text("ITEMS IN ORDER", marginX, currentY);

  currentY += 6;
  
  // Table Header Row Background
  doc.setFillColor("#f9f6f3");
  doc.rect(marginX, currentY, pageWidth - marginX * 2, 8, "F");
  
  doc.setFontSize(9);
  doc.setFont("Helvetica", "bold");
  doc.setTextColor(primaryColor);
  doc.text("Product", marginX + 3, currentY + 5.5);
  doc.text("Qty", pageWidth - marginX - 55, currentY + 5.5);
  doc.text("Unit Price", pageWidth - marginX - 35, currentY + 5.5);
  doc.text("Total", pageWidth - marginX - 10, currentY + 5.5, { align: "right" });

  currentY += 8;

  // Table Body Rows
  doc.setFont("Helvetica", "normal");
  doc.setTextColor(textDark);

  order.orderitems.forEach((item, index) => {
    // Zebra striping for premium look
    if (index % 2 === 1) {
      doc.setFillColor("#fcfaf7");
      doc.rect(marginX, currentY, pageWidth - marginX * 2, 10, "F");
    }

    doc.text(item.name, marginX + 3, currentY + 6.5);
    doc.text(item.qty.toString(), pageWidth - marginX - 55, currentY + 6.5);
    doc.text(`₹${item.price.toFixed(2)}`, pageWidth - marginX - 35, currentY + 6.5);
    
    const rowTotal = item.qty * item.price;
    doc.text(`₹${rowTotal.toFixed(2)}`, pageWidth - marginX - 10, currentY + 6.5, { align: "right" });
    
    currentY += 10;
  });

  drawLine(currentY, "#d6cbc4");

  // --- 4. PRICING TOTALS ---
  currentY += 8;
  const totalsLabelX = pageWidth - marginX - 60;
  const totalsValX = pageWidth - marginX - 10;

  doc.setFontSize(9);
  doc.setTextColor(textLight);
  doc.text("Subtotal:", totalsLabelX, currentY);
  doc.text(`₹${order.itemsPrice.toFixed(2)}`, totalsValX, currentY, { align: "right" });

  currentY += 5;
  doc.text("Tax Price:", totalsLabelX, currentY);
  doc.text(`₹${order.taxPrice.toFixed(2)}`, totalsValX, currentY, { align: "right" });

  currentY += 5;
  doc.text("Shipping Fee:", totalsLabelX, currentY);
  doc.text(`₹${order.shippingPrice.toFixed(2)}`, totalsValX, currentY, { align: "right" });

  currentY += 6;
  drawLine(currentY, "#b04a26");

  currentY += 6;
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(primaryColor);
  doc.text("GRAND TOTAL:", totalsLabelX, currentY);
  doc.text(`₹${order.totalPrice.toFixed(2)}`, totalsValX, currentY, { align: "right" });

  // --- 5. FOOTER ---
  currentY = pageHeight - 30;
  drawLine(currentY);

  currentY += 8;
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(textLight);
  doc.text("Thank you for reading with Milestone Books!", pageWidth / 2, currentY, { align: "center" });
  doc.text("If you have any questions about this invoice, contact support@milestonebooks.in", pageWidth / 2, currentY + 4, { align: "center" });

  return doc;
}
