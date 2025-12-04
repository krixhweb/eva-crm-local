
import React from "react";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { Icon } from "../../components/shared/Icon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";

const ReturnsRefundsPage = () => {
  const returns = [
    { id: "RET-501", orderId: "ORD-985", date: "2024-01-14", customer: "Mike Johnson", items: 2, amount: 19998, reason: "Defective", status: "Approved", daysOpen: 2 },
    { id: "RET-502", orderId: "ORD-892", date: "2024-01-12", customer: "Sarah Lee", items: 1, amount: 8999, reason: "Wrong Size", status: "Pending", daysOpen: 4 },
    { id: "RET-503", orderId: "ORD-756", date: "2024-01-10", customer: "Tom Wilson", items: 3, amount: 35997, reason: "Changed Mind", status: "Completed", daysOpen: 6 },
    { id: "RET-504", orderId: "ORD-623", date: "2024-01-08", customer: "Emily Davis", items: 1, amount: 12999, reason: "Not as Described", status: "Approved", daysOpen: 8 },
    { id: "RET-505", orderId: "ORD-511", date: "2024-01-06", customer: "David Brown", items: 2, amount: 24998, reason: "Damaged in Transit", status: "Rejected", daysOpen: 10 },
  ];

  const stats = [
    { label: "Pending", value: "8", icon: 'refreshCw' as const, color: "text-orange-600" },
    { label: "Approved", value: "15", icon: 'checkCircle' as const, color: "text-green-600" },
    { label: "Completed", value: "42", icon: 'package' as const, color: "text-blue-600" },
    { label: "Rejected", value: "3", icon: 'xCircle' as const, color: "text-red-600" },
  ];
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  }

  const getStatusBadge = (status: string): "green" | "blue" | "yellow" | "red" | "gray" => {
    switch (status) {
        case "Completed": return "green";
        case "Approved": return "blue";
        case "Pending": return "yellow";
        case "Rejected": return "red";
        default: return "gray";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Returns & Refunds</h1>
          <p className="text-gray-500 dark:text-gray-400">Process customer returns and refunds</p>
        </div>
        <Button className="gap-2">
          <Icon name="plus" className="h-4 w-4" />
          Create Return
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700/50 ${stat.color}`}>
                  <Icon name={stat.icon} className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search returns..." className="pl-10" />
            </div>
            <Button variant="outline">Export</Button>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Return #</TableHead>
                <TableHead>Order #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Days Open</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {returns.map((ret) => (
                <TableRow key={ret.id} className="cursor-pointer">
                  <TableCell>
                    <button className="text-blue-500 hover:underline font-medium">{ret.id}</button>
                  </TableCell>
                  <TableCell>
                    <button className="text-blue-500 hover:underline">{ret.orderId}</button>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500 dark:text-gray-400">{ret.date}</TableCell>
                  <TableCell className="text-sm">{ret.customer}</TableCell>
                  <TableCell className="text-sm">{ret.items}</TableCell>
                  <TableCell className="text-sm font-semibold">{formatCurrency(ret.amount)}</TableCell>
                  <TableCell className="text-sm">{ret.reason}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadge(ret.status)}>{ret.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{ret.daysOpen}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">Process</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReturnsRefundsPage;
