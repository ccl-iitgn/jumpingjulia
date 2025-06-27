let Games = JSON.parse(localStorage.getItem("games") || "[]")
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