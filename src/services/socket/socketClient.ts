import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from '@/constants/config';
import { getAuthToken } from '@/services/secureStore';

let socket: Socket | null = null;

export async function createSocketClient() {
  if (socket?.connected) {
    return socket;
  }

  const token = await getAuthToken();
  socket = io(API_BASE_URL, {
    autoConnect: false,
    auth: {
      token,
    },
  });

  return socket;
}

export function getSocketClient(): Socket | null {
  return socket;
}
