
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Icon } from "../../components/shared/Icon";

const MultiChannelPage = () => {
  const channels = [
    { name: "Email", icon: 'mail' as const, active: 12, pending: 5, color: "text-blue-600" },
    { name: "Live Chat", icon: 'messageSquare' as const, active: 8, pending: 3, color: "text-green-600" },
    { name: "Phone", icon: 'phone' as const, active: 4, pending: 2, color: "text-purple-600" },
    { name: "Facebook", icon: 'facebook' as const, active: 6, pending: 1, color: "text-blue-500" },
    { name: "Twitter", icon: 'twitter' as const, active: 3, pending: 0, color: "text-sky-500" },
    { name: "Instagram", icon: 'instagram' as const, active: 2, pending: 1, color: "text-pink-600" },
  ];

  const messages = [
    { id: 1, channel: "Email", customer: "John Doe", subject: "Order inquiry", preview: "I wanted to check the status of my order...", time: "5 mins ago", status: "New" },
    { id: 2, channel: "Chat", customer: "Jane Smith", subject: "Product question", preview: "Does this product come in other colors?", time: "12 mins ago", status: "Active" },
    { id: 3, channel: "Phone", customer: "Bob Johnson", subject: "Refund request", preview: "Call regarding refund for order #1234", time: "25 mins ago", status: "Completed" },
    { id: 4, channel: "Facebook", customer: "Alice Williams", subject: "Shipping delay", preview: "When will my order arrive?", time: "1 hour ago", status: "Pending" },
  ];

  const getStatusBadgeVariant = (status: string): 'blue' | 'green' | 'yellow' | 'gray' => {
      switch (status) {
          case "New": return "blue";
          case "Active": return "green";
          case "Pending": return "yellow";
          default: return "gray";
      }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Multi-Channel Support</h1>
        <p className="text-gray-500 dark:text-gray-400">Unified inbox for all support channels</p>
      </div>

      {/* Channel Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {channels.map((channel, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className={`p-3 rounded-lg bg-gray-100 dark:bg-gray-700/50 ${channel.color}`}>
                  <Icon name={channel.icon} className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium">{channel.name}</p>
                <div className="flex gap-2">
                  <Badge variant="outline">{channel.active} active</Badge>
                  {channel.pending > 0 && (
                    <Badge variant="yellow">{channel.pending}</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Unified Inbox */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Inbox</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y dark:divide-gray-700">
                {messages.map((message) => (
                  <div key={message.id} className="p-4 hover:bg-gray-100/50 dark:hover:bg-gray-800/20 cursor-pointer transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">{message.channel}</Badge>
                          <span className="text-sm font-medium truncate">{message.customer}</span>
                        </div>
                        <p className="text-sm font-medium truncate">{message.subject}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{message.preview}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">{message.time}</span>
                          <Badge variant={getStatusBadgeVariant(message.status)} className="text-xs">{message.status}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conversation View */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Conversation with John Doe</CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email • Order inquiry</p>
                </div>
                <Badge variant="blue">New</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow flex flex-col">
              {/* Conversation Thread */}
              <div className="space-y-4 flex-grow overflow-y-auto p-4 -m-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">JD</span>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-4">
                      <p className="text-sm">I wanted to check the status of my order #ORD-1001. It's been a week since I placed it.</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">5 mins ago</p>
                  </div>
                </div>
              </div>

              {/* Reply Box */}
              <div className="border-t dark:border-gray-700 pt-4 mt-auto">
                <div className="space-y-3">
                  <Input placeholder="Type your message..." />
                  <div className="flex justify-between">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Templates</Button>
                      <Button variant="outline" size="sm">Attach</Button>
                    </div>
                    <Button className="gap-2">
                      <Icon name="send" className="h-4 w-4" />
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MultiChannelPage;
