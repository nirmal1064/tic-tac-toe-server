import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app";
import {
  ERR_MSG,
  GAME_OVER,
  JOIN,
  JOIN_SUCCESS,
  MADE_MOVE,
  MAKE_MOVE,
  MAX_USERS_PER_ROOM,
  REMATCH,
  REMATCH_FAILURE,
  REMATCH_REQUEST,
  REMATCH_RESPONSE,
  REMATCH_SUCCESS,
  START_GAME
} from "./constants";
import { checkWinner, getRandomColour } from "./helpers";
import {
  JoinRoomSuccessType,
  JoinRoomType,
  MakeMoveType,
  RematchResponseType,
  RematchType,
  RoomType
} from "./types";

const rooms = new Map<string, RoomType>();

const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const startGame = async (room: RoomType, currentIo: Server) => {
  const { users } = room;
  users.forEach((user) => {
    if (user.symbol === "X") {
      room.currentUser = user.userId;
    }
  });
  currentIo.emit(START_GAME, room);
};

const handleMakeMove = (data: MakeMoveType) => {
  const { userId, idx, roomId } = data;
  const room = rooms.get(roomId);
  if (!room) return;
  const { users, board, currentUser, winner } = room;
  if (winner) return;
  if (currentUser !== userId) return;
  if (board[idx] !== null) return;
  board[idx] = data.symbol;
  room.count += 1;
  users.forEach((user) => {
    if (user.symbol !== data.symbol) {
      room.currentUser = user.userId;
    }
  });
  io.to(roomId).emit(MADE_MOVE, room);
  const winnerSymbol = checkWinner(board);
  if (winnerSymbol) {
    room.winner = winnerSymbol;
    io.to(roomId).emit(GAME_OVER, { winner: winnerSymbol, draw: false });
  }
  if (room.count === 9) {
    io.to(roomId).emit(GAME_OVER, { winner: null, draw: true });
  }
};

io.on("connection", (socket) => {
  console.log(`User connected with id ${socket.id}`);

  socket.on(JOIN, async (data: JoinRoomType) => {
    const { roomId } = data;
    let room = rooms.get(roomId);
    let symbol: "X" | "O";
    if (!room) {
      symbol = "X";
      room = {
        roomId,
        users: [{ userId: data.userId, symbol }],
        currentUser: null,
        winner: null,
        board: Array(9).fill(null),
        count: 0,
        bgColor: getRandomColour()
      };
      rooms.set(roomId, room);
    } else {
      if (room.users.length >= MAX_USERS_PER_ROOM) {
        socket.emit(ERR_MSG, "Room is full");
        return;
      }
      symbol = "O";
      room.users.push({ userId: data.userId, symbol });
    }
    socket.join(roomId);
    const result: JoinRoomSuccessType = {
      roomId,
      symbol,
      bgColor: room.bgColor,
      joined: true
    };
    socket.emit(JOIN_SUCCESS, result);
    if (room.users.length === MAX_USERS_PER_ROOM) {
      startGame(room, io);
    }
  });

  socket.on(MAKE_MOVE, handleMakeMove);

  socket.on(REMATCH, (data: RematchType) => {
    const room = rooms.get(data.roomId);
    if (!room) return;
    socket.broadcast.to(room.roomId).emit(REMATCH_REQUEST, "");
  });

  socket.on(REMATCH_RESPONSE, (data: RematchResponseType) => {
    const { roomId } = data;
    if (data.rematch) {
      const room = rooms.get(roomId);
      if (!room) return;
      const { users } = room;
      room.board = Array(9).fill(null);
      room.count = 0;
      users.forEach((user) => {
        if (
          user.symbol === room.winner ||
          (room.winner === null && user.symbol === "O")
        ) {
          room.currentUser = user.userId;
          user.symbol = "X";
        } else {
          user.symbol = "O";
        }
      });
      room.winner = null;
      room.bgColor = getRandomColour();
      io.to(room.roomId).emit(REMATCH_SUCCESS, room);
    } else {
      rooms.delete(roomId);
      io.to(data.roomId).emit(REMATCH_FAILURE, "Opponent declined rematch");
    }
  });
});

export default server;
