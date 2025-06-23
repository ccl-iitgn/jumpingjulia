let Games = [
    {
        size: [6, 6],
        grid: [
            [2, 4, 3, 1, 3, 4],
            [2, 4, 1, 3, 1, 2],
            [3, 4, 4, 3, 2, 1],
            [4, 4, 4, 4, 3, 3],
            [1, 2, 1, 3, 2, 4],
            [1, 1, 4, 1, 1, 0]
        ],
        start: [0, 0],
        end: [5, 5]
    },
    {
        size: [6, 6],
        grid: [
            [2, 4, 3, 1, 3, 4],
            [2, 4, 1, 3, 1, 2],
            [3, 4, 4, 3, 2, 1],
            [4, 4, 4, 4, 3, 3],
            [1, 2, 1, 3, 2, 4],
            [1, 1, 4, 1, 1, 0]
        ],
        start: [0, 0],
        end: [5, 5]
    },
    {
        size: [6, 6],
        grid: [
            [2, 4, 3, 1, 3, 4],
            [2, 4, 1, 3, 1, 2],
            [3, 4, 4, 3, 2, 1],
            [4, 4, 4, 4, 3, 3],
            [1, 2, 1, 3, 2, 4],
            [1, 1, 4, 1, 1, 0]
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