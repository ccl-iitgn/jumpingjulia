const getSolution = (game) => {
    let path = []
    let visited = new Set()
    let directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
    ]

    let dfs = (x, y) => {

        path.push([x, y]);
        if (x == game.end[0] && y == game.end[1]) {
            return true
        }

        visited.add(`${x},${y}`);

        let n = game.grid[x][y]

        for (let [dx, dy] of directions) {
            let newX = x + dx * n
            let newY = y + dy * n

            if (newX >= 0 && newX < game.size[0] &&
                newY >= 0 && newY < game.size[1] &&
                !visited.has(`${newX},${newY}`)) {

                if (dfs(newX, newY)) return true
            }
        }

        path.pop()
        visited.delete(`${x},${y}`)
        return false
    }

    if (dfs(game.start[0], game.start[1])) {
        return path
    }
    return []
}
const genPuzzle = (data, size, min, max, n) => {
    const [rows, cols] = size;
    const start = [0, 0];
    const end = [rows - 1, cols - 1];
    const grid = Array(rows).fill().map(() => Array(cols).fill(null));
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const visited = Array(rows).fill().map(() => Array(cols).fill(false));
    const solution = [];
    let games = [];
    const maxGridSize = Math.max(rows, cols);

    const getNextPos = (x, y) => {
        const nextY = y + 1;
        return nextY < cols ? [x, nextY] : [x + 1, 0];
    };

    const canPlaceNumber = (x, y, num, grid, visited) => {
        for (const [dx, dy] of directions) {
            const checkX = x + dx * num;
            const checkY = y + dy * num;
            if (checkX >= 0 && checkX < rows && checkY >= 0 && checkY < cols) {
                if (visited[checkX][checkY]) {
                    return false;
                }
            }
        }
        return true;
    };

    const fillGrid = (x, y, grid, availableData, visited) => {
        if (x === end[0] && y === end[1]) {
            return true;
        }
        if (grid[x][y] !== null && grid[x][y] !== -1) {
            const [nextX, nextY] = getNextPos(x, y);
            return fillGrid(nextX, nextY, grid, availableData, visited);
        }
        const availableNums = [];
        for (let i = 1; i <= 10; i++) {
            if (availableData[i] > 0 && canPlaceNumber(x, y, i, grid, visited)) {
                availableNums.push(i);
            }
        }

        for (const num of availableNums) {
            availableData[num]--;
            grid[x][y] = num;

            const [nextX, nextY] = getNextPos(x, y);
            if (fillGrid(nextX, nextY, grid, availableData, visited)) {
                return true;
            }

            grid[x][y] = null;
            availableData[num]++;
        }

        return false;
    };

    const get_final_grid = (grid, visited, solution) => {
        const remainingData = { ...data };
        for (let x = 0; x < rows; x++) {
            for (let y = 0; y < cols; y++) {
                const cellValue = grid[x][y];
                if (cellValue && cellValue > 0 && remainingData[cellValue]) {
                    remainingData[cellValue]--;
                }
            }
        }
        const gridCopy = grid.map(row => [...row]);
        if (fillGrid(0, 0, gridCopy, remainingData, visited)) {
            gridCopy[end[0]][end[1]] = 0;
            return {
                size,
                grid: gridCopy,
                start,
                end,
                solution: [...solution] 
            }
        }
        return null;
    };

    const dfs = (x, y, availableData, currentGrid) => {
        if (solution.length > max) return;
        if (games.length >= n) return;
        const visitedCells = solution.length + 1; 
        const remainingCells = rows * cols - visitedCells;
        if (solution.length + remainingCells < min) {
            return; 
        }

        const coordKey = `${x},${y}`;
        visited[x][y] = true; 
        solution.push(coordKey);

        if (x === end[0] && y === end[1]) {
            if (solution.length >= min && solution.length <= max) {
                let final_game = get_final_grid(currentGrid, visited, solution);
                if (final_game) {
                    games.push(final_game);
                }
            }
            visited[x][y] = false;
            solution.pop();
            return;
        }

        const availableNums = [];
        for (let i = 1; i <= Math.min(10, maxGridSize); i++) {
            if (availableData[i] > 0) {
                availableNums.push(i);
            }
        }

        const validMoves = new Map();
        for (const num of availableNums) {
            const moves = [];
            let hasBlockedPath = false;

            for (const [dx, dy] of directions) {
                const newX = x + dx * num;
                const newY = y + dy * num;

                if (newX >= 0 && newX < rows && newY >= 0 && newY < cols) {
                    if (currentGrid[newX][newY] !== null || visited[newX][newY]) {
                        hasBlockedPath = true;
                        break;
                    }
                    moves.push([newX, newY]);
                }
            }

            if (!hasBlockedPath && moves.length > 0) {
                validMoves.set(num, moves);
            }
        }

        for (const [num, moves] of validMoves) {
            availableData[num]--;

            for (const [newX, newY] of moves) {
                const modified = [];
                
                currentGrid[x][y] = num;
                modified.push([x, y, null]); 
                for (const [dx, dy] of directions) {
                    const blockX = x + dx * num;
                    const blockY = y + dy * num;
                    if (blockX >= 0 && blockX < rows && blockY >= 0 && blockY < cols) {
                        if (currentGrid[blockX][blockY] === null && !visited[blockX][blockY]) {
                            const originalValue = currentGrid[blockX][blockY];
                            currentGrid[blockX][blockY] = -1;
                            modified.push([blockX, blockY, originalValue]);
                        }
                    }
                }
                dfs(newX, newY, availableData, currentGrid);
                for (const [mx, my, originalValue] of modified) {
                    currentGrid[mx][my] = originalValue;
                }
            }

            availableData[num]++;
        }

        visited[x][y] = false; 
        solution.pop();
    };

    const initialData = { ...data };
    dfs(start[0], start[1], initialData, grid);
    return games;
};


// let tempData = { 0: 1, 1: 9, 2: 11, 3: 8, 4: 7 }
// console.log(genPuzzle(tempData, [6, 6], 12, 14, 5).length)

export { getSolution, genPuzzle }