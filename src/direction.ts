enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT
}

const getVec = (direction: Direction) => {
    if (direction === Direction.UP) [0, -1]
    if (direction === Direction.DOWN) [0, 1]
    if (direction === Direction.LEFT) [-1, 0]
    if (direction === Direction.RIGHT) [1, 0]
}

export { getVec, Direction }  
