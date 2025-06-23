import { useState, useEffect, Fragment } from 'react'
import { GetGame, GetGamesLength } from "./Getgame"
import { useParams } from "react-router-dom"
import { getSolution } from "./Solution"
import { MdCancel } from "react-icons/md";
let colors = {
    1: "#F8E8EE",
    2: "#FFEAC9",
    3: "#EAE7FF",
    4: "#E0E0E0",
}
function Game() {
    const [game, setGame] = useState(null)
    const screenWidth = window.innerWidth
    let params = useParams()
    const [level, setLevel] = useState(parseInt(params.level))
    const [solution, setSolution] = useState([])
    const [tLevels, setTLevels] = useState(GetGamesLength())
    const [curr, setCurr] = useState([0, 0])
    const [openSolution, setOpenSolution] = useState(false)
    const [solved, setSolved] = useState(false)
    const [positionMoves, setPositionMoves] = useState([])
    const [prevMoves, setPreviousMoves] = useState([[0, 0]])
    const moveStyle = {
        background: "linear-gradient(to bottom, #3e206d, #e3d4f5)",
        cursor: "pointer",
        color: "black"
    }
    const prevMoveHandler = () => {
        if ((curr[0] == 0 && curr[1] == 0) || prevMoves.length == 0) {
            setPreviousMoves([])
            return
        }
        setPreviousMoves(prev => {
            let tempData = JSON.parse(JSON.stringify(prev))
            let [x, y] = tempData.pop()
            setCurr([x, y])
            return tempData
        })
    }
    const handleClick = (x, y) => {
        if (positionMoves.includes(`${[x, y]}`)) {
            setPreviousMoves(prev => {
                return [...prev, curr]
            })
            setCurr([x, y])
        }
    }
    const SolutionHandler = () => {
        const tempSolution = getSolution(JSON.parse(JSON.stringify(game)))
        setSolution(tempSolution.map(item => `${item}`))
        setOpenSolution(true)
    }
    useEffect(() => {
        if (curr && game && game.grid) {
            let n = game.grid[curr[0]][curr[1]]
            if (n == 0) {
                setSolved(true)
                return
            }
            let directons = [
                [-1, 0],
                [1, 0],
                [0, -1],
                [0, 1]
            ]
            let tempMoves = []
            for (let [x, y] of directons) {
                let [dx, dy] = JSON.parse(JSON.stringify(curr))
                dx = dx + x * n
                dy = dy + y * n
                if (dx >= 0 && dx < game.size[0] && dy >= 0 && dy < game.size[1]) {
                    tempMoves.push(`${[dx, dy]}`)
                }
            }
            setPositionMoves(tempMoves)
        }
    }, [curr])
    useEffect(() => {
        if (!level) return
        if (level < 1) {
            window.location.href = `/maze/1`
        }
        if (level > tLevels) {
            window.location.href = `/maze/${tLevels}`
        }
        setGame(GetGame(level))
        setCurr([0, 0])
    }, [level])

    return (
        <Fragment>
            {solved && <div className='jumping-julia-popup-main'>
                <div className='jumping-julia-popup-container'>
                    <div className='jumping-julia-popup-cancel'><span onClick={() => setSolved(false)}><MdCancel /></span></div>
                    <h2>Congratulations</h2>
                    <p>You Just Solved the Puzzle.</p>
                    <div className='jumping-julia-popup-body'>
                        <img src="/Solved_animation.gif" alt="animation-img" />
                        <section className='jumping-julia-btns-section'>
                            {level > 1 && <button onClick={() => window.location.href = `/maze/${level - 1}`}>Previous</button>}
                            <button onClick={() => window.location.href = `/maze/${level}`}>Re Play</button>
                            {level < tLevels && <button onClick={() => window.location.href = `/maze/${level + 1}`}>Next</button>}
                        </section>
                    </div>
                </div>
            </div>}
            {openSolution && solution.length > 0 &&
                <div className='jumping-julia-popup-main'>
                    <div className='jumping-julia-popup-container'>
                        <div className='jumping-julia-popup-cancel'><span onClick={() => setOpenSolution(false)}><MdCancel /></span></div>
                        <h2>Solution</h2>
                        <p>It has {solution.length} steps to reach the destination.</p>
                        <div className='game-grid-container jumping-julia-popup' style={{
                            gridTemplateRows: `repeat(${game.size[0]}, ${screenWidth < 600 ? 50 : 100}px)`,
                            gridTemplateColumns: `repeat(${game.size[1]}, ${screenWidth < 600 ? 50 : 100}px)`,
                        }}>
                            {game.grid.map((rows, inx) => {
                                return rows.map((item, ind) => {
                                    let n = solution.indexOf(`${[inx, ind]}`)
                                    return (
                                        <div key={ind - inx} className={n != -1 ? "maze-solution-path" : ""} style={{ backgroundColor: inx == game.start[0] && ind == game.start[1] ? "red" : inx == game.end[0] && ind == game.end[1] ? "green" : colors[item] }}>
                                            {0 == inx && 0 == ind && <img className='game-curr-posion-frog' src="/frog.png" alt="current-position-indicator-frog" />}
                                            {item}
                                            {n != -1 && <span>{n + 1}</span>}
                                        </div>
                                    )
                                })
                            })}
                        </div>
                    </div>
                </div>
            }
            <main className='jumping-julia-main'>
                <h1>Jumping Julia Puzzle</h1>
                <section className='jumping-julia-grid-section'>
                    {game && game.grid &&
                        <div className='game-grid-container' style={{
                            gridTemplateRows: `repeat(${game.size[0]}, ${screenWidth < 600 ? 50 : 100}px)`,
                            gridTemplateColumns: `repeat(${game.size[1]}, ${screenWidth < 600 ? 50 : 100}px)`,
                        }}>
                            {game.grid.map((rows, inx) => {
                                return rows.map((item, ind) => {
                                    return (
                                        <div key={ind - inx} className={positionMoves.includes(`${[inx, ind]}`) ? "jumpling-julia-moveable-path" : ""} onClick={() => handleClick(inx, ind)} style={positionMoves.includes(`${[inx, ind]}`) ? moveStyle : { backgroundColor: inx == game.start[0] && ind == game.start[1] ? "blue" : inx == game.end[0] && ind == game.end[1] ? "green" : positionMoves.length==0&& curr[0] == inx && curr[1] == ind ? "red" : colors[item] }}>
                                            {curr[0] == inx && curr[1] == ind && <img className='game-curr-posion-frog' src="/frog.png" alt="current-position-indicator-frog" />}
                                            <span style={curr[0] == inx && curr[1] == ind ? { transform: `translateY(${screenWidth > 600 ? 30 : 10}px)` } : {}}>{item}</span>
                                        </div>
                                    )
                                })
                            })}
                        </div>}
                </section>
                <section className='jumping-julia-btns-section'>
                    {level > 1 && <button onClick={() => window.location.href = `/maze/${level - 1}`}>Previous</button>}
                    <button onClick={prevMoveHandler}>undo</button>
                    <button onClick={SolutionHandler}>Solution</button>
                    <button onClick={() => window.location.href = `/maze/${level}`}>Refresh</button>
                    {level < tLevels && <button onClick={() => window.location.href = `/maze/${level + 1}`}>Next</button>}
                </section>
            </main>

        </Fragment>

    )
}

export default Game
