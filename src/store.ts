import {type GameState} from "./types";
import {writable} from "svelte/store";

export const game = writable<GameState>(null);