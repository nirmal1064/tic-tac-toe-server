export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}

export type JoinRoomType = { roomId: string; userId: string };

export type JoinRoomSuccessType = {
  roomId: string;
  joined: boolean;
  symbol: "X" | "O";
  bgColor: string;
};

export type RoomUserType = { userId: string; symbol: "X" | "O" };

export type RoomType = {
  roomId: string;
  users: RoomUserType[];
  currentUser: string | null;
  winner: string | null;
  board: Array<"X" | "O" | null>;
  count: number;
  bgColor: string;
};

export type UserType = {
  userId: string;
  userName: string;
  roomId: string;
  symbol: "X" | "O" | null;
  joined: boolean;
  started: boolean;
  turn: boolean;
};

export type MakeMoveType = {
  userId: string;
  roomId: string;
  idx: number;
  symbol: "X" | "O";
};

export type GameOverType = {
  winner: string | null;
  draw: boolean;
};

export type RematchType = { roomId: string };

export type RematchResponseType = { roomId: string; rematch: boolean };
