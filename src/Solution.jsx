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

const genPath = (data, size, start, end) => {
    let grid = [...Array(size[0])].map((item) => Array(size[1]))
    let directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
    ]
    let path = []
    let dfs = (x, y, data) => {
        if (end[0] == x && end[1] == y) {
            return true
        }
        path.push([x, y])
        let nRem = []
        for (let i = 1; i <= 25; i += 1) {
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
                        continue
                    }
                    movePaths[i].push([dx, dy])
                }
            }
        }
        for (let i of nRem) {
            data[i] -= 1
            for (let [a, b] of movePaths[i]) {
                grid[x][y] = i
                if (dfs(a, b, JSON.parse(JSON.stringify(data)))) return true
                grid[x][y] = null
            }
            data[i] += 1
        }
        path.pop()
        return false

    }
    if (dfs(start[0], start[1], data)) {
        console.log(path)
        return grid
    }
    return null
}

const genPuzzle = (data) => {


}
let data = {
    0: 1,
    1: 10,
    2: 6,
    3: 8,
    4: 11
}
let size = [6, 6]
let start = [0, 0]
let end = [5, 5]
// genPuzzle(data)
console.log(genPath(data, size, start, end))
export { getSolution }