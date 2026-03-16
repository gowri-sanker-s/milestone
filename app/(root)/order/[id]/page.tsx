import { getOrderById } from "@/lib/actions/order.action";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShippingAddress } from "@/types";
import OrderDetailsTable from "./order-details-table";

export const metadata: Metadata = {
  title: "Order Details",
};

const OrderDetailsPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;

  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }
  console.log(order);

  return (
    <div>
      <OrderDetailsTable
        order={{
          ...order,
          shippingAddress: order.shippingAddress as ShippingAddress,
        }}
      />
    </div>
  );
};

export default OrderDetailsPage;
