import type Level from "./level";
import Player from "./player";

export default class State {
    level: Level;
    player: Player;
    crates: Tile[];
    hasWon: boolean;

    constructor(level: Level) {
        let playerTile = level.grid.flat().find((value ) => value === "p");
        this.player = new Player(playerTile.column, playerTile.row);
        this.crates = level.grid.flat().filter(({ value }) => value === "c");
        this.hasWon = false;
    }

    isWall(position: Position) {
        return this.level.grid[position.row][position.column].value === "w";
    }

    isCrate(position: Position) {
        return this.level.g[position.row][position.column].value === "c";
    }


}
