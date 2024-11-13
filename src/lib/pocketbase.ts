import PocketBase from 'pocketbase';
import toast from 'react-hot-toast';

export const pb = new PocketBase('https://scoring.pockethost.io');

pb.autoCancellation(false);

export const authHelpers = {
  async login(username: string, password: string) {
    try {
      const authData = await pb.collection('users').authWithPassword(username, password);
      
      if (!authData?.record) {
        throw new Error('Invalid response from server');
      }

      return {
        success: true,
        data: {
          id: authData.record.id,
          username: authData.record.username,
          role: authData.record.role,
          team: authData.record.team,
        },
        token: authData.token,
      };
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error?.status === 400) {
        return {
          success: false,
          error: 'Invalid username or password',
        };
      }
      
      return {
        success: false,
        error: 'Unable to connect to the server',
      };
    }
  },

  async testConnection() {
    try {
      const response = await fetch('https://scoring.pockethost.io/_', {
        method: 'HEAD',
        cache: 'no-cache',
      });
      
      return response.ok;
    } catch (error) {
      console.error('PocketBase connection error:', error);
      return false;
    }
  }
};

export type User = {
  id: string;
  username: string;
  role: 'captain' | 'admin';
  team?: string;
};

export type Vote = {
  id: string;
  gameId: string;
  category: 'fairest' | 'fielder';
  playerId: string;
  points: number;
  created: string;
};

export type Game = {
  id: string;
  round: number;
  team: string;
  season: number;
  isBye: boolean;
  isLocked: boolean;
  created: string;
};

export type Player = {
  id: string;
  name: string;
  team: string;
  active: boolean;
};