import { useState, useEffect, Fragment } from 'react'
import { GetGame, GetGamesLength } from "./GetLocalGames"
import { useParams } from "react-router-dom"
import { getSolution } from "./Solution"
import { MdCancel } from "react-icons/md";
import Download from "./Download"
import { FaInfoCircle } from "react-icons/fa";
import { colors } from "./Colors"
function Game() {
    const [game, setGame] = useState(null)
    const screenWidth = window.innerWidth
    let params = useParams()
    const [level, setLevel] = useState(parseInt(params.level))
    const [solution, setSolution] = useState([])
    const [tLevels, setTLevels] = useState(GetGamesLength())
    const [open, setOpen] = useState(false)
    const [curr, setCurr] = useState([0, 0])
    const [openSolution, setOpenSolution] = useState(false)
    const [solved, setSolved] = useState(false)
    const [positionMoves, setPositionMoves] = useState([])
    const [prevMoves, setPreviousMoves] = useState([[0, 0]])
    const [downloadOpen, setDownloadOpen] = useState(false)
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
            window.location.href = `/own/1`
        }
        if (level > tLevels) {
            window.location.href = `/own/${tLevels}`
        }
        setGame(GetGame(level))
        setCurr([0, 0])
    }, [level])
    useEffect(() => {
        if (tLevels == 0) {
            window.location.href = `/gen`
        }
    }, [tLevels])
    return (
        <Fragment>
            <Download heading={`Juming Julia Puzzle level-${level}`} open={downloadOpen} setOpen={setDownloadOpen} games={[game]} />
            {open &&
                <div className='jumping-julia-popup-main'>
                    <div className='jumping-julia-popup-container'>
                        <div className='jumping-julia-popup-cancel'><span onClick={() => setOpen(false)}><MdCancel /></span></div>
                        <div className="about-game">
                            <h2>About the Game — <em>Jumping Julia</em></h2>
                            <p><strong>Jumping Julia</strong> is a fun and challenging puzzle game where you help the frog leap through a maze to reach her destination!</p>
                            <ul>
                                <li>🟦 <strong>Start</strong> at the blue-colored cell and aim to reach the 🟩 <strong>green</strong> end cell.</li>
                                <li>Each cell contains a number <strong><code>n</code></strong> — it tells you how many steps you can <strong>jump in any direction</strong> (up, down, left, or right).</li>
                                <li>All valid jump positions from your current cell are highlighted with a <strong>violet gradient</strong>.</li>
                                <li>Julia's current position is shown with a cute <strong>frog image</strong>.</li>
                                <li>If Julia lands on a cell and has <strong>no valid moves</strong>, it will turn <strong style={{ color: "red" }}>red</strong>, indicating a dead end.</li>
                                <li><strong>Use the Undo button</strong> to return to your previous position if you get stuck.</li>
                                <li>Use logic and planning to guide Julia safely to the goal!</li>
                            </ul>

                            <h2>Creating a New Puzzle</h2>
                            <p>Use the puzzle generator to create your own Jumping Julia challenges with custom settings:</p>
                            <ul>
                                <li><strong>Grid Rows and Columns:</strong> Set the size of the puzzle board.</li>
                                <li><strong>Minimum & Maximum Path Length:</strong> Define the desired solution length range (difference must be less than 25).</li>
                                <li><strong>Number of Puzzles to Generate:</strong> Choose how many puzzle variations you want to generate.</li>
                                <li><strong>Jump Distance (`n`) and Count:</strong>
                                    - Enter a jump value (e.g., 2, 3, etc.) and how many tiles should have that value.<br />
                                    - Click <strong>Add</strong> to add tile into staging area.
                                </li>
                                <li>After assigning all tiles (when <strong>Tiles Left to Assign</strong> reaches 0), click <strong>Generate Puzzle(s)</strong> to create the puzzle.</li>
                            </ul>
                        </div>
                    </div>
                </div>}
            {solved && <div className='jumping-julia-popup-main'>
                <div className='jumping-julia-popup-container'>
                    <div className='jumping-julia-popup-cancel'><span onClick={() => setSolved(false)}><MdCancel /></span></div>
                    <h2>Congratulations</h2>
                    <p>You Just Solved the Puzzle.</p>
                    <div className='jumping-julia-popup-body'>
                        <img src="/Solved_animation.gif" alt="animation-img" />
                        <section className='jumping-julia-btns-section'>
                            {level > 1 && <button onClick={() => window.location.href = `/own/${level - 1}`}>Previous</button>}
                            <button onClick={() => window.location.href = `/own/${level}`}>Re Play</button>
                            {level < tLevels && <button onClick={() => window.location.href = `/own/${level + 1}`}>Next</button>}
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
            <h1>Jumping Julia Puzzle</h1>
            <main className='jumping-julia-main'>
                <div className='jumping-julia-info'>
                    <div>
                        <button onClick={() => window.location.href = "/"}>Home</button>
                        <button onClick={() => window.location.href = "/gen"}>Generate own Puzzle</button>
                        <button onClick={() => window.location.href = "/maze/1"}>Play Default Puzzles</button>
                    </div>
                    <span onClick={() => setOpen(true)}><FaInfoCircle /></span>
                </div>
                <h2>Self Generated Game - {level}</h2>
                <section className='jumping-julia-grid-section'>
                    {game && game.grid &&
                        <div className='game-grid-container' style={{
                            gridTemplateRows: `repeat(${game.size[0]}, ${screenWidth < 600 ? 50 : 100}px)`,
                            gridTemplateColumns: `repeat(${game.size[1]}, ${screenWidth < 600 ? 50 : 100}px)`,
                        }}>
                            {game.grid.map((rows, inx) => {
                                return rows.map((item, ind) => {
                                    return (
                                        <div key={ind - inx} className={positionMoves.includes(`${[inx, ind]}`) ? "jumpling-julia-moveable-path" : ""} onClick={() => handleClick(inx, ind)} style={positionMoves.includes(`${[inx, ind]}`) ? moveStyle : { backgroundColor: inx == game.start[0] && ind == game.start[1] ? "blue" : inx == game.end[0] && ind == game.end[1] ? "green" : positionMoves.length == 0 && curr[0] == inx && curr[1] == ind ? "red" : colors[item] }}>
                                            {curr[0] == inx && curr[1] == ind ? <img className='game-curr-posion-frog' src="/frog.png" alt="current-position-indicator-frog" /> : inx == game.end[0] && ind == game.end[1] && <img style={{ width: "100%", position: "absolute" }} src="/pond_img.png" alt="end-position-indicator-pond" />}
                                            <span style={curr[0] == inx && curr[1] == ind ? { transform: `translateY(${screenWidth > 600 ? 30 : 10}px)` } : {}}>{item}</span>
                                        </div>
                                    )
                                })
                            })}
                        </div>}
                </section>
                <section className='jumping-julia-btns-section'>
                    {level > 1 && <button onClick={() => window.location.href = `/own/${level - 1}`}>Previous</button>}
                    <button onClick={prevMoveHandler}>undo</button>
                    <button onClick={() => setDownloadOpen(true)}>Download</button>
                    <button onClick={SolutionHandler}>Solution</button>
                    <button onClick={() => window.location.href = `/own/${level}`}>Refresh</button>
                    {level < tLevels && <button onClick={() => window.location.href = `/own/${level + 1}`}>Next</button>}
                </section>
            </main>

        </Fragment>

    )
}

export default Game
