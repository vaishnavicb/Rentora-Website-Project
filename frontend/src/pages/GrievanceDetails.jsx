import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiMessageCircle, FiUser, FiPackage, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { grievanceService } from '../services/index';

export const GrievanceDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [grievance, setGrievance] = useState(null);
  const [orderGrievances, setOrderGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responseText, setResponseText] = useState('');
  const [status, setStatus] = useState('open');
  const [submitting, setSubmitting] = useState(false);

  const isVendor = user?.role === 'vendor';
  const vendorId = grievance?.vendor?._id?.toString() || grievance?.vendor?.toString();
  const canRespond = isVendor && vendorId === user?._id?.toString();

  useEffect(() => {
    const loadGrievance = async () => {
      setLoading(true);
      try {
        const response = await grievanceService.getGrievanceById(id);
        const grievanceData = response.data;
        setGrievance(grievanceData);
        setResponseText(grievanceData.response || '');
        setStatus(grievanceData.status || 'open');

        const orderId = grievanceData.order?._id?.toString() || grievanceData.order;
        if (orderId) {
          const historyResponse = await grievanceService.getOrderGrievances(orderId);
          setOrderGrievances(historyResponse.data || []);
        }
      } catch (error) {
        console.error('Failed to load grievance:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGrievance();
  }, [id]);

  const handleSubmit = async () => {
    if (!responseText.trim()) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await grievanceService.respondToGrievance(id, {
        response: responseText.trim(),
        status,
      });
      const grievanceData = response.data;
      setGrievance(grievanceData);

      const orderId = grievanceData.order?._id?.toString() || grievanceData.order;
      if (orderId) {
        const historyResponse = await grievanceService.getOrderGrievances(orderId);
        setOrderGrievances(historyResponse.data || []);
      }
    } catch (error) {
      console.error('Failed to submit response:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!grievance) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-xl p-8 text-center">
          <p className="text-lg font-semibold text-gray-700">Grievance not found.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Link
              to={isVendor ? '/vendor-orders' : '/my-orders'}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <FiArrowLeft /> Back to {isVendor ? 'Vendor Orders' : 'My Orders'}
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-gray-800">Grievance Details</h1>
          <p className="text-gray-600 mt-2">Review the grievance, order context, and vendor response.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">Grievance #{grievance._id}</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm uppercase text-slate-500 mb-1">Status</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                  grievance.status === 'resolved'
                    ? 'bg-green-100 text-green-800'
                    : grievance.status === 'in-review'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {grievance.status}
                </span>
              </div>
              <div>
                <p className="text-sm uppercase text-slate-500 mb-1">Created</p>
                <p className="text-sm text-slate-700">{new Date(grievance.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                <div className="flex items-center gap-2 mb-3 text-slate-500 uppercase tracking-[0.2em] text-xs font-semibold">
                  <FiUser /> Customer
                </div>
                <p className="font-semibold text-slate-800">{grievance.customer?.name}</p>
                <p className="text-sm text-slate-600">{grievance.customer?.email}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                <div className="flex items-center gap-2 mb-3 text-slate-500 uppercase tracking-[0.2em] text-xs font-semibold">
                  <FiPackage /> Product
                </div>
                <p className="font-semibold text-slate-800">{grievance.product?.title}</p>
                <p className="text-sm text-slate-600">{grievance.product?.category}</p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-6 border border-slate-200">
              <div className="flex items-center justify-between gap-4 mb-3">
                <p className="text-sm uppercase text-slate-500 tracking-[0.2em] font-semibold">Customer message</p>
              </div>
              <p className="text-slate-700 leading-7">{grievance.message}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-6 border border-slate-200">
              <div className="flex items-center justify-between gap-4 mb-3">
                <p className="text-sm uppercase text-slate-500 tracking-[0.2em] font-semibold">Vendor response</p>
                <span className="text-xs text-slate-500">{grievance.response ? 'Latest' : 'Pending'}</span>
              </div>
              {grievance.response ? (
                <p className="text-slate-700 leading-7">{grievance.response}</p>
              ) : (
                <p className="text-slate-600">No response yet. The vendor can reply from this page.</p>
              )}
            </div>

            {orderGrievances.length > 1 && (
              <div className="rounded-2xl bg-white p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-800">Conversation history</h2>
                  <span className="text-sm text-slate-500">Latest first</span>
                </div>
                <div className="space-y-4">
                  {orderGrievances.map((item) => (
                    <div key={item._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex flex-col gap-2 mb-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">Issue reported</p>
                          <p className="text-sm text-slate-700">{new Date(item.createdAt).toLocaleString()}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.status === 'resolved'
                            ? 'bg-green-100 text-green-800'
                            : item.status === 'in-review'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="rounded-2xl bg-white p-4 border border-slate-200 mb-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold mb-2">Customer</p>
                        <p className="text-slate-800 leading-7">{item.message}</p>
                      </div>
                      {item.response && (
                        <div className="rounded-2xl bg-blue-50 p-4 border border-blue-200">
                          <p className="text-xs uppercase tracking-[0.2em] text-blue-600 font-semibold mb-2">Vendor</p>
                          <p className="text-slate-900 leading-7">{item.response}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {canRespond && (
              <div className="rounded-2xl bg-white p-6 border border-slate-200">
                <div className="flex items-center gap-2 mb-4 text-slate-500 uppercase tracking-[0.2em] text-xs font-semibold">
                  <FiMessageCircle /> Vendor response form
                </div>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  rows={5}
                  className="w-full rounded-2xl border border-slate-300 p-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Write your response to the customer's issue"
                />
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="rounded-2xl border border-slate-300 p-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <option value="open">Open</option>
                    <option value="in-review">In Review</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !responseText.trim()}
                    className={`inline-flex items-center justify-center rounded-2xl px-6 py-3 font-semibold text-white transition ${
                      submitting || !responseText.trim()
                        ? 'bg-slate-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {submitting ? 'Saving...' : 'Save Response'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
