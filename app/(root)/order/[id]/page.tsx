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
    try {
      await verifyOrderPayment(order.id);
      const updatedOrder = await getOrderById(id);
      if (updatedOrder) order = updatedOrder;
    } catch (err) {
      console.error("Order payment verification error:", err);
    }
  }

  return (
    <div>
      <OrderDetailsTable
        order={{
          ...order,
          shippingAddress: order.shippingAddress as ShippingAddress,
        } as any}
      />
    </div>
  );
};

export default OrderDetailsPage;
