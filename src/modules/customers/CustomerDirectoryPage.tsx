
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Icon } from '../../components/shared/Icon';
import type { Customer } from '../../types';
import EditCustomerModal from '../../components/modals/EditCustomerModal';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Label } from '../../components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { formatCurrency } from '../../lib/utils';
import { mockCustomers } from '../../data/mockData';

const CustomerDirectoryPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 20;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setOpenActionMenu(null);
      }
    };

    if (openActionMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openActionMenu]);

  const handleUpdateCustomer = (updatedCustomer: Customer) => {
    setCustomers(prevCustomers => 
      prevCustomers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c)
    );
    setEditingCustomer(null);
  };

  const filteredCustomers = customers.filter((customer) => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const matchesSearch =
      customer.name.toLowerCase().includes(lowercasedFilter) ||
      customer.email.toLowerCase().includes(lowercasedFilter) ||
      customer.phone.includes(searchTerm);

    const matchesStatus =
      statusFilter === 'All' || customer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(
    startIdx,
    startIdx + itemsPerPage
  );

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              Customer Directory
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and view all your customers in one place.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Icon name="download" className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button size="sm">
              <Icon name="plus" className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <Label htmlFor="search-customers" className="mb-2 block">
                Search by name, email, or phone
              </Label>
              <div className="relative">
                <Icon
                  name="search"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                />
                <Input
                  id="search-customers"
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 w-full"
                />
              </div>
            </div>
            <div className="w-full md:w-auto">
              <Label htmlFor="status-filter" className="mb-2 block">
                Status
              </Label>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger id="status-filter" className="w-full md:w-[180px]">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="All">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="text-center">Orders</TableHead>
                <TableHead className="text-right">Total Spent</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <Link to={`/customers/${customer.id}`} className="flex items-center gap-3 group">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 flex-shrink-0">
                          {customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400">{customer.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{customer.id}</p>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                      <p className="text-sm text-gray-800 dark:text-gray-300">{customer.email}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{customer.phone}</p>
                  </TableCell>
                  <TableCell className="text-center text-sm text-gray-600 dark:text-gray-400">{customer.orders}</TableCell>
                  <TableCell className="text-right text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {formatCurrency(customer.totalSpent)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={customer.status === 'Active' ? 'green' : 'gray'}>
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="relative inline-block text-left">
                      <button
                          onClick={() => setOpenActionMenu(openActionMenu === customer.id ? null : customer.id)}
                          className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                      >
                          <Icon name="moreVertical" className="w-4 h-4" />
                      </button>
                      {openActionMenu === customer.id && (
                          <div ref={actionMenuRef} className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 dark:ring-gray-700 z-10">
                              <div className="py-1">
                                  <button
                                      onClick={() => {
                                          setEditingCustomer(customer);
                                          setOpenActionMenu(null);
                                      }}
                                      className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  >
                                      <Icon name="edit" className="w-4 h-4" />
                                      Edit
                                  </button>
                              </div>
                          </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Pagination */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {startIdx + 1} to {Math.min(startIdx + itemsPerPage, filteredCustomers.length)} of{' '}
            {filteredCustomers.length} customers
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <Icon name="chevronLeft" className="w-4 h-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-9"
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <Icon name="chevronRight" className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      {editingCustomer && (
        <EditCustomerModal
            customer={editingCustomer}
            onSave={handleUpdateCustomer}
            onClose={() => setEditingCustomer(null)}
        />
      )}
    </>
  );
}

export default CustomerDirectoryPage;
