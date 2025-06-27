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

const genPath = (data, size, start, end, min, max) => {
    let grid = [...Array(size[0])].map((item) => Array(size[1]))
    let directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
    ]
    let path = new Set()
    let solution = []
    let solutions = []
    let dfs = (x, y, data, grid) => {
        if(solution.length > max){
            return
        }
        path.add(`${[x, y]}`)
        solution.push(`${[x, y]}`)
        if (end[0] == x && end[1] == y) {
            if (solution.length >= min && solution.length <= max) {
                solutions.push({
                    path: new Set([...path]),
                    grid: grid,
                    solution: JSON.parse(JSON.stringify(solution))
                })
            }
            path.delete(`${[x, y]}`)
            solution.pop()
            return
        }
        let nRem = []
        for (let i = 1; i <= 10; i += 1) {
            let n = data[i]
            if (n && n > 0) {
                nRem.push(i)
            }
        }
        let movePaths = {}

        for (let i of nRem) {
            movePaths[i] = []
            for (let [a, b] of directions) {
                let dx = x + a * i
                let dy = y + b * i
                if (dx >= 0 && dx < size[0] && dy >= 0 && dy < size[1]) {

                    if (grid[dx][dy]) {

                        movePaths[i] = []
                        break
                    } else {
                        movePaths[i].push([dx, dy])
                    }

                }
            }
        }

        for (let i of nRem) {
            data[i] -= 1
            let tempData = JSON.parse(JSON.stringify(data))
            for (let [a, b] of movePaths[i]) {
                let tempGrid = JSON.parse(JSON.stringify(grid))
                tempGrid[x][y] = i
                for (let [c, d] of directions) {
                    let dx = x + c * i
                    let dy = y + d * i
                    if (dx >= 0 && dx < size[0] && dy >= 0 && dy < size[1]) {
                        tempGrid[dx][dy] = -1
                    }
                }
                dfs(a, b, tempData, tempGrid)
            }
            data[i] += 1
        }
        path.delete(`${[x, y]}`)
        solution.pop()
        return
    }
    dfs(start[0], start[1], JSON.parse(JSON.stringify(data)), JSON.parse(JSON.stringify(grid)))
    return solutions
}

const genPuzzle = (data, size, min, max, n) => {
    let start = [0, 0]
    let end = [size[0] - 1, size[1] - 1]
    let directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
    ]

    let getNextnums = (x, y) => {
        let dy = y + 1
        if (dy < size[1]) {
            return [x, dy]
        }
        return [x + 1, 0]
    }
    let dfs = (x, y, grid, data, path) => {
        if (x == end[0] && y == end[1]) {
            return true
        }
        if (grid[x][y] && grid[x][y] != -1) {
            let [a, b] = getNextnums(x, y)
            if (dfs(a, b, grid, data, path)) return true
            return false
        }
        let nRem = []
        for (let i = 1; i <= 10; i += 1) {
            let n = data[i]
            if (n && n > 0) {
                nRem.push(i)
            }
        }
        let movePaths = {}
        for (let i of nRem) {
            movePaths[i] = true
            for (let [a, b] of directions) {
                let dx = x + a * i
                let dy = y + b * i
                if (dx >= 0 && dx < size[0] && dy >= 0 && dy < size[1]) {
                    if (path.has(`${[dx, dy]}`)) {
                        movePaths[i] = false
                        break
                    }
                }
            }
        }
        for (let i of nRem) {
            if (movePaths[i]) {
                data[i] -= 1
                grid[x][y] = i
                let [a, b] = getNextnums(x, y)
                if (dfs(a, b, grid, data, path)) return true
                grid[x][y] = null
                data[i] += 1
            }
        }
        return false
    }
    let returnValue = genPath(JSON.parse(JSON.stringify(data)), size, start, end, min, max)
    console.log(`Paths Generated ${returnValue.length}`)
    if (!returnValue || returnValue.length == 0) {
        return []
    }
    let games = []
    for (let pathData of returnValue) {
        let { grid, path, solution } = pathData
        let tempData = JSON.parse(JSON.stringify(data))
        for (let row of grid) {
            for (let item of row) {
                if (tempData[item]) {
                    tempData[item] -= 1
                }
            }
        }
        if (dfs(0, 0, grid, tempData, path)) {
            grid[end[0]][end[1]] = 0
            games.push({
                size,
                grid,
                start,
                end,
                solution
            })
            if (games.length >= n) {
                return games
            }
        }
    }

    return games
}

// let tempData = { 0: 1, 1: 9, 2: 11, 3: 8, 4: 7 }
// console.log(genPuzzle(tempData, [6, 6], 12, 14, 5).length)

export { getSolution, genPuzzle }