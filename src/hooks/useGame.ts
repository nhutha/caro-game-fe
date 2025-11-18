import { useState, useCallback, useEffect } from 'react';
import apolloClient from '@/lib/apollo';
import { GET_GAME } from '@/lib/graphql/queries';
import { START_GAME, MAKE_MOVE, FORFEIT_GAME } from '@/lib/graphql/mutations';
import { GAME_UPDATED_SUBSCRIPTION } from '@/lib/graphql/subscriptions';
import { useActionCableSubscription } from './useActionCableSubscription';
import { Game, Move, User, MakeMoveResponse } from '@/types';

interface GetGameResponse {
  game: Game;
}

interface StartGameResponse {
  startGame: {
    game: Game;
  };
}

interface ForfeitGameResponse {
  forfeitGame: {
    game: Game;
  };
}

interface UseGameResult {
  game: Game | null;
  loading: boolean;
  error: any;
  startGame: (roomId: string) => Promise<Game | null>;
  makeMove: (row: number, col: number) => Promise<boolean>;
  forfeitGame: () => Promise<boolean>;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for managing game state with real-time updates
 */
export function useGame(gameId?: string): UseGameResult {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  // Fetch game data
  const fetchGame = useCallback(async () => {
    if (!gameId) return;

    try {
      setLoading(true);
      setError(null);
      
      const result = await apolloClient.query<GetGameResponse>({
        query: GET_GAME,
        variables: { id: gameId },
        fetchPolicy: 'network-only',
      });

      setGame(result.data?.game || null);
    } catch (err) {
      console.error('[useGame] Error fetching game:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  // Fetch game on mount and when gameId changes
  useEffect(() => {
    if (gameId) {
      fetchGame();
    }
  }, [gameId, fetchGame]);

  // Start game mutation
  const startGame = useCallback(async (roomId: string): Promise<Game | null> => {
    try {
      setLoading(true);
      setError(null);

      console.log('[useGame] Starting game for room:', roomId);

      const result = await apolloClient.mutate<StartGameResponse>({
        mutation: START_GAME,
        variables: { 
          input: {
            roomId 
          }
        },
      });

      const newGame = result.data?.startGame?.game;
      if (newGame) {
        console.log('[useGame] Game started:', newGame);
        setGame(newGame);
        return newGame;
      }

      return null;
    } catch (err: any) {
      console.error('[useGame] Error starting game:', err);
      setError(err);
      throw new Error(err?.graphQLErrors?.[0]?.message || 'Failed to start game');
    } finally {
      setLoading(false);
    }
  }, []);

  // Make move mutation
  const makeMove = useCallback(async (row: number, col: number): Promise<boolean> => {
    if (!game) return false;

    try {
      setLoading(true);
      setError(null);

      console.log('[useGame] Making move:', { gameId: game.id, row, col });

      const result = await apolloClient.mutate<MakeMoveResponse>({
        mutation: MAKE_MOVE,
        variables: { 
          input: {
            gameId: game.id, 
            row, 
            col 
          }
        },
      });

      const moveData = result.data?.makeMove;
      if (moveData) {
        console.log('[useGame] Move made:', moveData);
        
        // Update game state
        setGame(moveData.game);

        if (moveData.gameEnded) {
          console.log('[useGame] Game ended. Winner:', moveData.winner);
        }

        return true;
      }

      return false;
    } catch (err: any) {
      console.error('[useGame] Error making move:', err);
      setError(err);
      throw new Error(err?.graphQLErrors?.[0]?.message || 'Failed to make move');
    } finally {
      setLoading(false);
    }
  }, [game]);

  // Forfeit game mutation
  const forfeitGame = useCallback(async (): Promise<boolean> => {
    if (!game) return false;

    try {
      setLoading(true);
      setError(null);

      console.log('[useGame] Forfeiting game:', game.id);

      const result = await apolloClient.mutate<ForfeitGameResponse>({
        mutation: FORFEIT_GAME,
        variables: { 
          input: {
            gameId: game.id 
          }
        },
      });

      const forfeitData = result.data?.forfeitGame?.game;
      if (forfeitData) {
        console.log('[useGame] Game forfeited:', forfeitData);
        setGame(forfeitData);
        return true;
      }

      return false;
    } catch (err: any) {
      console.error('[useGame] Error forfeiting game:', err);
      setError(err);
      throw new Error(err?.graphQLErrors?.[0]?.message || 'Failed to forfeit game');
    } finally {
      setLoading(false);
    }
  }, [game]);

  // Handle game updates from subscription
  const handleGameUpdated = useCallback((subscriptionData: any) => {
    const gameUpdateData = subscriptionData.gameUpdated;
    if (gameUpdateData) {
      const updatedGame = gameUpdateData.game;
      const move = gameUpdateData.move;
      const eventType = gameUpdateData.eventType;

      console.log('[useGame] Game updated:', { eventType, move, game: updatedGame });

      setGame(updatedGame);

      // You can add toast notifications here based on eventType
      if (eventType === 'move_made') {
        console.log(`[useGame] ${move.user.username} placed ${move.symbol} at (${move.row}, ${move.col})`);
      } else if (eventType === 'game_ended') {
        console.log(`[useGame] Game ended. Winner: ${updatedGame.winner?.username || 'Draw'}`);
      } else if (eventType === 'game_forfeited') {
        console.log(`[useGame] Game forfeited`);
      }
    }
  }, []);

  // Subscribe to game updates
  useActionCableSubscription({
    query: GAME_UPDATED_SUBSCRIPTION,
    variables: gameId ? { gameId } : undefined,
    operationName: 'GameUpdated',
    onData: handleGameUpdated,
    onError: (err) => console.error('[useGame] Subscription error:', err),
    skip: !gameId, // Only subscribe if gameId exists
  });

  return {
    game,
    loading,
    error,
    startGame,
    makeMove,
    forfeitGame,
    refetch: fetchGame,
  };
}
