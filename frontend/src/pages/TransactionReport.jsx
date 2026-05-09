import React, { useState, useEffect } from 'react';
import api from '../services/api';

export const TransactionReport = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/wallet/transactions');
      setTransactions(response.data.transactions || response.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch transactions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch = 
        transaction._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || transaction.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'amount') return b.amount - a.amount;
      if (sortBy === 'type') return a.type.localeCompare(b.type);
      return 0;
    });

  const getTypeColor = (type) => {
    switch(type?.toLowerCase()) {
      case 'credit':
      case 'add':
        return 'bg-green-100 text-green-800';
      case 'debit':
      case 'withdraw':
        return 'bg-red-100 text-red-800';
      case 'refund':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalCredit = transactions
    .filter(t => t.type?.toLowerCase() === 'credit' || t.type?.toLowerCase() === 'add')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const totalDebit = transactions
    .filter(t => t.type?.toLowerCase() === 'debit' || t.type?.toLowerCase() === 'withdraw')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const netBalance = totalCredit - totalDebit;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="rounded-3xl bg-white border border-gray-200 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-8">
            <h1 className="text-4xl font-bold text-white mb-4">Transaction Report</h1>
            <div className="grid grid-cols-3 gap-4 text-orange-100">
              <div className="bg-orange-700/30 rounded-lg p-4">
                <p className="text-sm">Total Transactions</p>
                <p className="text-2xl font-bold">{transactions.length}</p>
              </div>
              <div className="bg-orange-700/30 rounded-lg p-4">
                <p className="text-sm">Total Credits</p>
                <p className="text-2xl font-bold text-green-300">₹{totalCredit.toFixed(2)}</p>
              </div>
              <div className="bg-orange-700/30 rounded-lg p-4">
                <p className="text-sm">Total Debits</p>
                <p className="text-2xl font-bold text-red-300">₹{totalDebit.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-gray-200 bg-slate-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Search by ID, user, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                  <option value="add">Add Money</option>
                  <option value="withdraw">Withdraw</option>
                  <option value="refund">Refund</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="date">Date</option>
                  <option value="amount">Amount</option>
                  <option value="type">Type</option>
                </select>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                <p className="mt-4 text-gray-600">Loading transactions...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {error}
              </div>
            )}

            {!loading && !error && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 border-b-2 border-gray-300">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Transaction ID</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">User</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Balance After</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction, index) => (
                      <tr key={transaction._id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="px-6 py-4 text-sm font-mono text-gray-900 font-medium">
                          {transaction._id?.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {transaction.user?.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {transaction.description || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(transaction.type)}`}>
                            {transaction.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold">
                          <span className={transaction.type?.toLowerCase() === 'credit' || transaction.type?.toLowerCase() === 'add' ? 'text-green-600' : 'text-red-600'}>
                            {transaction.type?.toLowerCase() === 'credit' || transaction.type?.toLowerCase() === 'add' ? '+' : '-'}₹{transaction.amount?.toFixed(2) || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          ₹{transaction.balanceAfter?.toFixed(2) || 0}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredTransactions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No transactions found matching your criteria.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
