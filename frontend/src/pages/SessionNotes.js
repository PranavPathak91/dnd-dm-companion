import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSessions,
  createSession,
  updateSession,
  selectAllSessions,
  selectSessionsByCampaign,
  selectRecentSessions,
  selectSessionsStatus,
  selectSessionsError
} from '../store/slices/sessionsSlice';
import { PlusIcon, CalendarIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const SessionNotes = () => {
  const dispatch = useDispatch();
  const sessions = useSelector(selectAllSessions);
  const recentSessions = useSelector((state) => selectRecentSessions(state, 5));
  const status = useSelector(selectSessionsStatus);
  const error = useSelector(selectSessionsError);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [newSession, setNewSession] = useState({
    notes: '',
    campaign_id: ''
  });
  const [showNewForm, setShowNewForm] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchSessions());
    }
  }, [status, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createSession(newSession));
    setNewSession({
      notes: '',
      campaign_id: ''
    });
    setShowNewForm(false);
  };

  const handleUpdateNotes = (id, notes) => {
    dispatch(updateSession({ id, sessionData: { notes } }));
  };

  const handleEditSession = (session) => {
    // Add edit session logic here
  };

  const handleDeleteSession = (id) => {
    // Add delete session logic here
  };

  if (status === 'loading') {
    return <div className="flex justify-center items-center h-full">Loading sessions...</div>;
  }

  if (status === 'failed') {
    return <div className="text-red-600">Error: {error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Session Notes</h1>
        <button
          onClick={() => setShowNewForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          New Session
        </button>
      </div>

      {showNewForm && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign
              </label>
              <select
                value={newSession.campaign_id}
                onChange={(e) => setNewSession({ ...newSession, campaign_id: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a campaign</option>
                {/* Add campaigns data here */}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Notes
              </label>
              <textarea
                value={newSession.notes}
                onChange={(e) => setNewSession({ ...newSession, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="8"
                placeholder="Write your session notes here..."
                required
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowNewForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Session
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="bg-white shadow-sm rounded-lg p-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {session.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {new Date(session.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditSession(session)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteSession(session.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <p className="mt-4 text-gray-600">{session.notes}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionNotes;
