"use client";

import { funnel } from "@/lib/fonts";
import { formatId } from "@/lib/utils";
import { Order } from "@/types";
import React from "react";

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
  return (
    <div className="wrapper py-10">
      <h1 className={`${funnel.className} text-[30px] font-semibold`}>
        Order {formatId(id)}
      </h1>
      <p>Payment Status: {isPaid ? "Paid" : "Not Paid"}</p>
    </div>
  );
};

export default OrderDetailsTable;
