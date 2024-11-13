import React, { useState, useEffect } from 'react';
import { pb } from '../lib/pocketbase';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import toast from 'react-hot-toast';

interface VoteInput {
  playerId: string;
  points: number;
}

export function VotingPage() {
  const { user } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const [players, setPlayers] = useState<Array<{ id: string; name: string }>>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [isBye, setIsBye] = useState(false);
  const [fairestVotes, setFairestVotes] = useState<VoteInput[]>([]);
  const [fielderVotes, setFielderVotes] = useState<VoteInput[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      const records = await pb.collection('players').getFullList({
        filter: `team = "${user?.team}" && active = true`,
        sort: 'name',
      });
      setPlayers(records);
    } catch (error) {
      toast.error('Failed to load players');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBye) {
      try {
        await pb.collection('games').create({
          round: currentRound,
          team: user?.team,
          season: new Date().getFullYear(),
          isBye: true,
        });
        toast.success('Bye round recorded successfully');
        return;
      } catch (error) {
        toast.error('Failed to record bye round');
        return;
      }
    }

    if (fairestVotes.length !== 3 || fielderVotes.length !== 3) {
      toast.error('Please select 3 players for each category');
      return;
    }

    setIsSubmitting(true);

    try {
      const game = await pb.collection('games').create({
        round: currentRound,
        team: user?.team,
        season: new Date().getFullYear(),
        isBye: false,
      });

      const votes = [
        ...fairestVotes.map(vote => ({
          gameId: game.id,
          category: 'fairest',
          playerId: vote.playerId,
          points: vote.points,
        })),
        ...fielderVotes.map(vote => ({
          gameId: game.id,
          category: 'fielder',
          playerId: vote.playerId,
          points: vote.points,
        })),
      ];

      await Promise.all(
        votes.map(vote => pb.collection('votes').create(vote))
      );

      toast.success('Votes submitted successfully');
      setFairestVotes([]);
      setFielderVotes([]);
      setCurrentRound(prev => prev + 1);
    } catch (error) {
      toast.error('Failed to submit votes');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`card ${isDarkMode ? 'card-dark' : 'card-light'}`}>
      <h2 className="text-2xl font-bold mb-6">Cast Votes - Round {currentRound}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isBye}
              onChange={(e) => setIsBye(e.target.checked)}
              className="mr-2"
            />
            This round is a bye
          </label>
        </div>

        {!isBye && (
          <>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Fairest & Best</h3>
              {[3, 2, 1].map((points) => (
                <select
                  key={`fairest-${points}`}
                  value={fairestVotes.find(v => v.points === points)?.playerId || ''}
                  onChange={(e) => {
                    const newVotes = fairestVotes.filter(v => v.points !== points);
                    if (e.target.value) {
                      newVotes.push({ playerId: e.target.value, points });
                    }
                    setFairestVotes(newVotes);
                  }}
                  className="w-full p-2 border rounded"
                  required={!isBye}
                >
                  <option value="">Select player for {points} points</option>
                  {players.map(player => (
                    <option
                      key={player.id}
                      value={player.id}
                      disabled={fairestVotes.some(v => v.playerId === player.id && v.points !== points)}
                    >
                      {player.name}
                    </option>
                  ))}
                </select>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Best Fielder</h3>
              {[3, 2, 1].map((points) => (
                <select
                  key={`fielder-${points}`}
                  value={fielderVotes.find(v => v.points === points)?.playerId || ''}
                  onChange={(e) => {
                    const newVotes = fielderVotes.filter(v => v.points !== points);
                    if (e.target.value) {
                      newVotes.push({ playerId: e.target.value, points });
                    }
                    setFielderVotes(newVotes);
                  }}
                  className="w-full p-2 border rounded"
                  required={!isBye}
                >
                  <option value="">Select player for {points} points</option>
                  {players.map(player => (
                    <option
                      key={player.id}
                      value={player.id}
                      disabled={fielderVotes.some(v => v.playerId === player.id && v.points !== points)}
                    >
                      {player.name}
                    </option>
                  ))}
                </select>
              ))}
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary w-full"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Votes'}
        </button>
      </form>
    </div>
  );
}