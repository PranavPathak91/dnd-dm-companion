import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMonsters,
  createMonster,
  setSearchTerm,
  filterByCR,
  clearFilters,
  selectFilteredMonsters,
  selectMonstersStatus,
  selectMonstersError
} from '../store/slices/monstersSlice';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Monsters = () => {
  const dispatch = useDispatch();
  const monsters = useSelector(selectFilteredMonsters);
  const status = useSelector(selectMonstersStatus);
  const error = useSelector(selectMonstersError);
  const [newMonster, setNewMonster] = useState({
    name: '',
    challenge_rating: '',
    hit_points: '',
    armor_class: '',
    description: ''
  });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMonsters());
    }
  }, [status, dispatch]);

  const handleSearch = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleCRFilter = (cr) => {
    dispatch(filterByCR(cr));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(createMonster(newMonster));
    setNewMonster({
      name: '',
      challenge_rating: '',
      hit_points: '',
      armor_class: '',
      description: ''
    });
  };

  if (status === 'loading') {
    return <div className="flex justify-center items-center h-full">Loading monsters...</div>;
  }

  if (status === 'failed') {
    return <div className="text-red-600">Error: {error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Monster Encyclopedia</h1>
        <button
          onClick={() => setNewMonster({
            name: '',
            challenge_rating: '',
            hit_points: '',
            armor_class: '',
            description: ''
          })}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Monster
        </button>
      </div>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search monsters..."
          onChange={handleSearch}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monster Name
              </label>
              <input
                type="text"
                value={newMonster.name}
                onChange={(e) => setNewMonster({ ...newMonster, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Challenge Rating
              </label>
              <input
                type="number"
                step="0.125"
                value={newMonster.challenge_rating}
                onChange={(e) => setNewMonster({ ...newMonster, challenge_rating: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hit Points
              </label>
              <input
                type="number"
                value={newMonster.hit_points}
                onChange={(e) => setNewMonster({ ...newMonster, hit_points: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Armor Class
              </label>
              <input
                type="number"
                value={newMonster.armor_class}
                onChange={(e) => setNewMonster({ ...newMonster, armor_class: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={newMonster.description}
              onChange={(e) => setNewMonster({ ...newMonster, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              required
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setNewMonster({
                name: '',
                challenge_rating: '',
                hit_points: '',
                armor_class: '',
                description: ''
              })}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Monster
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {monsters.map((monster) => (
          <div
            key={monster.id}
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold text-gray-900">
                {monster.name}
              </h3>
              <span className="px-2 py-1 text-sm bg-red-100 text-red-800 rounded">
                CR {monster.challenge_rating}
              </span>
            </div>
            <div className="flex gap-4 text-sm text-gray-600 mb-3">
              <span>HP: {monster.hit_points}</span>
              <span>AC: {monster.armor_class}</span>
            </div>
            <p className="text-gray-600">{monster.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Monsters;
