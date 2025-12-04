
import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Icon } from '../../../components/shared/Icon';
import { formatCurrency } from '../../../lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/Table';
import type { Order } from '../../../types';
import { mockOrders } from '../../../data/mockData';

const RevenueTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-4 text-center">
          <Icon name="dollarSign" className="w-6 h-6 mx-auto mb-2 text-green-500"/>
          <p className="text-2xl font-bold">{formatCurrency(196000)}</p>
          <p className="text-xs text-gray-500 uppercase">Total Revenue</p>
        </Card>
        <Card className="p-4 text-center">
          <Icon name="trendingUp" className="w-6 h-6 mx-auto mb-2 text-blue-500"/>
          <p className="text-2xl font-bold">{formatCurrency(16333)}</p>
          <p className="text-xs text-gray-500 uppercase">Avg. Order Value</p>
        </Card>
        <Card className="p-4 text-center">
           <Icon name="calendar" className="w-6 h-6 mx-auto mb-2 text-purple-500"/>
          <p className="text-2xl font-bold">45 days</p>
          <p className="text-xs text-gray-500 uppercase">Purchase Frequency</p>
        </Card>
        <Card className="p-4 text-center">
          <Icon name="sparkles" className="w-6 h-6 mx-auto mb-2 text-yellow-500"/>
          <p className="text-2xl font-bold">{formatCurrency(360000)}</p>
          <p className="text-xs text-gray-500 uppercase">LTV Prediction</p>
        </Card>
      </div>
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Order History</h3>
        <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOrders.map(order => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium text-blue-500 hover:underline">{order.id}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.items.length}</TableCell>
                  <TableCell className="font-semibold">{formatCurrency(order.amount)}</TableCell>
                  <TableCell>
                    <Badge variant={order.status === 'Delivered' ? 'green' : 'yellow'}>{order.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default RevenueTab;
