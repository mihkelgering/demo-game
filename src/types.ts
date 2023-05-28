export interface GameState {
  timeRemaining: number;
  skipTime: number;
  levels: number[];
}

export interface GameResponse {
  error?: string;
  game?: GameState;
}
