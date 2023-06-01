export interface GameState {
  timeRemaining: number;
  skipTime: number;
  levels: number[];
  finished: boolean;
}

export interface GameResponse {
  error?: string;
  game?: GameState;
}
