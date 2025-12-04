
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Icon } from '../../../../components/shared/Icon';
import { Badge } from '../../../../components/ui/Badge';
import { SocialService } from '../api/mockService';
import { SocialAccount, PLATFORM_CONFIG } from '../types';
import { useGlassyToasts } from '../../../../components/ui/GlassyToastProvider';

export const AccountManager = () => {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const { push } = useGlassyToasts();

  const fetchAccounts = async () => {
    const data = await SocialService.getAccounts();
    setAccounts(data);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleConnect = async (provider: string) => {
    setLoading(true);
    try {
      await SocialService.connectAccount(provider);
      await fetchAccounts();
      push({ title: 'Connected', description: `Successfully connected to ${PLATFORM_CONFIG[provider as keyof typeof PLATFORM_CONFIG].name}`, variant: 'success' });
    } catch (e) {
      push({ title: 'Error', description: 'Failed to connect account', variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async (id: string) => {
    if(!confirm('Are you sure you want to disconnect this account?')) return;
    await SocialService.deleteAccount(id);
    await fetchAccounts();
    push({ title: 'Disconnected', description: 'Account removed', variant: 'info' });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Connected Accounts List */}
      <Card>
          <CardHeader>
              <CardTitle>Connected Profiles</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
              <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                  {accounts.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">No accounts connected. Add one below.</div>
                  ) : (
                      accounts.map(account => (
                          <div key={account.id} className="flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors">
                              <div className="flex items-center gap-4">
                                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm ${PLATFORM_CONFIG[account.provider].bg}`}>
                                      <Icon name={PLATFORM_CONFIG[account.provider].icon as any} className="w-6 h-6" />
                                  </div>
                                  <div>
                                      <div className="flex items-center gap-2">
                                          <h4 className="font-bold text-gray-900 dark:text-gray-100">{account.name}</h4>
                                          {account.status === 'error' ? (
                                              <Badge variant="red" className="px-1.5 py-0 h-5 text-[10px]">Error</Badge>
                                          ) : (
                                              <Badge variant="green" className="px-1.5 py-0 h-5 text-[10px]">Active</Badge>
                                          )}
                                      </div>
                                      <p className="text-sm text-gray-500">{account.username} • {account.followersCount?.toLocaleString()} followers</p>
                                  </div>
                              </div>
                              <div className="flex items-center gap-4">
                                  <div className="text-right hidden md:block text-xs text-gray-400">
                                      Connected on {new Date(account.connectedAt).toLocaleDateString()}
                                  </div>
                                  <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50 border-gray-200 dark:border-zinc-700" onClick={() => handleDisconnect(account.id)}>
                                      Disconnect
                                  </Button>
                              </div>
                          </div>
                      ))
                  )}
              </div>
          </CardContent>
      </Card>

      {/* Add New Accounts Grid */}
      <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Add New Connection</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(PLATFORM_CONFIG).map(([key, config]) => {
                const isConnected = accounts.some(a => a.provider === key);
                return (
                    <div key={key} className={`border rounded-xl p-5 flex flex-col items-center justify-center text-center transition-all ${isConnected ? 'bg-gray-50 dark:bg-zinc-900 opacity-60' : 'bg-white dark:bg-zinc-900 hover:border-blue-400 hover:shadow-md'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white mb-3 shadow-sm ${config.bg}`}>
                            <Icon name={config.icon as any} className="w-5 h-5" />
                        </div>
                        <h4 className="font-semibold text-sm mb-1">{config.name}</h4>
                        <p className="text-xs text-gray-500 mb-4">Connect {config.name} Page</p>
                        <Button 
                            variant={isConnected ? "ghost" : "outline"} 
                            size="sm" 
                            onClick={() => !isConnected && handleConnect(key)}
                            disabled={loading || isConnected}
                            className="w-full h-8 text-xs"
                        >
                            {loading ? <Icon name="refreshCw" className="w-3 h-3 animate-spin" /> : isConnected ? 'Connected' : 'Connect'}
                        </Button>
                    </div>
                );
            })}
          </div>
      </div>
    </div>
  );
};
