import React, { useState, useEffect } from 'react';

interface GameState {
  round: number;
  players: {
    id: string;
    isAI: boolean;
    points: number;
    number?: number;
  }[];
  status: 'submitting' | 'results' | 'finished';
  roundResult?: {
    average: number;
    target: number;
    winners: string[];
  };
}

interface GameProps {
  settings: {
    playerCount: number;
    baseFactor: number;
    eliminationThreshold: number;
  };
  onGameEnd?: () => void;
}

const SinglePlayerGame: React.FC<GameProps> = ({ settings, onGameEnd }) => {
  const [gameState, setGameState] = useState<GameState>(() => ({
    round: 1,
    players: [
      { id: 'player1', isAI: false, points: 0 }, // Human player
      ...Array.from({ length: settings.playerCount - 1 }, (_, i) => ({
        id: `ai${i + 1}`,
        isAI: true,
        points: 0
      }))
    ],
    status: 'submitting'
  }));

  const [playerNumber, setPlayerNumber] = useState<string>('');

  // Generate AI numbers and calculate results
  const processRound = (humanNumber: number) => {
    const numbers = new Map<string, number>();
    numbers.set('player1', humanNumber);

    // Generate AI numbers
    gameState.players.forEach(player => {
      if (player.isAI) {
        numbers.set(player.id, Math.floor(Math.random() * 101));
      }
    });

    // Calculate average and target
    const allNumbers = Array.from(numbers.values());
    const average = allNumbers.reduce((a, b) => a + b, 0) / allNumbers.length;
    const target = average * settings.baseFactor;

    // Find winners (closest to target)
    let minDifference = Infinity;
    let winners: string[] = [];
    
    numbers.forEach((number, playerId) => {
      const difference = Math.abs(number - target);
      if (difference < minDifference) {
        minDifference = difference;
        winners = [playerId];
      } else if (difference === minDifference) {
        winners.push(playerId);
      }
    });

    // Update points
    const updatedPlayers = gameState.players.map(player => ({
      ...player,
      number: numbers.get(player.id),
      points: winners.includes(player.id) 
        ? player.points 
        : player.points - 1
    }));

    return {
      players: updatedPlayers,
      roundResult: { average, target, winners },
    };
  };

  const handleNumberSubmit = () => {
    const number = parseInt(playerNumber);
    if (isNaN(number) || number < 0 || number > 100) {
      alert('Please enter a valid number between 0 and 100');
      return;
    }

    const { players, roundResult } = processRound(number);
    
    setGameState(prev => ({
      ...prev,
      players,
      roundResult,
      status: 'results'
    }));
    setPlayerNumber('');
  };

  const startNextRound = () => {
    // Remove eliminated players
    const remainingPlayers = gameState.players.filter(
      player => player.points > settings.eliminationThreshold
    );

    if (remainingPlayers.length <= 1) {
      setGameState(prev => ({
        ...prev,
        status: 'finished',
        players: remainingPlayers
      }));
    } else {
      setGameState({
        round: gameState.round + 1,
        players: remainingPlayers,
        status: 'submitting'
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Round {gameState.round}</h2>
          
          {gameState.status === 'submitting' && (
            <div className="form-control">
              <label className="label">
                <span className="label-text">Enter your number (0-100):</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={playerNumber}
                  onChange={(e) => setPlayerNumber(e.target.value)}
                  className="input input-bordered w-full"
                />
                <button 
                  className="btn btn-primary"
                  onClick={handleNumberSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          )}

          {gameState.status === 'results' && gameState.roundResult && (
            <div className="space-y-4">
              <div className="stats shadow">
                <div className="stat">
                  <div className="stat-title">Average</div>
                  <div className="stat-value">{gameState.roundResult.average.toFixed(2)}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Target ({settings.baseFactor}x)</div>
                  <div className="stat-value">{gameState.roundResult.target.toFixed(2)}</div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Player</th>
                      <th>Number</th>
                      <th>Points</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gameState.players.map(player => (
                      <tr key={player.id}>
                        <td>{player.isAI ? `AI ${player.id.slice(2)}` : 'You'}</td>
                        <td>{player.number}</td>
                        <td>{player.points}</td>
                        <td>
                          {gameState.roundResult.winners.includes(player.id) 
                            ? <span className="text-success">Winner</span>
                            : <span className="text-error">-1 point</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button 
                className="btn btn-primary w-full"
                onClick={startNextRound}
              >
                Next Round
              </button>
            </div>
          )}

          {gameState.status === 'finished' && (
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold">
                Game Over! 
                {gameState.players[0]?.isAI 
                  ? 'AI Wins!'
                  : 'You Win!'}
              </h3>
              <button 
                className="btn btn-primary"
                onClick={onGameEnd}
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SinglePlayerGame;