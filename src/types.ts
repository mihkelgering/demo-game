export interface GameState {
    timeRemaining: number;
    skipTime: number;
    levels: number[];
    finished: boolean;
}

export interface GameResponse {
    error?: string;
    game?: Game;
}

export interface Game {
    id: number
    idCode: string
    idToken: string
    game: string
    startTime: Date
}
