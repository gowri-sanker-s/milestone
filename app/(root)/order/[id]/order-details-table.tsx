"use client";

import { funnel } from "@/lib/fonts";
import { formatCurrency, formatId } from "@/lib/utils";
import { Order } from "@/types";
import Image from "next/image";
import React, { useState } from "react";

const OrderDetailsTable = ({ order }: { order: Order }) => {
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
            <li key={item.productId} className="px-4 pl-0 sm:px-6 sm:pl-0 py-4">
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
      {/* payment-method and shipping address */}
      <div className="grid grid-cols-[1.5fr_2fr] gap-5 mt-10">
        <div className="border rounded-2xl border-primary-text/20 p-5">
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
        </div>
        <div className="shipping-address border rounded-2xl border-primary-text/20 p-5">
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
