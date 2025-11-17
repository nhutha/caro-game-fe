import { useState } from 'react';
import apolloClient from '@/lib/apollo';
import { JOIN_ROOM } from '@/lib/graphql/mutations';
import { Room } from '@/types';

interface JoinRoomResponse {
  joinRoom: {
    room: Room;
  };
}

interface UseJoinRoomResult {
  joinRoom: (roomId: string) => Promise<Room | null>;
  loading: boolean;
  error: any;
}

/**
 * Custom hook for joining a room
 * Calls the Rails GraphQL backend mutation: joinRoom(roomId: ID!)
 */
export function useJoinRoom(): UseJoinRoomResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const joinRoom = async (roomId: string): Promise<Room | null> => {
    try {
      setLoading(true);
      setError(null);

      console.log('[useJoinRoom] Joining room:', roomId);

      const result = await apolloClient.mutate<JoinRoomResponse>({
        mutation: JOIN_ROOM,
        variables: { 
          input: {
            roomId: roomId
          }
        },
      });

      const room = result.data?.joinRoom?.room;

      if (room) {
        console.log('[useJoinRoom] Successfully joined room:', room);
        return room;
      }

      return null;
    } catch (err: any) {
      console.error('[useJoinRoom] Error joining room:', err);
      setError(err);
      
      // Extract error message from GraphQL errors
      const errorMessage = 
        err?.graphQLErrors?.[0]?.message || 
        err?.message || 
        'Failed to join room';
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    joinRoom,
    loading,
    error,
  };
}
