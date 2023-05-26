export interface GameState {
    set(arg0: { timeRemaining: number; levels: number[]; }): unknown;
    timeRemaining: number;
    levels: number[];
}

export interface GameResponse {
    error?: string;
    game?: GameState;
    idToken?: string;
}
