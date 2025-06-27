let Games = [
    {
        size: [4, 4],
        grid: [
            [1, 2, 1, 2],
            [3, 3, 3, 2],
            [3, 1, 2, 2],
            [1, 1, 2, 0]
        ],
        start: [0, 0],
        end: [3, 3]
    },
    {
        size: [5, 5],
        grid: [
            [1, 2, 1, 2, 1],
            [3, 2, 1, 2, 3],
            [3, 1, 1, 2, 3],
            [4, 2, 3, 2, 3],
            [1, 4, 3, 4, 0]
        ],
        start: [0, 0],
        end: [4, 4]
    },
    {
        size: [5, 5],
        grid: [
            [2, 3, 1, 1, 2],
            [4, 2, 1, 2, 2],
            [3, 3, 3, 2, 3],
            [2, 4, 1, 4, 1],
            [1, 4, 3, 3, 0]
        ],
        start: [0, 0],
        end: [4, 4]
    },
    {
        size: [6, 6],
        grid: [
            [1, 2, 3, 4, 3, 1],
            [2, 3, 5, 4, 2, 4],
            [3, 3, 4, 1, 2, 4],
            [1, 2, 1, 4, 2, 1],
            [5, 2, 2, 4, 3, 2],
            [1, 3, 5, 1, 3, 0]
        ],
        start: [0, 0],
        end: [5, 5]
    },
    {
        size: [6, 6],
        grid: [
            [1, 2, 3, 2, 2, 3],
            [2, 2, 3, 4, 3, 1],
            [4, 2, 2, 2, 2, 2],
            [1, 1, 1, 1, 1, 3],
            [2, 4, 4, 4, 4, 4],
            [1, 3, 3, 3, 2, 0]
        ],
        start: [0, 0],
        end: [5, 5]
    }
]

const GetGame = (level) => {
    if (level < 1) {
        return Games[0]
    }
    if (level >= Games.length) {
        return Games[Games.length - 1]
    }
    return Games[level - 1]
}
const GetGamesLength = () => {
    return Games.length
}

export { GetGame, GetGamesLength }