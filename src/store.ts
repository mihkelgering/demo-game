import { type GameState } from "./types";
import { writable, type Writable } from "svelte/store";

export const game:Writable<GameState> = writable(null);