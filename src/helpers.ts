import { BG_COLOR } from "./constants";

export const getRandomColour = (): string => {
  const randomIndex = Math.floor(Math.random() * BG_COLOR.length);
  return BG_COLOR[randomIndex];
};

export const checkWinner = (board: Array<"X" | "O" | null>): string | null => {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i of winningCombinations) {
    const [a, b, c] = i;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};
