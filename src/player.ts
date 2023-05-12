import { getVec, Direction } from "./direction";

class Position {
    column: number;
    row: number;

    constructor(column: number, row: number) {
        this.column = column;
        this.row = row;
    }
}

class Player {
    position: Position;

    constructor(column: number, row: number) {
        this.position = { column, row };
    }

    getNewPosition(dir: Direction) {
        let vec = getVec(dir);
        let column = this.position.column + vec[0];
        let row = this.position.row + vec[1];

        return new Position(column, row);
    }

}

export default Player;