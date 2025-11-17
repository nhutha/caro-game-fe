import { useEffect, useRef } from 'react';
import createCableConsumer from '@/lib/actioncable';

interface UseActionCableSubscriptionOptions {
  query: string;
  operationName: string;
  variables?: Record<string, any>;
  onData: (data: any) => void;
  onError?: (error: any) => void;
}

/**
 * Custom hook for ActionCable GraphQL subscriptions
 * Uses stable callback references to prevent re-subscription on callback changes
 */
export function useActionCableSubscription({
  query,
  operationName,
  variables = {},
  onData,
  onError,
}: UseActionCableSubscriptionOptions) {
  // Store callbacks in refs to keep them stable
  const onDataRef = useRef(onData);
  const onErrorRef = useRef(onError);

  // Update refs when callbacks change
  useEffect(() => {
    onDataRef.current = onData;
  }, [onData]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    const cable = createCableConsumer();
    
    const subscription = cable.subscriptions.create('GraphqlChannel', {
      connected() {
        console.log(`[ActionCable] Connected to ${operationName}`);
        // Send subscription query
        this.perform('execute', {
          query,
          variables,
          operationName,
        });
      },

      disconnected() {
        console.log(`[ActionCable] Disconnected from ${operationName}`);
      },

      received(data: any) {
        console.log(`[ActionCable] Received data for ${operationName}:`, data);
        
        if (data.errors) {
          console.error(`[ActionCable] Errors in ${operationName}:`, data.errors);
          if (onErrorRef.current) {
            onErrorRef.current(data.errors);
          }
        } else if (data.result?.data) {
          onDataRef.current(data.result.data);
        }
      },
    });

    // Cleanup on unmount
    return () => {
      console.log(`[ActionCable] Unsubscribing from ${operationName}`);
      subscription.unsubscribe();
    };
  }, [query, operationName, variables]);
}
