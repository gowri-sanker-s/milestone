"use client";

import {
  updateCODOrderToPaid,
  updateCODOrderToDelivered,
  updateOrderToShipped,
} from "@/lib/actions/order.action";
import { funnel } from "@/lib/fonts";
import { formatCurrency, formatDate, formatId } from "@/lib/utils";
import { Order } from "@/types";
import { generateInvoicePDF } from "@/lib/utils/invoice-pdf";
import Image from "next/image";
import truck from "@/assets/icons/deliveryTruck.svg";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, ExternalLink, Truck, Check } from "lucide-react";

const OrderDetailsTable = ({
  order,
  isAdmin,
}: {
  order: Order;
  isAdmin: boolean;
}) => {
  const {
    id,
    createdAt,
    isPaid,
    paidAt,
    isShipped,
    shippedAt,
    isDelivered,
    deliveredAt,
    isCancelled,
    cancelledAt,
    trackingNumber,
    carrier,
    orderitems,
    user,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    shippingAddress,
    paymentResult,
  } = order;
  const parsedPaymentResult = paymentResult as { state?: string } | null;
  const isPaymentFailed = parsedPaymentResult?.state === "FAILED";
  const [isDeliveredUpdate, setIsDeliveredUpdate] = useState(isDelivered);

  // Tracking & Fulfillment States
  const [adminTrackingNumber, setAdminTrackingNumber] = useState(
    trackingNumber || "",
  );
  const [adminCarrier, setAdminCarrier] = useState(carrier || "India Post");
  const [editTrackingMode, setEditTrackingMode] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyTracking = () => {
    if (trackingNumber) {
      navigator.clipboard.writeText(trackingNumber);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
  };

  const [isShippingPending, startShippingTransition] = useTransition();
  const [isDeliveryPending, startDeliveryTransition] = useTransition();

  const handleDownloadInvoice = () => {
    try {
      const doc = generateInvoicePDF({
        ...order,
        shippingAddress: shippingAddress as any,
      });
      doc.save(`invoice_${id.slice(0, 8)}.pdf`);
      toast.success("Invoice downloaded successfully");
    } catch (error) {
      console.error("Failed to generate invoice:", error);
      toast.error("Failed to generate invoice");
    }
  };

  const handleMarkAsShipped = () => {
    if (!adminTrackingNumber.trim()) {
      toast.error("Please enter a tracking number");
      return;
    }
    startShippingTransition(async () => {
      const res = await updateOrderToShipped({
        id,
        trackingNumber: adminTrackingNumber,
        carrier: adminCarrier,
      });
      if (res.success) {
        toast.success(res.message);
        setEditTrackingMode(false);
      } else {
        toast.error(res.message);
      }
    });
  };

  const handleMarkAsDelivered = () => {
    startDeliveryTransition(async () => {
      const res = await updateCODOrderToDelivered(id);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };

  const MarkAsPaidButton = () => {
    const [isPending, startTransition] = useTransition();
    return (
      <button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await updateCODOrderToPaid(id);
            if (res.success) {
              toast.success(res.message);
            } else {
              toast.error(res.message);
            }
          })
        }
        className="w-fit bg-primary-text text-white px-4 py-2 rounded-md mt-5"
      >
        {isPending ? "Processing" : "Mark as paid"}
      </button>
    );
  };
  return (
    <div className="wrapper py-10">
      <div className="flex gap-3 items-center justify-between mb-10">
        <h1 className={`${funnel.className} text-[30px] font-semibold`}>
          Order{" "}
          <span className="text-gray-500 opacity-60">#{formatId(id)}</span>
        </h1>
        <button
          onClick={handleDownloadInvoice}
          className="bg-primary-text hover:bg-primary-text/90 text-white font-bold text-xs p-2.5 px-4 rounded-xl shadow-sm transition-all active:scale-95"
        >
          Download Invoice
        </button>
      </div>
      {/* display the list of items in the order ui as in the cart page */}
      <div className="flex flex-col lg:flex-row items-start gap-10">
        <div className="left flex-1">
          <h3 className={`${funnel.className} text-[25px] font-semibold`}>
            Order Items
          </h3>
          <>
            {/* Column labels — hidden on mobile */}
            <div className="hidden sm:grid grid-cols-[1fr_auto_auto] gap-4 px-6 pl-0 py-3 text-xs font-semibold uppercase tracking-widest opacity-50 border-b border-primary-text/10">
              <span>Product</span>
              <span className="text-center w-28">Quantity</span>
              <span className="text-right w-24">Price</span>
            </div>

            {/* Items */}
            <ul className="divide-y divide-primary-text/10">
              {orderitems.map((item) => (
                <li
                  key={item.productId}
                  className="px-4 pl-0 sm:px-6 sm:pl-0 py-4"
                >
                  <div className="flex  gap-3 sm:hidden">
                    {/* Image */}
                    <div className="h-[70px] w-[80px] flex-shrink-0 rounded-xl overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex flex-col flex-1 gap-2 min-w-0">
                      <p
                        className={`${funnel.className} font-semibold text-[16px] leading-tight`}
                      >
                        {item.name}
                      </p>
                      <div className="flex items-center justify-between">
                        {/* Qty controls */}
                        <div className="flex items-center gap-2">
                          <span className="w-5 text-center text-sm font-semibold">
                            {item.qty}
                          </span>
                        </div>

                        {/* Price */}
                        <span className="text-[16px] font-bold">
                          {formatCurrency(item.price)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Desktop layout: grid row */}
                  <div className="hidden sm:grid grid-cols-[1fr_auto_auto] gap-4 items-center">
                    {/* Name + image */}
                    <div className="flex gap-3 items-center min-w-0">
                      <div className="h-[70px] w-[90px] flex-shrink-0 rounded-xl overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <p
                        className={`${funnel.className} font-semibold text-[20px] truncate pr-2`}
                      >
                        {item.name}
                      </p>
                    </div>

                    {/* Qty controls */}
                    <div className="flex items-center gap-2 w-28 justify-center">
                      <span className="w-5 text-center text-[17px] font-semibold">
                        {item.qty}
                      </span>
                    </div>

                    {/* Price */}
                    <span className="text-[18px] font-bold text-right w-24">
                      {formatCurrency(item.price)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </>
        </div>
        <div className="right min-w-[30%]">
          <div className="border border-primary-text/30 rounded-xl p-5 bg-primary-border mt-5">
            <h3 className="text-xl font-bold mb-3">Order Summary</h3>
            <p className="flex justify-between items-center py-2">
              Items Price:{" "}
              <span className="font-semibold">
                {formatCurrency(itemsPrice)}
              </span>
            </p>
            <p className="flex justify-between items-center py-2">
              Tax Price:{" "}
              <span className="font-semibold">{formatCurrency(taxPrice)}</span>
            </p>
            <p className="flex justify-between items-center py-2">
              Shipping Price:{" "}
              <span className="font-semibold">
                {formatCurrency(shippingPrice)}
              </span>
            </p>
            <p className="flex justify-between items-center py-2">
              Total Price:{" "}
              <span className="font-semibold">
                {formatCurrency(totalPrice)}
              </span>
            </p>

            {isAdmin && !isPaid && paymentMethod === "CashOnDelivery" && (
              <MarkAsPaidButton />
            )}

            <Dialog
              open={isTrackingModalOpen}
              onOpenChange={setIsTrackingModalOpen}
            >
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="w-full bg-primary-text text-white px-4 py-2.5 rounded-md mt-4 font-semibold text-center hover:opacity-90 transition-opacity"
                >
                  Track your order
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-[550px] bg-primary-bg flex flex-col border-none p-6 rounded-2xl">
                <DialogHeader>
                  <DialogTitle
                    className={`${funnel.className} text-xl font-bold`}
                  >
                    Track Your Order
                  </DialogTitle>
                  <DialogDescription>
                    Real-time status of your package shipment.
                  </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-6">
                  {/* Timeline */}
                  <div className="relative border-l border-primary-text/20 ml-4 space-y-6 pb-2">
                    {/* Step 1: Placed */}
                    <div className="relative pl-8">
                      <div className="absolute -left-[9px] top-1 bg-green-500 rounded-full p-0.5 text-white">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">Order Placed</h4>
                        <p className="text-xs opacity-60">
                          Your order has been recorded in our system.
                        </p>
                        <p className="text-[10px] opacity-40 font-mono mt-0.5">
                          #{formatId(id)}
                        </p>
                      </div>
                    </div>

                    {isCancelled ? (
                      <div className="relative pl-8">
                        <div className="absolute -left-[9px] top-1 bg-red-500 rounded-full p-0.5 text-white">
                          <Clock className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-red-600 font-bold">Order Cancelled</h4>
                          <p className="text-xs opacity-60 text-red-600 font-medium mt-1">
                            Cancelled on {formatDate(cancelledAt!).dateTime} due to payment timeout.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Step 2: Paid */}
                        <div className="relative pl-8">
                          <div
                            className={`absolute -left-[9px] top-1 rounded-full p-0.5 text-white ${isPaid ? "bg-green-500" : "bg-amber-500"}`}
                          >
                            {isPaid ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <Clock className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm">
                              Payment Status
                            </h4>
                            <p className="text-xs opacity-60">
                              {isPaid
                                ? `Confirmed on ${formatDate(paidAt!).dateTime}`
                                : isPaymentFailed
                                  ? "Payment verification failed"
                                  : "Awaiting payment verification"}
                            </p>
                          </div>
                        </div>

                        {/* Step 3: Shipped */}
                        <div className="relative pl-8">
                          <div
                            className={`absolute -left-[9px] top-1 rounded-full p-0.5 text-white ${isShipped ? "bg-green-500" : "bg-gray-300"}`}
                          >
                            {isShipped ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <Truck className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm">Shipped</h4>
                            <p className="text-xs opacity-60 font-medium">
                              {isShipped
                                ? `Dispatched via ${carrier || "India Post"} on ${formatDate(shippedAt!).dateTime}`
                                : "We are packing your books. Dispatches are processed soon."}
                            </p>
                            {isShipped && trackingNumber && (
                              <div className="bg-primary-border/40 border border-primary-text/10 rounded-lg p-2.5 mt-2 flex justify-between items-center max-w-sm">
                                <div>
                                  <span className="text-[9px] uppercase tracking-wider text-gray-500 block">
                                    Consignment Number
                                  </span>
                                  <span className="font-mono text-sm font-bold text-primary-text">
                                    {trackingNumber}
                                  </span>
                                </div>
                                {!isDelivered && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs h-7 px-2 min-w-[65px]"
                                    onClick={handleCopyTracking}
                                  >
                                    {copied ? "Copied!" : "Copy"}
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Step 4: Delivered */}
                        <div className="relative pl-8">
                          <div
                            className={`absolute -left-[9px] top-1 rounded-full p-0.5 text-white ${isDelivered ? "bg-green-500" : "bg-gray-200"}`}
                          >
                            {isDelivered ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Clock className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm">Delivered</h4>
                            <p className="text-xs opacity-60">
                              {isDelivered && deliveredAt
                                ? `Delivered on ${formatDate(deliveredAt).dateTime}`
                                : "Awaiting delivery confirmation"}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {isShipped &&
                    !isDelivered &&
                    trackingNumber &&
                    carrier === "India Post" && (
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-xs space-y-2">
                        <p className="font-bold text-amber-900">
                          How to track your India Post package:
                        </p>
                        <ol className="list-decimal pl-4 space-y-1 text-amber-800 font-medium">
                          <li>
                            Copy the Consignment Number:{" "}
                            <code className="font-mono bg-amber-500/20 px-1 rounded font-bold">
                              {trackingNumber}
                            </code>
                          </li>
                          <li>
                            Click the button below to open the official India
                            Post portal.
                          </li>
                          <li>
                            Paste it into the{" "}
                            <strong>Consignment Number</strong> box, solve the
                            Captcha, and click search.
                          </li>
                        </ol>
                        <a
                          href="https://www.indiapost.gov.in/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex gap-1.5 items-center justify-center bg-primary-text text-white px-4 py-2.5 rounded-lg font-bold hover:opacity-90 transition-opacity mt-2 text-xs"
                        >
                          Go to India Post Portal
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* payment-method and shipping address */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-6 mt-10">
        <div className="border rounded-2xl border-primary-text/20 p-6 flex flex-col justify-between min-h-[220px]">
          <div>
            <div className="flex justify-between items-start gap-4 mb-5">
              <h3 className={`${funnel.className} text-[24px] font-bold`}>
                Payment Method
              </h3>
              <span
                className={`${funnel.className} text-[13px] font-bold rounded-full px-4 py-1 ${
                  isCancelled
                    ? "bg-red-100 text-red-600"
                    : isPaid
                      ? "bg-green-100 text-green-600"
                      : isPaymentFailed
                        ? "bg-red-100 text-red-600"
                        : "bg-amber-100 text-amber-600"
                }`}
              >
                {isCancelled
                  ? "Cancelled"
                  : isPaid
                    ? "Paid"
                    : isPaymentFailed
                      ? "Failed"
                      : "Pending Payment"}
              </span>
            </div>

            <div className="space-y-1">
              <span
                className={`${funnel.className} text-[11px] uppercase tracking-wider text-gray-500 font-semibold block`}
              >
                Provider
              </span>
              <p className="text-[17px] font-medium">{paymentMethod}</p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-primary-text/10">
            {isCancelled && cancelledAt && (
              <p className="text-[13px] font-semibold text-red-600">
                Cancelled on {formatDate(cancelledAt).dateTime} due to payment timeout.
              </p>
            )}
            {!isCancelled && isPaid && paidAt && (
              <p className="text-[13px] font-semibold text-gray-600">
                Paid on {formatDate(paidAt!).dateTime}
              </p>
            )}
            {!isCancelled && isPaymentFailed && (
              <p className="text-[13px] font-semibold text-red-600">
                Payment verification failed. Please check your bank or contact
                support.
              </p>
            )}
            {!isCancelled && !isPaid && !isPaymentFailed && (
              <p className="text-[13px] font-semibold text-amber-700">
                Awaiting payment completion.
              </p>
            )}
          </div>
        </div>

        <div className="shipping-address border rounded-2xl border-primary-text/20 p-6 flex flex-col justify-between min-h-[220px]">
          <div>
            <div className="flex items-center justify-between gap-4 mb-5">
              <h3 className={`${funnel.className} text-[24px] font-bold`}>
                Shipping Address
              </h3>
              <span
                className={`${funnel.className} text-[13px] font-bold rounded-full px-4 py-1 ${
                  isCancelled
                    ? "bg-red-100 text-red-600"
                    : isDelivered
                      ? "bg-green-100 text-green-600"
                      : isShipped
                        ? "bg-blue-100 text-blue-600"
                        : "bg-amber-100 text-amber-600"
                }`}
              >
                {isCancelled
                  ? "Cancelled"
                  : isDelivered
                    ? "Delivered"
                    : isShipped
                      ? "Shipped"
                      : "Not Shipped"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-1">
                <span
                  className={`${funnel.className} text-[11px] uppercase tracking-wider text-gray-500 font-semibold block`}
                >
                  Full Name
                </span>
                <p className="text-[16px] font-medium">
                  {shippingAddress.fullName}
                </p>
              </div>

              <div className="space-y-1">
                <span
                  className={`${funnel.className} text-[11px] uppercase tracking-wider text-gray-500 font-semibold block`}
                >
                  City
                </span>
                <p className="text-[16px] font-medium">
                  {shippingAddress.city}
                </p>
              </div>

              <div className="space-y-1">
                <span
                  className={`${funnel.className} text-[11px] uppercase tracking-wider text-gray-500 font-semibold block`}
                >
                  Postal Code
                </span>
                <p className="text-[16px] font-medium">
                  {shippingAddress.postalCode}
                </p>
              </div>

              <div className="space-y-1">
                <span
                  className={`${funnel.className} text-[11px] uppercase tracking-wider text-gray-500 font-semibold block`}
                >
                  Country
                </span>
                <p className="text-[16px] font-medium">
                  {shippingAddress.country}
                </p>
              </div>
            </div>
          </div>

          {/* {isShipped && trackingNumber && (
            <div className="mt-6 pt-4 border-t border-primary-text/10 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-primary-border/20 p-3 rounded-xl border border-primary-text/10">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block">
                    Tracking ID ({carrier || "India Post"})
                  </span>
                  <span className="font-mono text-sm font-bold text-primary-text">
                    {trackingNumber}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-8 px-2.5 min-w-[65px]"
                    onClick={handleCopyTracking}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                  {carrier === "India Post" && (
                    <a
                      href="https://www.indiapost.gov.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex gap-1.5 items-center justify-center bg-primary-text text-white px-3 py-1.5 rounded-md font-bold text-xs hover:opacity-90 transition-opacity"
                    >
                      Track Portal
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
              {shippedAt && (
                <p className="text-[11px] text-gray-500 font-medium">
                  Dispatched on {formatDate(shippedAt).dateTime}
                </p>
              )}
            </div>
          )} */}

          {isDelivered && deliveredAt && (
            <div
              className={`mt-4 pt-4 border-t border-primary-text/10 ${isShipped ? "border-dashed" : ""}`}
            >
              <p className="text-[13px] font-semibold text-gray-600">
                Delivered on {formatDate(deliveredAt!).dateTime}
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Admin Fulfillment Panel */}
      {isAdmin && (
        <div className="border rounded-2xl border-primary-text/20 p-6 bg-primary-border/20 mt-10">
          <h3 className={`${funnel.className} text-[24px] font-bold mb-4`}>
            Admin Fulfillment Panel
          </h3>

          {isCancelled ? (
            <p className="text-sm text-red-600 font-semibold">
              This order has been cancelled due to payment timeout. No fulfillment actions can be performed.
            </p>
          ) : !isShipped ? (
            <div className="space-y-4 max-w-1/2">
              <p className="text-sm opacity-70">
                This order has not been shipped yet. Pack the books, visit India
                Post to ship, and enter the consignment tracking number below to
                mark the order as shipped.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="space-y-1.5 flex-1 w-full">
                  <Label htmlFor="adminTrackingNumber">
                    Tracking / Consignment Number
                  </Label>
                  <Input
                    id="adminTrackingNumber"
                    type="text"
                    placeholder="e.g., RT123456789IN"
                    value={adminTrackingNumber}
                    onChange={(e) => setAdminTrackingNumber(e.target.value)}
                    className="bg-white border-primary-text/20"
                  />
                </div>
                <div className="space-y-1.5 flex-1 w-full">
                  <Label htmlFor="adminCarrier">Carrier</Label>
                  <select
                    id="adminCarrier"
                    value={adminCarrier}
                    onChange={(e) => setAdminCarrier(e.target.value)}
                    className="border rounded-md border-primary-text/20 bg-white p-2.5 w-full focus-visible:outline-none h-[40px] text-sm"
                  >
                    <option value="India Post">India Post</option>
                    <option value="Delhivery">Delhivery</option>
                    <option value="Shiprocket">Shiprocket</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <Button
                  onClick={handleMarkAsShipped}
                  disabled={isShippingPending}
                  className="bg-primary-text text-white font-semibold px-6 h-[40px]"
                >
                  {isShippingPending ? "Saving..." : "Mark as Shipped"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <span className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold block">
                    Shipping Status
                  </span>
                  <p className="text-[16px] font-bold text-green-600">
                    Shipped
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold block">
                    Tracking ID
                  </span>
                  <p className="text-[16px] font-mono font-medium">
                    {trackingNumber}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold block">
                    Carrier
                  </span>
                  <p className="text-[16px] font-medium">{carrier}</p>
                </div>
              </div>

              {!isDelivered ? (
                <div className="pt-4 border-t border-primary-text/10 space-y-4">
                  <p className="text-sm opacity-70">
                    The package is in transit. Once confirmed delivered, update
                    the status below.
                  </p>
                  <div className="flex gap-4 items-center">
                    <Button
                      onClick={handleMarkAsDelivered}
                      disabled={isDeliveryPending}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6"
                    >
                      {isDeliveryPending ? "Updating..." : "Mark as Delivered"}
                    </Button>
                    <button
                      onClick={() => setEditTrackingMode(!editTrackingMode)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {editTrackingMode ? "Close editor" : "Edit tracking info"}
                    </button>
                  </div>

                  {editTrackingMode && (
                    <div className="flex flex-col sm:flex-row gap-4 items-end pt-4 border-t border-dashed border-primary-text/10 max-w-xl">
                      <div className="space-y-1.5 flex-1 w-full">
                        <Label htmlFor="editTrackingNo">
                          Update Tracking ID
                        </Label>
                        <Input
                          id="editTrackingNo"
                          type="text"
                          value={adminTrackingNumber}
                          onChange={(e) =>
                            setAdminTrackingNumber(e.target.value)
                          }
                          className="bg-white border-primary-text/20"
                        />
                      </div>
                      <div className="space-y-1.5 flex-1 w-full">
                        <Label htmlFor="editCarrier">Update Carrier</Label>
                        <select
                          id="editCarrier"
                          value={adminCarrier}
                          onChange={(e) => setAdminCarrier(e.target.value)}
                          className="border rounded-md border-primary-text/20 bg-white p-2.5 w-full focus-visible:outline-none h-[40px] text-sm"
                        >
                          <option value="India Post">India Post</option>
                          <option value="Delhivery">Delhivery</option>
                          <option value="Shiprocket">Shiprocket</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleMarkAsShipped}
                          disabled={isShippingPending}
                          className="bg-primary-text text-white px-4 h-[40px]"
                        >
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setEditTrackingMode(false)}
                          className="h-[40px]"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="pt-4 border-t border-primary-text/10">
                  <p className="text-sm font-semibold text-green-600">
                    ✓ Order has been successfully delivered.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderDetailsTable;
