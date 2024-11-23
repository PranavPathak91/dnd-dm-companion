import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchSessions, 
  createSession, 
  updateSession,
  selectAllSessions,
  selectSessionsStatus,
  selectSessionsError
} from '../store/slices/sessionsSlice';
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

const Sessions = () => {
  const dispatch = useDispatch();
  const sessions = useSelector(selectAllSessions);
  const status = useSelector(selectSessionsStatus);
  const error = useSelector(selectSessionsError);
  const [showNewForm, setShowNewForm] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [formData, setFormData] = useState({
    campaign_id: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    dispatch(fetchSessions());
    fetchCampaigns();
  }, [dispatch]);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('http://localhost:5001/campaigns');
      const data = await response.json();
      setCampaigns(data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSession) {
        await dispatch(updateSession({ 
          id: editingSession.id, 
          sessionData: formData 
        })).unwrap();
      } else {
        await dispatch(createSession(formData)).unwrap();
      }
      setFormData({
        campaign_id: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      setShowNewForm(false);
      setEditingSession(null);
      dispatch(fetchSessions());
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  };

  const handleEdit = (session) => {
    setEditingSession(session);
    setFormData({
      campaign_id: session.campaign_id,
      date: new Date(session.date).toISOString().split('T')[0],
      notes: session.notes
    });
    setShowNewForm(true);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (status === 'loading') {
    return <div className="flex justify-center items-center h-full">Loading sessions...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Session Notes</h1>
        <button
          onClick={() => {
            setEditingSession(null);
            setFormData({
              campaign_id: '',
              date: new Date().toISOString().split('T')[0],
              notes: ''
            });
            setShowNewForm(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          New Session
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {showNewForm && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {editingSession ? 'Edit Session' : 'New Session'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="campaign" className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign
                </label>
                <select
                  id="campaign"
                  value={formData.campaign_id}
                  onChange={(e) => setFormData({ ...formData, campaign_id: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a campaign</option>
                  {campaigns.map((campaign) => (
                    <option key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full h-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowNewForm(false);
                  setEditingSession(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                {editingSession ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {campaigns.find(c => c.id === session.campaign_id)?.name || 'Unknown Campaign'}
                </h3>
                <p className="text-gray-600">
                  {formatDate(session.date)}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(session)}
                  className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <PencilSquareIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{session.notes}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sessions;
