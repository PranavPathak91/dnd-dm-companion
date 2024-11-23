import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  rollDice, 
  selectAllRolls,
  clearRolls,
  selectDiceStatus,
  selectDiceError
} from '../store/slices/diceSlice';

const DiceRoller = () => {
  const dispatch = useDispatch();
  const rolls = useSelector(selectAllRolls);
  const status = useSelector(selectDiceStatus);
  const error = useSelector(selectDiceError);
  const [selectedDice, setSelectedDice] = useState('d20');
  const [numDice, setNumDice] = useState(1);

  const diceTypes = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'];

  const handleRoll = async () => {
    try {
      await dispatch(rollDice({ dice: selectedDice, num: numDice })).unwrap();
    } catch (error) {
      console.error('Failed to roll dice:', error);
    }
  };

  const formatRollResult = (roll) => {
    if (!roll) return '';
    return `${roll.num}${roll.dice}: [${roll.results.join(', ')}] = ${roll.total}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dice Roller</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Dice Selection */}
      <div className="mb-8 space-y-4">
        <div className="flex space-x-4">
          {diceTypes.map((dice) => (
            <button
              key={dice}
              onClick={() => setSelectedDice(dice)}
              className={`px-4 py-2 rounded ${
                selectedDice === dice
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {dice}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <input
            type="number"
            value={numDice}
            onChange={(e) => setNumDice(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20 p-2 border rounded"
            min="1"
            max="100"
          />
          <span className="text-lg">×</span>
          <span className="text-lg">{selectedDice}</span>
          <button
            onClick={handleRoll}
            disabled={status === 'loading'}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {status === 'loading' ? 'Rolling...' : 'Roll!'}
          </button>
        </div>
      </div>

      {/* Last Roll Result */}
      {rolls.length > 0 && (
        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Last Roll</h2>
          <p className="text-lg">{formatRollResult(rolls[rolls.length - 1])}</p>
        </div>
      )}

      {/* Roll History */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Roll History</h2>
          <button
            onClick={() => dispatch(clearRolls())}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Clear History
          </button>
        </div>
        <div className="space-y-2">
          {rolls.map((roll) => (
            <div
              key={roll.id}
              className="p-3 bg-gray-50 rounded border"
            >
              <p>{formatRollResult(roll)}</p>
              <p className="text-sm text-gray-500">
                {new Date(roll.timestamp).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiceRoller;
