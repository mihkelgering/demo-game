export interface GameState {
    timeRemaining: number;
    levels: number[];
}

export interface GameResponse {
    error?: string;
    game?: GameState;
}


