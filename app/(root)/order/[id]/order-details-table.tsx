"use client";

import { updateCODOrderToPaid } from "@/lib/actions/order.action";
import { funnel } from "@/lib/fonts";
import { formatCurrency, formatDate, formatId } from "@/lib/utils";
import { Order } from "@/types";
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
    isDelivered,
    deliveredAt,
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
  const [trackingNumber, setTrackingNumber] = useState("");
  const [orderNumber, setOrderNumber] = useState(id);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isTrackingPending, setIsTrackingPending] = useState(false);

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      toast.error("Please enter a tracking number");
      return;
    }
    setIsTrackingPending(true);
    setTimeout(() => {
      setIsTrackingPending(false);
      setIsTrackingModalOpen(false);
      toast.success("Tracking query sent. Clickpost integration coming soon!");
    }, 1200);
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
        {/* button to download invoice */}
        <button className="bg-primary text-white px-4 py-2 rounded-md hidden">
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
              <DialogContent className="min-w-[80%] max-w-[1440px] min-h-[80vh] bg-primary-bg flex flex-col border-none">
                <div className="top">
                  <DialogHeader>
                    <DialogTitle
                      className={`${funnel.className} text-xl font-bold`}
                    >
                      Track Your Order
                    </DialogTitle>
                    <DialogDescription>
                      Enter your tracking and order details to track your
                      package delivery status.
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    onSubmit={handleTrackOrder}
                    className="space-y-4 py-2 flex items-center gap-3"
                  >
                    <div className="space-y-1.5 flex-1">
                      <Label htmlFor="orderNumber">Order Number</Label>
                      <Input
                        id="orderNumber"
                        type="text"
                        placeholder="Enter order number"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <Label htmlFor="trackingNumber">Tracking Number</Label>
                      <Input
                        id="trackingNumber"
                        type="text"
                        placeholder="Enter tracking ID"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        required
                      />
                    </div>
                    <DialogFooter className=" bg-primary-text rounded-md text-primary-bg">
                      <Button
                        type="submit"
                        disabled={isTrackingPending}
                        className="w-full font-semibold"
                      >
                        {isTrackingPending ? "Searching..." : "Track Package"}
                      </Button>
                    </DialogFooter>
                  </form>
                </div>
                <div className="flex-1 border border-dashed border-primary-text/30 rounded-md h-full w-full grid place-items-center">
                  <div className="flex flex-col justify-center items-center">
                    <div className="img-container h-[90px] w-[90px]">
                      <Image src={truck} alt="" className="icon" />
                    </div>
                    <p className="text-center opacity-50 text-sm">
                      Enter tracking/order number to view details
                    </p>
                  </div>
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
                  isPaid 
                    ? "bg-green-100 text-green-600" 
                    : isPaymentFailed 
                      ? "bg-red-100 text-red-600" 
                      : "bg-amber-100 text-amber-600"
                }`}
              >
                {isPaid ? "Paid" : isPaymentFailed ? "Failed" : "Pending Payment"}
              </span>
            </div>
            
            <div className="space-y-1">
              <span className={`${funnel.className} text-[11px] uppercase tracking-wider text-gray-500 font-semibold block`}>
                Provider
              </span>
              <p className="text-[17px] font-medium">{paymentMethod}</p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-primary-text/10">
            {isPaid && paidAt && (
              <p className="text-[13px] font-semibold text-gray-600">
                Paid on {formatDate(paidAt!).dateTime}
              </p>
            )}
            {isPaymentFailed && (
              <p className="text-[13px] font-semibold text-red-600">
                Payment verification failed. Please check your bank or contact support.
              </p>
            )}
            {!isPaid && !isPaymentFailed && (
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
                  isDelivered ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
                }`}
              >
                {isDelivered ? "Delivered" : "Not Delivered"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-1">
                <span className={`${funnel.className} text-[11px] uppercase tracking-wider text-gray-500 font-semibold block`}>
                  Full Name
                </span>
                <p className="text-[16px] font-medium">{shippingAddress.fullName}</p>
              </div>

              <div className="space-y-1">
                <span className={`${funnel.className} text-[11px] uppercase tracking-wider text-gray-500 font-semibold block`}>
                  City
                </span>
                <p className="text-[16px] font-medium">{shippingAddress.city}</p>
              </div>

              <div className="space-y-1">
                <span className={`${funnel.className} text-[11px] uppercase tracking-wider text-gray-500 font-semibold block`}>
                  Postal Code
                </span>
                <p className="text-[16px] font-medium">{shippingAddress.postalCode}</p>
              </div>

              <div className="space-y-1">
                <span className={`${funnel.className} text-[11px] uppercase tracking-wider text-gray-500 font-semibold block`}>
                  Country
                </span>
                <p className="text-[16px] font-medium">{shippingAddress.country}</p>
              </div>
            </div>
          </div>

          {isDelivered && deliveredAt && (
            <div className="mt-6 pt-4 border-t border-primary-text/10">
              <p className="text-[13px] font-semibold text-gray-600">
                Delivered on {formatDate(deliveredAt!).dateTime}
              </p>
            </div>
          )}
        </div>
      </div>
        {/* fullfilment status */}
        {/* <div className="border rounded-2xl border-primary-text/20 p-5">
          <h3 className={`${funnel.className} text-[25px] font-semibold`}>
            Fullfilment Status
          </h3>
          <select
            value={isDeliveredUpdate}
            onChange={(e) => setIsDeliveredUpdate(e.target.value === "true")}
            className="border rounded-md border-primary-text/20 p-1 w-full mt-5 py-2 focus-visible:outline-none"
          >
            <option value="true">Delivered</option>
            <option value="false">Not Delivered</option>
          </select>
        </div> */}
    </div>
  );
};

export default OrderDetailsTable;
