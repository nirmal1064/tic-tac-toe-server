import { UserType } from "./types";

export const MAX_USERS_PER_ROOM = 2;
export const CREATE_ROOM = "CREATE_ROOM";
export const ERR_MSG = "ERR_MSG";
export const ALPHA_NUMERIC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
export const START_GAME = "START_GAME";
export const MAKE_MOVE = "MAKE_MOVE";
export const MADE_MOVE = "MADE_MOVE";
export const BG_COLOR = ["#808000", "#E6E6FA", "#008080", "#E0B0FF", "#D2B48C"];
export const JOIN = "JOIN";
export const JOIN_SUCCESS = "JOIN_SUCCESS";
export const GAME_OVER = "GAME_OVER";
export const REMATCH = "REMATCH";
export const REMATCH_REQUEST = "REMATCH_REQUEST";
export const REMATCH_RESPONSE = "REMATCH_RESPONSE";
export const REMATCH_SUCCESS = "REMATCH_SUCCESS";
export const REMATCH_FAILURE = "REMATCH_FAILURE";

export const USER_DEFAULT_VALUE: UserType = {
  userId: "",
  userName: "",
  roomId: "",
  symbol: null,
  joined: false,
  started: false,
  turn: false
};
