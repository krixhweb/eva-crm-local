
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Label } from '../../components/ui/Label';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/Select';
import { Switch } from '../../components/ui/Switch';

const GeneralSettingsPage: React.FC = () => {
  return (
      <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-2 duration-500">
        
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input defaultValue="John Doe" />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input defaultValue="john.doe@example.com" type="email" />
              </div>
            </div>
            <div className="space-y-2">
                <Label>Bio</Label>
                <Input defaultValue="Admin user for Eva CRM." />
            </div>
          </CardContent>
        </Card>

        {/* Preferences Section */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select defaultValue="utc-5">
                    <SelectTrigger>
                        <SelectValue placeholder="Select Timezone" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="utc-8">Pacific Time (US & Canada)</SelectItem>
                        <SelectItem value="utc-5">Eastern Time (US & Canada)</SelectItem>
                        <SelectItem value="utc+0">GMT (London)</SelectItem>
                        <SelectItem value="utc+5:30">IST (India)</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive daily summaries and alerts.</p>
                </div>
                <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label className="text-base">Marketing Emails</Label>
                    <p className="text-sm text-gray-500">Receive news and product updates.</p>
                </div>
                <Switch />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
            <Button variant="outline">Discard</Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">Save Changes</Button>
        </div>

      </div>
  );
};

export default GeneralSettingsPage;
