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
  } = order;
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
      <div className="grid grid-cols-[1.5fr_2fr] gap-5 mt-10">
        <div className="border rounded-2xl border-primary-text/20 p-5 relative">
          <div className="flex justify-between items-start gap-10">
            <h3 className={`${funnel.className} text-[25px] font-semibold`}>
              Payment Method
            </h3>
            <div className="flex items-center gap-2">
              <span
                className={` ${funnel.className} text-[14px] font-bold rounded-full px-5 py-1 ${isPaid ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
              >
                {isPaid ? "Paid" : "Not Paid"}
              </span>
            </div>
          </div>
          <div className="flex justify-between gap-2 items-center mt-5">
            <p className="text-[17px] font-medium">{paymentMethod}</p>
          </div>
          <div className="absolute bottom-3 right-3 text-[14px] font-semibold">
            {isPaid && paidAt && `Paid on ${formatDate(paidAt!).dateTime}`}
          </div>
        </div>
        <div className="shipping-address border rounded-2xl border-primary-text/20 p-5 relative">
          <div className="flex items-center justify-between">
            <h3 className={`${funnel.className} text-[25px] font-semibold`}>
              Shipping Address
            </h3>
            <span
              className={` ${funnel.className} text-[14px] font-bold rounded-full px-5 py-1 ${isDelivered ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
            >
              {isDelivered ? "Delivered" : "Not Delivered"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-5 mt-5">
            <p className="text-[17px] font-medium">
              <span className={`${funnel.className} font-semibold`}>
                Full Name:
              </span>{" "}
              <span>{shippingAddress.fullName}</span>
            </p>
            <p className="text-[17px] font-medium">
              <span className={`${funnel.className} font-semibold`}>City:</span>{" "}
              <span>{shippingAddress.city}</span>
            </p>
            <p className="text-[17px] font-medium">
              <span className={`${funnel.className} font-semibold`}>
                Postal Code:
              </span>{" "}
              <span>{shippingAddress.postalCode}</span>
            </p>
            <p className="text-[17px] font-medium">
              <span className={`${funnel.className} font-semibold`}>
                Country:
              </span>{" "}
              <span>{shippingAddress.country}</span>
            </p>
          </div>
          <div className="absolute bottom-3 right-3 text-[14px] font-semibold">
            {isDelivered &&
              deliveredAt &&
              `Delivered on ${formatDate(deliveredAt!).dateTime}`}
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
    </div>
  );
};

export default OrderDetailsTable;
