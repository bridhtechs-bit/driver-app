import { io, Socket } from 'socket.io-client';
import Config from '@/constants/config';
import secureStoreHelper from '@/services/api/secureStore';

let socket: Socket | null = null;

export async function createSocketClient() {
  if (socket?.connected) {
    return socket;
  }

  const token = await secureStoreHelper.getItem('token');
  socket = io(Config.SOCKET_URL, {
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
