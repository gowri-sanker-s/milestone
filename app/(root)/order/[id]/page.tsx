import { getOrderById, verifyOrderPayment } from "@/lib/actions/order.action";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShippingAddress } from "@/types";
import OrderDetailsTable from "./order-details-table";

export const metadata: Metadata = {
  title: "Order Details",
};

const OrderDetailsPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;

  let order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  if (!order.isPaid) {
    await verifyOrderPayment(order.id);
    order = await getOrderById(id);
  }

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
