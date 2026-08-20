import { createConsumer } from '@rails/actioncable';
import { API_ENDPOINTS } from './constants';

// Create ActionCable consumer
const createCableConsumer = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  // WebSocket URL for ActionCable
  const wsUrl = `${API_ENDPOINTS.WEBSOCKET}?token=${token}`;

  return createConsumer(wsUrl);
};

export default createCableConsumer;
