import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon } from '@heroicons/react/24/outline';
import {
  fetchCharacters,
  createCharacter,
  updateCharacter,
  selectAllCharacters,
  selectCharactersStatus,
  selectCharactersError
} from '../store/slices/charactersSlice';

const Characters = () => {
  const dispatch = useDispatch();
  const characters = useSelector(selectAllCharacters);
  const status = useSelector(selectCharactersStatus);
  const error = useSelector(selectCharactersError);
  const [newCharacter, setNewCharacter] = useState({
    name: '',
    character_class: '',
    level: 1,
    race: '',
    hit_points: '',
    campaign_id: ''
  });
  const [showNewForm, setShowNewForm] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [campaignsError, setCampaignsError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [updatingCharacterId, setUpdatingCharacterId] = useState(null);

  useEffect(() => {
    dispatch(fetchCharacters());
    fetchCampaigns();
  }, [dispatch]);

  const fetchCampaigns = async () => {
    try {
      const response = await api.get('/campaigns');
      console.log('Fetched campaigns:', response.data);
      setCampaigns(response.data);
      setCampaignsError(null);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setCampaignsError('Failed to fetch campaigns. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      console.log('Creating character with data:', newCharacter);
      const resultAction = await dispatch(createCharacter(newCharacter)).unwrap();
      console.log('Character created:', resultAction);
      
      setNewCharacter({
        name: '',
        character_class: '',
        level: 1,
        race: '',
        hit_points: '',
        campaign_id: ''
      });
      setShowNewForm(false);
      
      // Refresh the characters list
      dispatch(fetchCharacters());
    } catch (error) {
      console.error('Failed to create character:', error);
      setSubmitError(error.message || 'Failed to create character. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (id, characterData) => {
    try {
      setUpdatingCharacterId(id);
      setSubmitError(null);
      console.log('Updating character:', id, characterData);
      
      const resultAction = await dispatch(updateCharacter({ id, characterData })).unwrap();
      console.log('Character updated:', resultAction);
      
      // Refresh character list
      await dispatch(fetchCharacters());
      
      setUpdatingCharacterId(null);
    } catch (error) {
      console.error('Failed to update character:', error);
      setSubmitError(error.response?.data?.error || error.message || 'Failed to update character. Please try again.');
      setUpdatingCharacterId(null);
    }
  };

  if (status === 'loading') {
    return <div className="flex justify-center items-center h-full">Loading characters...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Characters</h1>
        <button
          onClick={() => setShowNewForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          New Character
        </button>
      </div>

      {campaignsError && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {campaignsError}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {submitError && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {submitError}
        </div>
      )}

      {showNewForm && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Character Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={newCharacter.name}
                  onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-2">
                  Class
                </label>
                <input
                  type="text"
                  id="class"
                  value={newCharacter.character_class}
                  onChange={(e) => setNewCharacter({ ...newCharacter, character_class: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
                  Level
                </label>
                <input
                  type="number"
                  id="level"
                  value={newCharacter.level}
                  onChange={(e) => setNewCharacter({ ...newCharacter, level: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="20"
                  required
                />
              </div>
              <div>
                <label htmlFor="hp" className="block text-sm font-medium text-gray-700 mb-2">
                  Hit Points
                </label>
                <input
                  type="number"
                  id="hp"
                  value={newCharacter.hit_points}
                  onChange={(e) => setNewCharacter({ ...newCharacter, hit_points: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="race" className="block text-sm font-medium text-gray-700 mb-2">
                  Race
                </label>
                <input
                  type="text"
                  id="race"
                  value={newCharacter.race}
                  onChange={(e) => setNewCharacter({ ...newCharacter, race: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="campaign" className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign
                </label>
                <select
                  id="campaign"
                  value={newCharacter.campaign_id}
                  onChange={(e) => setNewCharacter({ ...newCharacter, campaign_id: parseInt(e.target.value) })}
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
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={() => setShowNewForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 text-white rounded-md transition-colors ${
                  isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Character'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {characters.map((character) => (
          <div
            key={character.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {character.name}
            </h3>
            <div className="text-gray-600 space-y-2">
              <p>Class: {character.character_class}</p>
              <p>Level: {character.level}</p>
              <p>Race: {character.race}</p>
              <p>HP: {character.hit_points}</p>
              <p>Campaign: {campaigns.find(c => c.id === character.campaign_id)?.name || 'Unknown'}</p>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => handleUpdate(character.id, { ...character, level: character.level + 1 })}
                className={`text-sm text-white py-1 px-3 rounded transition-colors ${
                  updatingCharacterId === character.id ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                }`}
                disabled={updatingCharacterId === character.id}
              >
                {updatingCharacterId === character.id ? 'Updating...' : 'Level Up'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Characters;
