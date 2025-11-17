export interface User {
  id: string;
  username: string;
  email: string;
}

export interface GamePlayer extends User {
  symbol: 'X' | 'O';
}

export interface Room {
  id: string;
  name: string;
  master: User;
  guest?: User;  // Guest player (nullable)
  createdAt: string;
}

export interface CreateRoomResponse {
  createRoom: {
    room: Room;
  };
}

export interface CreateRoomInput {
  name: string;
}
