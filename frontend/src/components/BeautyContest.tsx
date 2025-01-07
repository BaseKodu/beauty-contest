import React, { useState } from 'react';
import SinglePlayerGame from './SinglePlayerGame';

// Types
type GameMode = 'single' | 'multiplayer';

interface GameSettings {
  mode: GameMode;
  playerCount: number;
  baseFactor: number;
  eliminationThreshold: number;
}

interface Player {
  id: string;
  isAI: boolean;
  points: number;
  connected: boolean;
}

// Game Setup Component
const GameSetup: React.FC<{
  onStartGame: (settings: GameSettings) => void;
}> = ({ onStartGame }) => {
  const [settings, setSettings] = useState<GameSettings>({
    mode: 'single',
    playerCount: 5,
    baseFactor: 0.8,
    eliminationThreshold: -10,
  });

  return (
    <div className="card w-96 bg-base-100 shadow-xl mx-auto mt-8">
      <div className="card-body">
        <h2 className="card-title">Beauty Contest Game Setup</h2>
        
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Game Mode</span>
          </label>
          <select 
            className="select select-bordered w-full"
            value={settings.mode}
            onChange={(e) => setSettings({
              ...settings,
              mode: e.target.value as GameMode
            })}
          >
            <option value="single">Single Player (vs AI)</option>
            <option value="multiplayer">Multiplayer</option>
          </select>
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">
              {settings.mode === 'single' ? 'Number of AI Opponents' : 'Number of Players'}
            </span>
          </label>
          <input
            type="number"
            min="2"
            max="10"
            value={settings.playerCount}
            onChange={(e) => setSettings({
              ...settings,
              playerCount: parseInt(e.target.value)
            })}
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Base Factor (0.1 - 1.0)</span>
          </label>
          <input
            type="number"
            min="0.1"
            max="1.0"
            step="0.1"
            value={settings.baseFactor}
            onChange={(e) => setSettings({
              ...settings,
              baseFactor: parseFloat(e.target.value)
            })}
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Elimination Points Threshold</span>
          </label>
          <input
            type="number"
            max="0"
            value={settings.eliminationThreshold}
            onChange={(e) => setSettings({
              ...settings,
              eliminationThreshold: parseInt(e.target.value)
            })}
            className="input input-bordered w-full"
          />
        </div>

        <div className="card-actions justify-end mt-4">
          <button
            onClick={() => onStartGame(settings)}
            className="btn btn-primary w-full"
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const BeautyContest = () => {
  const [gameSettings, setGameSettings] = useState<GameSettings | null>(null);
  
  const handleStartGame = (settings: GameSettings) => {
    setGameSettings(settings);
    console.log('Starting game with settings:', settings);
    // We'll implement the actual game logic in the next step
  };

  return (
    <div className="container mx-auto p-4">
      {!gameSettings ? (
        <GameSetup onStartGame={handleStartGame} />
      ) : (
        <SinglePlayerGame 
          settings={gameSettings}
          onGameEnd={() => setGameSettings(null)}
        />
      )}
    </div>
  );
};

export default BeautyContest;