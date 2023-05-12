export default class Level {
  grid: Tile[][];
  height: number; 
  width: number;

  constructor(levelString: string) {
    let level: Level;
    this.grid = levelString
      .split("\n")
      .map((row, i) =>
        row
          .trim()
          .split("")
          .map((value, j) => ( { value: (value === 'c' || value === 'p') ? 'w' : value, column: i, row: j }))
      );
    level.width = this.grid[0].length;
    level.height = this.grid.length;

    return level;
  }
}