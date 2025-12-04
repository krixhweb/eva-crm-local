
import React from "react";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { Icon } from "../../components/shared/Icon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';

const TicketManagementPage = () => {
  const tickets = [
    { id: "T-1001", status: "Open", priority: "High", subject: "Payment not processing", customer: "John Doe", assigned: "Sarah K.", channel: "Email", created: "2 hours ago", updated: "30 mins ago", sla: "2h left" },
    { id: "T-1002", status: "Pending", priority: "Medium", subject: "Shipping inquiry", customer: "Jane Smith", assigned: "Mike R.", channel: "Chat", created: "5 hours ago", updated: "1 hour ago", sla: "4h left" },
    { id: "T-1003", status: "Resolved", priority: "Low", subject: "Product question", customer: "Bob Johnson", assigned: "Lisa T.", channel: "Phone", created: "1 day ago", updated: "3 hours ago", sla: "Resolved" },
    { id: "T-1004", status: "Open", priority: "High", subject: "Account access issue", customer: "Alice W.", assigned: "Tom B.", channel: "Email", created: "1 hour ago", updated: "45 mins ago", sla: "3h left" },
    { id: "T-1005", status: "Pending", priority: "Medium", subject: "Refund request", customer: "Charlie B.", assigned: "Sarah K.", channel: "Social", created: "3 hours ago", updated: "2 hours ago", sla: "6h left" },
  ];

  const stats = [
    { label: "Open", value: "24", icon: 'messageSquare' as const, color: "text-red-600" },
    { label: "Awaiting", value: "12", icon: 'clock' as const, color: "text-orange-600" },
    { label: "Resolved Today", value: "18", icon: 'checkCircle' as const, color: "text-green-600" },
    { label: "Avg Response", value: "2.3h", icon: 'clock' as const, color: "text-blue-600" },
    { label: "CSAT", value: "4.7/5", icon: 'star' as const, color: "text-yellow-600" },
  ];

  const getPriorityColor = (priority: string) => {
    return priority === "High" ? "bg-red-500" :
           priority === "Medium" ? "bg-orange-500" :
           "bg-blue-500";
  };

  const getStatusBadge = (status: string): "red" | "yellow" | "green" | "gray" => {
    return status === "Open" ? "red" :
           status === "Pending" ? "yellow" :
           status === "Resolved" ? "green" :
           "gray";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Ticket Management</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage customer support tickets</p>
        </div>
        <Button className="gap-2">
          <Icon name="plus" className="h-4 w-4" />
          Create Ticket
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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

      {/* Filter Bar */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search tickets..." className="pl-10" />
            </div>
            <Button variant="outline">Filters</Button>
            <Button variant="outline">Export</Button>
          </div>
        </CardHeader>
      </Card>

      {/* Tickets Table */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket #</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Assigned</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>SLA</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id} className="cursor-pointer">
                  <TableCell>
                    <button className="text-blue-500 hover:underline font-medium">{ticket.id}</button>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadge(ticket.status)}>{ticket.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(ticket.priority)}`} />
                      <span className="text-sm">{ticket.priority}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium">{ticket.subject}</TableCell>
                  <TableCell className="text-sm">{ticket.customer}</TableCell>
                  <TableCell className="text-sm">{ticket.assigned}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{ticket.channel}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500 dark:text-gray-400">{ticket.created}</TableCell>
                  <TableCell className="text-sm text-gray-500 dark:text-gray-400">{ticket.updated}</TableCell>
                  <TableCell className="text-sm font-medium">{ticket.sla}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">View</Button>
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

export default TicketManagementPage;
