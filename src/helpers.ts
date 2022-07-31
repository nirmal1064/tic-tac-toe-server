import { BG_COLOR } from "./constants";

export const getRandomColour = (): string => {
  const randomIndex = Math.floor(Math.random() * BG_COLOR.length);
  return BG_COLOR[randomIndex];
};
