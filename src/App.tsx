
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { store } from './store/store';
import type { RootState } from './store/store';
import Layout from './components/layout/Layout';
import { GlassyToastProvider } from './components/ui/GlassyToastProvider';
import PlaceholderPage from './components/ui/PlaceholderPage';

// Dashboard
import DashboardPage from './modules/dashboard/DashboardPage';

// Customers
import CustomerDirectoryPage from './modules/customers/CustomerDirectoryPage';
import CustomerProfilePage from './modules/customers/CustomerProfilePage';

// Marketing
import AbandonedCartsPage from './modules/marketing/AbandonedCartsPage';
import CampaignsManagementPage from './modules/marketing/CampaignsManagementPage';
import CampaignDetailsPage from './modules/marketing/CampaignDetailsPage';
import EmailMarketingPage from './modules/marketing/EmailMarketingPage';
import EmailCampaignDetailPage from './modules/marketing/components/channel/EmailCampaignDetailPage';
import EmailTemplateEditorPage from './modules/marketing/pages/EmailTemplateEditorPage';
import EmailTemplatePreviewPage from './modules/marketing/pages/EmailTemplatePreviewPage';
import CampaignWizardPage from './modules/marketing/pages/CampaignWizardPage';
import WhatsAppMarketingPage from './modules/marketing/WhatsAppMarketingPage';
import SocialPublisherPage from './modules/marketing/SocialPublisherPage';
import SocialComposePage from './modules/marketing/SocialComposePage';
import CouponManagementPage from './modules/marketing/CouponManagementPage';
import CouponDetailPage from './modules/marketing/CouponDetailPage';
import ChannelMarketingPage from './modules/marketing/ChannelMarketingPage';

// Sales
import SalesPipelinePage from './modules/sales/SalesPipelinePage';
import SalesAnalyticsPage from './modules/sales/SalesAnalyticsPage';
import SalesPersonDetailsPage from './modules/sales/SalesPersonDetailsPage';

// Commerce
import ProductsInventoryPage from './modules/commerce/inventory/ProductsInventoryPage';
import ProductProfilePage from './modules/commerce/inventory/ProductProfilePage';
import OrdersManagementPage from './modules/commerce/orders/OrdersManagementPage';
import FinancialHubPage from './modules/commerce/financials/FinancialHubPage';
import QuoteDetailsPage from './modules/commerce/financials/QuoteDetailsPage';
import InvoiceDetailsPage from './modules/commerce/financials/InvoiceDetailsPage';

// Support
import TicketManagementPage from './modules/support/TicketManagementPage';
import ReturnsRefundsPage from './modules/support/ReturnsRefundsPage';
import MultiChannelPage from './modules/support/MultiChannelPage';

// Automation
import WorkflowListPage from './modules/automation/WorkflowListPage';
import WorkflowBuilderPage from './modules/automation/WorkflowBuilderPage';
import MarketingAutomationPage from './modules/automation/MarketingAutomationPage';
import ServiceAutomationPage from './modules/automation/ServiceAutomationPage';

// Settings
import { SettingsLayout } from './modules/settings/SettingsLayout';
import GeneralSettingsPage from './modules/settings/GeneralSettingsPage';
import IntegrationsPage from './modules/settings/IntegrationsPage';
import AdminSecurityPage from './modules/settings/AdminSecurityPage';
import ApiWebhooksPage from './modules/settings/ApiWebhooksPage';


const AppContent: React.FC = () => {
  return (
    <Layout>
        <Routes>
          {/* Redirect Root */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Dashboard */}
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* Customers */}
          <Route path="/customers" element={<CustomerDirectoryPage />} />
          <Route path="/customers/:id" element={<CustomerProfilePage />} />
          
          {/* Marketing */}
          <Route path="/abandoned-carts" element={<AbandonedCartsPage />} />
          <Route path="/marketing/campaigns" element={<CampaignsManagementPage />} />
          <Route path="/marketing/campaigns/:id" element={<CampaignDetailsPage />} />
          
          <Route path="/marketing/channel" element={<ChannelMarketingPage />} />
          <Route path="/marketing/channel/email" element={<EmailMarketingPage />} />
          <Route path="/marketing/channel/email/create" element={<CampaignWizardPage />} />
          <Route path="/marketing/channel/email/:id" element={<EmailCampaignDetailPage />} />
          
          {/* Email Templates */}
          <Route path="/marketing/channel/email/templates/new" element={<EmailTemplateEditorPage />} />
          <Route path="/marketing/channel/email/templates/:templateId/edit" element={<EmailTemplateEditorPage />} />
          <Route path="/marketing/channel/email/templates/:templateId" element={<EmailTemplatePreviewPage />} />

          {/* Social & WhatsApp */}
          <Route path="/marketing/channel/whatsapp" element={<WhatsAppMarketingPage />} />
          <Route path="/marketing/channel/social" element={<SocialPublisherPage />} />
          <Route path="/marketing/channel/social/compose" element={<SocialComposePage />} />

          {/* Coupons */}
          <Route path="/marketing/coupons" element={<CouponManagementPage />} />
          <Route path="/marketing/coupons/:id" element={<CouponDetailPage />} />

          {/* Sales */}
          <Route path="/sales/pipeline" element={<SalesPipelinePage />} />
          <Route path="/sales/analytics" element={<SalesAnalyticsPage />} />
          <Route path="/sales/rep/:id" element={<SalesPersonDetailsPage />} />

          {/* Commerce */}
          <Route path="/commerce/products" element={<ProductsInventoryPage />} />
          <Route path="/commerce/products/:id" element={<ProductProfilePage />} />
          <Route path="/commerce/orders" element={<OrdersManagementPage />} />
          <Route path="/commerce/financials" element={<FinancialHubPage />} />
          <Route path="/commerce/financials/quotes/:id" element={<QuoteDetailsPage />} />
          <Route path="/commerce/financials/invoices/:id" element={<InvoiceDetailsPage />} />

          {/* Support */}
          <Route path="/support/tickets" element={<TicketManagementPage />} />
          <Route path="/support/returns" element={<ReturnsRefundsPage />} />
          <Route path="/support/multi-channel" element={<MultiChannelPage />} />
          
          {/* Automation */}
          <Route path="/automation/workflows" element={<WorkflowListPage />} />
          <Route path="/automation/workflows/builder" element={<WorkflowBuilderPage />} />
          <Route path="/automation/marketing" element={<MarketingAutomationPage />} />
          <Route path="/automation/service" element={<ServiceAutomationPage />} />

          {/* Settings - Nested Layout */}
          <Route path="/settings" element={<SettingsLayout />}>
            <Route index element={<Navigate to="/settings/general" replace />} />
            <Route path="general" element={<GeneralSettingsPage />} />
            <Route path="integrations" element={<IntegrationsPage />} />
            <Route path="admin" element={<AdminSecurityPage />} />
            <Route path="api" element={<ApiWebhooksPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<PlaceholderPage title="404 - Not Found" />} />
        </Routes>
      </Layout>
  );
};

const AppWrapper: React.FC = () => {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <GlassyToastProvider>
        <AppWrapper />
      </GlassyToastProvider>
    </Provider>
  );
}

export default App;

