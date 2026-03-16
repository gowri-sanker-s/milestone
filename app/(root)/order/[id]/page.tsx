import { getOrderById } from "@/lib/actions/order.action";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShippingAddress } from "@/types";

export const metadata: Metadata = {
  title: "Order Details",
};

const OrderDetailsPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const order = await getOrderById(id);
  if (!order) {
    notFound();
  }
  const { order: orderData } = order;

  console.log(order);

  return <div>{orderData?.totalPrice}</div>;
};

export default OrderDetailsPage;
