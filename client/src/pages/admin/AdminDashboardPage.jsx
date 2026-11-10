import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  Inbox,
  Clock,
  CheckCircle2,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  LogOut,
  RefreshCw,
  Mail,
  Phone,
  Building,
  Calendar,
  AlertCircle,
  X,
  FileText,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Send,
  CreditCard,
  Eye,
  DollarSign,
  Receipt,
} from 'lucide-react';
import BrandLogo from '../../components/common/BrandLogo';
import api from '../../services/api';

const statusColors = {
  new: 'bg-blue-100 text-blue-800 border-blue-200',
  contacted: 'bg-amber-100 text-amber-800 border-amber-200',
  in_review: 'bg-purple-100 text-purple-800 border-purple-200',
  completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  archived: 'bg-slate-100 text-slate-800 border-slate-200',
};

const paymentStatusColors = {
  PAID: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
  FAILED: 'bg-red-100 text-red-800 border-red-200',
  USER_DROPPED: 'bg-slate-100 text-slate-700 border-slate-200',
  EXPIRED: 'bg-slate-100 text-slate-700 border-slate-200',
};

export const AdminDashboardPage = () => {
  const { admin, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('inquiries'); // 'inquiries' | 'subscribers' | 'payments'
  const [stats, setStats] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Payments State
  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentSearch, setPaymentSearch] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [paymentPage, setPaymentPage] = useState(1);
  const [paymentTotalPages, setPaymentTotalPages] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal States
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [modalStatus, setModalStatus] = useState('');
  const [modalNotes, setModalNotes] = useState('');
  const [updatingInquiry, setUpdatingInquiry] = useState(false);
  const [inquiryToDelete, setInquiryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch Dashboard Stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/admin/stats');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  // Fetch Inquiries
  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/inquiries', {
        params: {
          search,
          status: statusFilter,
          page,
          limit: 10,
        },
      });
      if (res.data.success) {
        setInquiries(res.data.data);
        setTotalPages(res.data.pagination.totalPages || 1);
      }
    } catch (err) {
      console.error('Error fetching inquiries:', err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page]);

  // Fetch Subscribers
  const fetchSubscribers = useCallback(async () => {
    try {
      const res = await api.get('/admin/subscribers');
      if (res.data.success) {
        setSubscribers(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching subscribers:', err);
    }
  }, []);

  // Fetch Payments
  const fetchPayments = useCallback(async () => {
    setPaymentsLoading(true);
    try {
      const res = await api.get('/admin/payments', {
        params: {
          search: paymentSearch,
          status: paymentStatusFilter,
          page: paymentPage,
          limit: 10,
        },
      });
      if (res.data.success) {
        setPayments(res.data.data);
        setPaymentTotalPages(res.data.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
    } finally {
      setPaymentsLoading(false);
    }
  }, [paymentSearch, paymentStatusFilter, paymentPage]);

  const refreshAll = async () => {
    setRefreshing(true);
    await Promise.all([fetchStats(), fetchInquiries(), fetchSubscribers(), fetchPayments()]);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchStats();
    fetchSubscribers();
    fetchPayments();
  }, [fetchStats, fetchSubscribers, fetchPayments]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  useEffect(() => {
    if (activeTab === 'payments') {
      fetchPayments();
    }
  }, [fetchPayments, activeTab]);

  // Open Details Modal
  const openInquiryModal = (inq) => {
    setSelectedInquiry(inq);
    setModalStatus(inq.status);
    setModalNotes(inq.notes || '');
  };

  // Update Status & Notes
  const handleSaveInquiryUpdates = async () => {
    if (!selectedInquiry) return;
    setUpdatingInquiry(true);
    try {
      const res = await api.patch(`/admin/inquiries/${selectedInquiry._id}`, {
        status: modalStatus,
        notes: modalNotes,
      });
      if (res.data.success) {
        setSelectedInquiry(res.data.data);
        fetchInquiries();
        fetchStats();
      }
    } catch (err) {
      alert('Failed to update inquiry: ' + (err.response?.data?.message || err.message));
    } finally {
      setUpdatingInquiry(false);
    }
  };

  // Delete Inquiry
  const confirmDeleteInquiry = async () => {
    if (!inquiryToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/inquiries/${inquiryToDelete._id}`);
      setInquiryToDelete(null);
      if (selectedInquiry?._id === inquiryToDelete._id) {
        setSelectedInquiry(null);
      }
      fetchInquiries();
      fetchStats();
    } catch (err) {
      alert('Failed to delete inquiry: ' + (err.response?.data?.message || err.message));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-darkText">
      {/* Top Admin Navigation Header */}
      <header className="bg-navy-950 text-white border-b border-navy-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <BrandLogo variant="light" />
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-navy-800 text-slate-300 border border-navy-700">
              Admin Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={refreshAll}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-xs text-slate-300 hover:text-white transition-colors border border-navy-700"
              title="Refresh Records"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <div className="text-right hidden md:block">
              <div className="text-xs font-bold text-white">{admin?.name || 'Administrator'}</div>
              <div className="text-[11px] text-slate-400">{admin?.email}</div>
            </div>

            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-950 hover:bg-americanRed text-red-200 hover:text-white text-xs font-semibold transition-colors border border-red-800/60"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* KPI Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Total Inquiries */}
          <div className="bg-white p-5 rounded-2xl border border-appBorder shadow-sm">
            <div className="flex items-center justify-between text-xs text-mutedText mb-2">
              <span>Total Inquiries</span>
              <Inbox className="w-4 h-4 text-navy-900" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-heading text-navy-900">
              {stats?.totalInquiries || 0}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Across all services</div>
          </div>

          {/* Card 2: New Inquiries */}
          <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-sm bg-blue-50/20">
            <div className="flex items-center justify-between text-xs text-blue-700 font-semibold mb-2">
              <span>New / Action Needed</span>
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-heading text-blue-700">
              {stats?.statusCounts?.new || 0}
            </div>
            <div className="text-[11px] text-blue-600 mt-1">Requires initial outreach</div>
          </div>

          {/* Card 3: In Review / Contacted */}
          <div className="bg-white p-5 rounded-2xl border border-appBorder shadow-sm">
            <div className="flex items-center justify-between text-xs text-mutedText mb-2">
              <span>In Discussion</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-heading text-amber-600">
              {(stats?.statusCounts?.contacted || 0) + (stats?.statusCounts?.in_review || 0)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Contacted or scoping</div>
          </div>

          {/* Card 4: Completed / Converted */}
          <div className="bg-white p-5 rounded-2xl border border-appBorder shadow-sm">
            <div className="flex items-center justify-between text-xs text-mutedText mb-2">
              <span>Completed / Active</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-heading text-emerald-600">
              {stats?.statusCounts?.completed || 0}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Client onboarded</div>
          </div>

          {/* Card 5: Newsletter Subscribers */}
          <div className="col-span-2 lg:col-span-1 bg-white p-5 rounded-2xl border border-appBorder shadow-sm">
            <div className="flex items-center justify-between text-xs text-mutedText mb-2">
              <span>Subscribers</span>
              <Mail className="w-4 h-4 text-americanRed" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-heading text-americanRed">
              {stats?.totalSubscribers || 0}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Executive list</div>
          </div>
        </div>

        {/* Tab Switcher: Inquiries vs Subscribers */}
        <div className="flex border-b border-appBorder gap-4">
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'inquiries'
                ? 'border-navy-900 text-navy-900'
                : 'border-transparent text-mutedText hover:text-darkText'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Consultation Inquiries ({stats?.totalInquiries || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('subscribers')}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'subscribers'
                ? 'border-navy-900 text-navy-900'
                : 'border-transparent text-mutedText hover:text-darkText'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Newsletter Subscribers ({stats?.totalSubscribers || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'payments'
                ? 'border-navy-900 text-navy-900'
                : 'border-transparent text-mutedText hover:text-darkText'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Cashfree Payments ({stats?.payments?.totalPayments || 0})</span>
          </button>
        </div>

        {/* TAB 1: Consultation Inquiries Table */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            {/* Search and Filters Bar */}
            <div className="bg-white p-4 rounded-2xl border border-appBorder shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search input */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by ID, name, email, company..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-appBorder text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-navy-900"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">
                  Filter Status:
                </span>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-2 rounded-xl border border-appBorder text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900"
                >
                  <option value="all">All Inquiries</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="in_review">In Review</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Inquiries Table */}
            <div className="bg-white rounded-2xl border border-appBorder shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 border-b border-appBorder text-slate-600 uppercase text-[11px] font-bold tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Inquiry ID</th>
                      <th className="py-3 px-4">Client / Company</th>
                      <th className="py-3 px-4">Contact Info</th>
                      <th className="py-3 px-4">Service</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-appBorder">
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          <div className="w-6 h-6 border-2 border-navy-900 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                          Loading inquiry records...
                        </td>
                      </tr>
                    ) : inquiries.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          No inquiries found matching your filters.
                        </td>
                      </tr>
                    ) : (
                      inquiries.map((inq) => (
                        <tr key={inq._id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-navy-900">
                            {inq.inquiryId}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-darkText">{inq.name}</div>
                            {inq.company && (
                              <div className="text-[11px] text-slate-500">{inq.company}</div>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <a
                              href={`mailto:${inq.email}`}
                              className="text-navy-900 hover:text-americanRed transition-colors block text-xs"
                            >
                              {inq.email}
                            </a>
                            <a
                              href={`tel:${inq.phone}`}
                              className="text-slate-500 hover:text-navy-900 transition-colors text-[11px]"
                            >
                              {inq.phone}
                            </a>
                          </td>
                          <td className="py-3.5 px-4 font-medium text-slate-700 max-w-xs truncate">
                            {inq.service}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                statusColors[inq.status] || 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {inq.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 text-xs whitespace-nowrap">
                            {new Date(inq.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openInquiryModal(inq)}
                                className="p-1.5 rounded-lg bg-navy-50 hover:bg-navy-900 text-navy-900 hover:text-white transition-colors text-xs font-semibold"
                                title="View Details"
                              >
                                View
                              </button>
                              <button
                                onClick={() => setInquiryToDelete(inq)}
                                className="p-1.5 rounded-lg bg-red-50 hover:bg-americanRed text-americanRed hover:text-white transition-colors"
                                title="Delete Record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-appBorder flex items-center justify-between text-xs text-slate-600">
                  <div>
                    Page <span className="font-bold">{page}</span> of{' '}
                    <span className="font-bold">{totalPages}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page <= 1}
                      className="px-3 py-1.5 rounded-lg border border-appBorder bg-white hover:bg-slate-50 disabled:opacity-40"
                    >
                      <ChevronLeft className="w-4 h-4 inline" /> Prev
                    </button>
                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page >= totalPages}
                      className="px-3 py-1.5 rounded-lg border border-appBorder bg-white hover:bg-slate-50 disabled:opacity-40"
                    >
                      Next <ChevronRight className="w-4 h-4 inline" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Newsletter Subscribers Table */}
        {activeTab === 'subscribers' && (
          <div className="bg-white rounded-2xl border border-appBorder shadow-sm overflow-hidden">
            <div className="p-5 border-b border-appBorder flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-lg text-navy-900">
                  Newsletter & Financial Updates Subscribers
                </h3>
                <p className="text-xs text-slate-500">
                  All users who subscribed to executive financial briefings.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-xs font-bold text-navy-900">
                {subscribers.length} Total Registered
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-appBorder text-slate-600 uppercase text-[11px] font-bold tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Email Address</th>
                    <th className="py-3 px-4">Subscription Date</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-appBorder">
                  {subscribers.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-slate-400 text-xs">
                        No newsletter subscribers found.
                      </td>
                    </tr>
                  ) : (
                    subscribers.map((sub) => (
                      <tr key={sub._id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-semibold text-navy-900">{sub.email}</td>
                        <td className="py-3 px-4 text-xs text-slate-500">
                          {new Date(sub.subscribedAt || sub.createdAt).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                            {sub.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Cashfree Payments Table */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            {/* Payment Summary Metrics Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white p-4 rounded-xl border border-appBorder shadow-sm">
                <span className="text-xs text-mutedText block">Total Revenue</span>
                <span className="text-xl sm:text-2xl font-extrabold text-navy-900 font-heading block mt-1">
                  ₹{(stats?.payments?.totalRevenue || 0).toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">Verified Settled</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-appBorder shadow-sm">
                <span className="text-xs text-mutedText block">Total Orders</span>
                <span className="text-xl sm:text-2xl font-extrabold text-navy-900 font-heading block mt-1">
                  {stats?.payments?.totalPayments || 0}
                </span>
                <span className="text-[10px] text-slate-500">All registered intents</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-sm">
                <span className="text-xs text-emerald-700 font-semibold block">Paid / Success</span>
                <span className="text-xl sm:text-2xl font-extrabold text-emerald-700 font-heading block mt-1">
                  {stats?.payments?.paidCount || 0}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">Authorized transactions</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/20 shadow-sm">
                <span className="text-xs text-amber-700 font-semibold block">Pending Sync</span>
                <span className="text-xl sm:text-2xl font-extrabold text-amber-700 font-heading block mt-1">
                  {stats?.payments?.pendingCount || 0}
                </span>
                <span className="text-[10px] text-amber-600">Awaiting confirmation</span>
              </div>

              <div className="col-span-2 lg:col-span-1 bg-white p-4 rounded-xl border border-red-200 bg-red-50/20 shadow-sm">
                <span className="text-xs text-red-700 font-semibold block">Failed / Abandoned</span>
                <span className="text-xl sm:text-2xl font-extrabold text-red-700 font-heading block mt-1">
                  {stats?.payments?.failedCount || 0}
                </span>
                <span className="text-[10px] text-red-600">Declined or closed</span>
              </div>
            </div>

            {/* Search and Filters Bar */}
            <div className="bg-white p-4 rounded-2xl border border-appBorder shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search input */}
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search Order ID, name, email, phone, Cashfree ID..."
                  value={paymentSearch}
                  onChange={(e) => {
                    setPaymentSearch(e.target.value);
                    setPaymentPage(1);
                  }}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-appBorder text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-navy-900"
                />
              </div>

              {/* Status filter */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Filter className="w-4 h-4 text-slate-500" />
                <select
                  value={paymentStatusFilter}
                  onChange={(e) => {
                    setPaymentStatusFilter(e.target.value);
                    setPaymentPage(1);
                  }}
                  className="px-3 py-2 rounded-xl border border-appBorder bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-navy-900 font-medium"
                >
                  <option value="all">All Payment Statuses</option>
                  <option value="PAID">PAID (Successful)</option>
                  <option value="PENDING">PENDING</option>
                  <option value="FAILED">FAILED</option>
                  <option value="USER_DROPPED">USER_DROPPED</option>
                  <option value="EXPIRED">EXPIRED</option>
                </select>
              </div>
            </div>

            {/* Payments Table */}
            <div className="bg-white rounded-2xl border border-appBorder shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-appBorder text-slate-600 uppercase text-[11px] font-bold tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Customer Details</th>
                      <th className="py-3 px-4">Plan / Service</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Date &amp; Time</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-appBorder">
                    {paymentsLoading ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-500 text-xs">
                          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-navy-900" />
                          Loading Cashfree transactions...
                        </td>
                      </tr>
                    ) : payments.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                          No payment orders matching criteria found.
                        </td>
                      </tr>
                    ) : (
                      payments.map((p) => {
                        const statusBadge =
                          paymentStatusColors[p.paymentStatus] || 'bg-slate-100 text-slate-800 border-slate-200';

                        return (
                          <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3.5 px-4">
                              <span className="font-mono text-xs font-bold text-navy-900 block">
                                {p.orderId}
                              </span>
                              {p.cashfreePaymentId && (
                                <span className="font-mono text-[10px] text-slate-400 block mt-0.5">
                                  CF: {p.cashfreePaymentId}
                                </span>
                              )}
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-navy-900 text-xs sm:text-sm">
                                {p.customerName}
                              </div>
                              <div className="text-[11px] text-slate-500">{p.customerEmail}</div>
                              <div className="text-[11px] text-slate-400">{p.customerPhone}</div>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className="font-medium text-xs text-darkText block">
                                {p.serviceName}
                              </span>
                              {p.paymentMethod && (
                                <span className="text-[10px] text-slate-400 uppercase">
                                  {p.paymentMethod}
                                </span>
                              )}
                            </td>

                            <td className="py-3.5 px-4">
                              <span className="font-extrabold text-navy-900 text-sm font-heading">
                                {p.currency} {p.amount?.toFixed?.(2) || p.amount}
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase inline-block ${statusBadge}`}
                              >
                                {p.paymentStatus}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-xs text-slate-500">
                              {new Date(p.createdAt).toLocaleString()}
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => setSelectedPayment(p)}
                                className="p-1.5 rounded-lg text-navy-900 hover:bg-navy-50 transition-colors inline-flex items-center gap-1 text-xs font-semibold"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                                <span>Details</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {paymentTotalPages > 1 && (
                <div className="p-4 border-t border-appBorder flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    Page <span className="font-bold text-navy-900">{paymentPage}</span> of{' '}
                    <span className="font-bold text-navy-900">{paymentTotalPages}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      disabled={paymentPage <= 1 || paymentsLoading}
                      onClick={() => setPaymentPage((prev) => Math.max(1, prev - 1))}
                      className="px-3 py-1.5 rounded-lg border border-appBorder text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 inline mr-1" />
                      Previous
                    </button>

                    <button
                      disabled={paymentPage >= paymentTotalPages || paymentsLoading}
                      onClick={() => setPaymentPage((prev) => Math.min(paymentTotalPages, prev + 1))}
                      className="px-3 py-1.5 rounded-lg border border-appBorder text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next
                      <ChevronRight className="w-3.5 h-3.5 inline ml-1" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Inquiry Details Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-appBorder max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedInquiry(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-navy-900 text-white flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="font-mono text-xs font-bold text-americanRed">
                  {selectedInquiry.inquiryId}
                </span>
                <h3 className="text-xl font-bold font-heading text-navy-900">
                  Consultation Request Details
                </h3>
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 mb-6 text-xs sm:text-sm">
              <div>
                <span className="text-slate-500 block text-xs">Client Name:</span>
                <span className="font-bold text-navy-900 text-base">{selectedInquiry.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">Company:</span>
                <span className="font-semibold text-slate-800">
                  {selectedInquiry.company || 'Not Specified'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">Email Address:</span>
                <a
                  href={`mailto:${selectedInquiry.email}`}
                  className="font-medium text-navy-900 hover:underline"
                >
                  {selectedInquiry.email}
                </a>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">Phone Number:</span>
                <a
                  href={`tel:${selectedInquiry.phone}`}
                  className="font-medium text-navy-900 hover:underline"
                >
                  {selectedInquiry.phone}
                </a>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500 block text-xs">Interested Service:</span>
                <span className="font-bold text-americanRed">{selectedInquiry.service}</span>
              </div>
            </div>

            {/* Full Message */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-navy-900 mb-2">
                Client Project Message / Financial Scope:
              </h4>
              <div className="p-4 rounded-xl bg-slate-100 text-darkText text-xs sm:text-sm whitespace-pre-wrap leading-relaxed border border-slate-200">
                {selectedInquiry.message}
              </div>
            </div>

            {/* Manage Status & Internal Notes */}
            <div className="p-4 rounded-xl bg-navy-50/50 border border-navy-100 mb-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy-900 mb-1">
                  Change Inquiry Status:
                </label>
                <select
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value)}
                  className="w-full sm:w-60 px-3 py-2 rounded-lg border border-appBorder bg-white text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-navy-900"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="in_review">In Review</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy-900 mb-1">
                  Internal ProAdvisor Team Notes:
                </label>
                <textarea
                  rows={3}
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  placeholder="Add notes on client call, quotes sent, assigned ProAdvisor..."
                  className="w-full p-3 rounded-lg border border-appBorder text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-navy-900"
                ></textarea>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold"
              >
                Close
              </button>
              <button
                type="button"
                disabled={updatingInquiry}
                onClick={handleSaveInquiryUpdates}
                className="px-6 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
              >
                {updatingInquiry ? 'Saving Changes...' : 'Save Updates'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Transaction Details Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-appBorder max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedPayment(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-navy-900 text-white flex items-center justify-center font-bold">
                <Receipt className="w-5 h-5 text-americanRed" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-navy-900">
                    {selectedPayment.orderId}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                      paymentStatusColors[selectedPayment.paymentStatus] || 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {selectedPayment.paymentStatus}
                  </span>
                </div>
                <h3 className="text-xl font-bold font-heading text-navy-900 mt-0.5">
                  Cashfree Payment Record
                </h3>
              </div>
            </div>

            {/* Failure Alert Banner if any */}
            {selectedPayment.failureReason && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Gateway Failure Details:</strong>
                  <span>{selectedPayment.failureReason}</span>
                </div>
              </div>
            )}

            {/* Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 mb-6 text-xs sm:text-sm">
              <div>
                <span className="text-slate-500 block text-xs">Customer Name:</span>
                <span className="font-bold text-navy-900 text-base">{selectedPayment.customerName}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-xs">Total Amount:</span>
                <span className="font-extrabold text-navy-900 text-lg font-heading">
                  {selectedPayment.currency} {selectedPayment.amount?.toFixed?.(2) || selectedPayment.amount}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block text-xs">Email Address:</span>
                <a
                  href={`mailto:${selectedPayment.customerEmail}`}
                  className="font-medium text-navy-900 hover:underline"
                >
                  {selectedPayment.customerEmail}
                </a>
              </div>

              <div>
                <span className="text-slate-500 block text-xs">Mobile Phone:</span>
                <a
                  href={`tel:${selectedPayment.customerPhone}`}
                  className="font-medium text-navy-900 hover:underline"
                >
                  {selectedPayment.customerPhone}
                </a>
              </div>

              <div>
                <span className="text-slate-500 block text-xs">Selected Plan / Service:</span>
                <span className="font-bold text-americanRed">{selectedPayment.serviceName}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-xs">Payment Method:</span>
                <span className="font-semibold text-slate-800 capitalize">
                  {selectedPayment.paymentMethod || '—'}
                </span>
              </div>

              {selectedPayment.cashfreePaymentId && (
                <div>
                  <span className="text-slate-500 block text-xs">Cashfree Payment ID:</span>
                  <span className="font-mono text-slate-700">{selectedPayment.cashfreePaymentId}</span>
                </div>
              )}

              {selectedPayment.cashfreeOrderId && (
                <div>
                  <span className="text-slate-500 block text-xs">Cashfree Order ID:</span>
                  <span className="font-mono text-slate-700">{selectedPayment.cashfreeOrderId}</span>
                </div>
              )}

              <div>
                <span className="text-slate-500 block text-xs">Created At:</span>
                <span className="text-slate-600">
                  {new Date(selectedPayment.createdAt).toLocaleString()}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block text-xs">Last Updated:</span>
                <span className="text-slate-600">
                  {new Date(selectedPayment.updatedAt).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Gateway Technical Data */}
            {selectedPayment.rawCashfreeResponse && (
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-navy-900 mb-2">
                  Gateway Audit Snapshot:
                </h4>
                <div className="max-h-48 overflow-y-auto p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] leading-relaxed border border-slate-800">
                  <pre>{JSON.stringify(selectedPayment.rawCashfreeResponse, null, 2)}</pre>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedPayment(null)}
                className="px-6 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs sm:text-sm font-bold shadow-md transition-all"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {inquiryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-appBorder">
            <div className="flex items-center gap-3 text-americanRed mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-americanRed" />
              </div>
              <h3 className="font-heading font-bold text-lg text-navy-900">
                Confirm Deletion
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mb-6">
              Are you sure you want to permanently delete inquiry{' '}
              <strong className="text-navy-900">{inquiryToDelete.inquiryId}</strong> from{' '}
              <strong className="text-navy-900">{inquiryToDelete.name}</strong>? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setInquiryToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                disabled={deleting}
                onClick={confirmDeleteInquiry}
                className="px-5 py-2 rounded-xl bg-americanRed hover:bg-americanRed-hover text-white text-xs font-bold shadow-sm"
              >
                {deleting ? 'Deleting...' : 'Permanently Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;

