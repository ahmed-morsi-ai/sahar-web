"use client";
export type Order = {
  id: string;
  status?: string;
  total?: number;
};

export function OrdersTable({ orders }: { orders: Order[] }) {
  return (
    <div className="border rounded p-4">
      <h2 className="font-bold mb-3">Orders</h2>

      <table className="w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Status</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.status}</td>
              <td>{order.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrdersTable;
