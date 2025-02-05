import OrderDetail from '@/components/common/orders/detail';
import { getOrderById } from '@/query/orders';

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  const orderRes = await getOrderById(orderId);

  if (!orderRes.data) {
    return (
      <div className='text-center'>
        <h1>Order does not exist.</h1>
      </div>
    );
  }

  return <OrderDetail order={orderRes.data} />;
}
