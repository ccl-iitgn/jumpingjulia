import React, { Fragment, useEffect, useState } from "react";
import "./GenPuzzle.css"
import { genPuzzle } from './Solution'
import { GetGamesLength } from "./GetLocalGames"
import Download from "./Download"
import { MdCancel } from "react-icons/md";

import { FaInfoCircle } from "react-icons/fa";
import { colors } from "./Colors"
export default function GenPuzzle() {
    const [formData, setFormData] = useState({ 0: 1 })
    const [remaining, setRemaining] = useState(35)
    const [noSolution, setNoSolution] = useState(false)
    const [prevgame, setPrevgame] = useState(false)
    const [solutionLen, setSolutionLen] = useState([0, 0])
    const [downloadOpen, setDownloadOpen] = useState(false)
    const [maxSol, setMaxSol] = useState(1)
    let screenWidth = window.innerWidth
    const [size, setSize] = useState([6, 6])
    const [loading, setLoading] = useState(false)
    const [currData, setCurrData] = useState([])
    const [games, setGames] = useState(null)
    const [open, setOpen] = useState(false)

    const GenerateButtonHandler = async () => {
        if (remaining != 0) {
            alert("The remaining value must be zero.")
            return
        }
        if (solutionLen[1] < solutionLen[0]) {
            alert("Minimum should be less than maximum.")
            return
        }
        if (solutionLen[1] - solutionLen[0] > 10) {
            alert("The difference between max and min must be 10 or less.")
            return
        }
        if (maxSol > 50 || maxSol < 1) {
            alert("Allowed range for puzzle generation is 1 to 50.")
            return
        }
        setLoading(true)
        await new Promise(r => setTimeout(r, 1000))
        let tempgames = genPuzzle(JSON.parse(JSON.stringify(formData)), size, solutionLen[0], solutionLen[1], maxSol)

        if (tempgames && tempgames.length > 0) {
            setGames(tempgames)
        } else {
            setNoSolution(true)
        }
        setLoading(false)
    }
    useEffect(() => {
        let rem = size[0] * size[1]
        for (let i = 0; i < 10; i += 1) {
            if (formData[i]) {
                rem -= formData[i]
            }
        }
        if (rem < 0 || size[0] < 3 || size[1] < 3) {
            setFormData({ 0: 1 })
            setRemaining(size[0] * size[1] - 1)
        } else {
            setRemaining(rem)
        }
    }, [size])

    useEffect(() => {
        let tempGame = JSON.parse(localStorage.getItem("game") || "{}")
        if (tempGame && tempGame.solution) {
            setPrevgame(true)
        }
    }, [])
    return (
        <Fragment>
            <Download heading={"Self Created Puzzles"} setOpen={setDownloadOpen} open={downloadOpen} games={games} />
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
                                <li><strong>Minimum & Maximum Path Length:</strong> Define the desired solution length range (difference must be less than 10).</li>
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
            {noSolution && <div className='jumping-julia-popup-main'>
                <div className='jumping-julia-popup-container'>
                    <div className='jumping-julia-popup-cancel'><span onClick={() => setNoSolution(false)}><MdCancel /></span></div>
                    <h2>No Solution Found</h2>
                    <p>No valid puzzle can be generated with the current set of tiles. Please update the tiles to generate a solution.</p>
                    <div className='jumping-julia-popup-body'>
                        <img src="/not_found.gif" alt="no-solution-img" />

                    </div>
                </div>
            </div>}
            <h1>Jumping Julia Puzzle</h1>
            <main className="gen-puzzle-main">
                <div className='jumping-julia-info'>
                    <div>
                        <button onClick={() => window.location.href = "/"}>Home</button>
                        <button onClick={() => window.location.href = "/maze/1"}>Play Default Games</button>
                        {GetGamesLength() > 0 && <button onClick={() => window.location.href = "/own/1"}>Play Generated Puzzles</button>}
                    </div>
                    <span onClick={() => setOpen(true)}><FaInfoCircle /></span>
                </div>

                <section className="gen-puzzle-size-n-len-section">
                    <h2>Generate Own Puzzles</h2>
                    <div className="gen-puzzle-size-conatiner">
                        <div>
                            <label htmlFor="rowsSize">Grid Rows </label>
                            <input type="number" placeholder="Max 8" id="rowsSize" value={size[0]}
                                onChange={(e) => {
                                    setSize(prev => {
                                        let n = parseInt(e.target.value)
                                        if (n > 8) return [8, prev[1]]
                                        return [n, prev[1]]
                                    })
                                }} />
                        </div>
                        <div>
                            <label htmlFor="colsSize">Grid Columns </label>
                            <input type="number" id="colsSize" placeholder="Max 8" value={size[1]} onChange={(e) => {
                                setSize(prev => {
                                    let n = parseInt(e.target.value)
                                    if (n > 8) return [prev[0], 8]
                                    return [prev[0], n]
                                })
                            }} />
                        </div>
                    </div>
                    <div className="gen-puzzle-len-conatiner">
                        <div>
                            <label htmlFor="minsolution">Minimum Path Length </label>
                            <input type="number" id="minsolution" value={solutionLen[0]} onChange={(e) => { setSolutionLen(prev => ([parseInt(e.target.value), prev[1]])) }} />
                        </div>
                        <div>
                            <label htmlFor="maxsolution">Maximum Path Length </label>
                            <input type="number" id="maxsolution" value={solutionLen[1]} onChange={(e) => { setSolutionLen(prev => ([prev[0], parseInt(e.target.value)])) }} />
                        </div>
                        <div>
                            <label htmlFor="maxsolution">Number of Puzzles to Generate </label>
                            <input type="number" id="maxsolution" value={maxSol} onChange={(e) => { setMaxSol(parseInt(e.target.value)) }} />
                        </div>
                    </div>
                </section>
                <section className="gen-puzzle-show-section">
                    <h3>Tiles Left to Assign: {remaining}</h3>
                    <div className="gen-puzzle-show-container">
                        {[...Array(10)].map((item, inx) => {
                            if (!formData[inx]) {
                                return
                            }
                            return (
                                <div key={inx} style={{ backgroundColor: colors[inx] }}>
                                    <span>{inx}({formData[inx]})</span>

                                </div>
                            )
                        })}

                    </div>
                </section>
                <section className="gen-puzzle-add-tile-section">

                    <div className="gen-puzzle-add-tile-container">
                        <div>
                            <label htmlFor="num_entry">	Jump Distance </label>
                            <input type="number" id="num_entry" value={currData.length == 2 && currData[0]} onChange={(e) => setCurrData(prev => {
                                if (prev) {
                                    return [parseInt(e.target.value), prev[1]]
                                }
                                return [parseInt(e.target.value), 0]
                            })} />
                        </div>
                        <div>
                            <label htmlFor="num_value">Count of Tiles with Value </label>
                            <input type="number" id="num_value" value={currData.length == 2 && currData[1]} onChange={(e) => setCurrData(prev => {
                                if (prev) {
                                    return [prev[0], parseInt(e.target.value)]
                                }
                                return [0, parseInt(e.target.value)]
                            })} />
                        </div>
                        <button onClick={() => {
                            let data = JSON.parse(JSON.stringify(currData))
                            setCurrData([])
                            if (!data || data.length != 2 || data[0] == 0 || data[1] == 0 || remaining - data[1] < 0) return
                            let tempformData = JSON.parse(JSON.stringify(formData))
                            if (tempformData[data[0]]) {
                                tempformData[data[0]] += data[1]
                            } else {
                                tempformData[data[0]] = data[1]
                            }
                            setFormData(tempformData)
                            setRemaining(remaining - data[1])
                        }}>ADD</button>
                    </div>
                </section>
                {remaining == 0 && !loading && <section className="gen-puzzle-generate-btn-section">
                    <button onClick={GenerateButtonHandler}>Generate Puzzle</button>
                </section>}

                {loading ? <img src="/loading.gif" alt="loading-gif" /> : games && games.length > 0 &&
                    <section className="gen-puzzle-generated-puzzle-solution-section">
                        <h2>Solutions Found:{games.length}</h2>
                        <div>
                            <button onClick={() => { setDownloadOpen(true) }}>Download</button>
                            <button onClick={() => {
                                localStorage.setItem("games", JSON.stringify(games))
                                window.location.href = "/own/1"
                            }}>Save</button>
                        </div>
                        <div>
                            {games.map((game, inx) => {
                                return (
                                    <Fragment>
                                        <h2>Puzzle {inx + 1}</h2>
                                        <div className='game-grid-container' key={inx} style={{
                                            gridTemplateRows: `repeat(${game.size[0]}, ${screenWidth < 600 ? 50 : 100}px)`,
                                            gridTemplateColumns: `repeat(${game.size[1]}, ${screenWidth < 600 ? 50 : 100}px)`,
                                        }}>
                                            {game.grid.map((rows, inx) => {
                                                return rows.map((item, ind) => {
                                                    let n = game.solution.indexOf(`${[inx, ind]}`)
                                                    return (
                                                        <div key={ind - inx} className={n != -1 ? "maze-solution-path" : ""} style={{ backgroundColor: inx == game.start[0] && ind == game.start[1] ? "red" : inx == game.end[0] && ind == game.end[1] ? "green" : colors[item] }}>
                                                            {0 == inx && 0 == ind && <img className='game-curr-posion-frog' src="/frog.png" alt="current-position-indicator-frog" />}
                                                            {n!=-1 && item}
                                                            {n != -1 && <span>{n + 1}</span>}
                                                        </div>
                                                    )
                                                })
                                            })}
                                        </div>
                                    </Fragment>
                                )
                            })}
                        </div>
                    </section>
                }
            </main>
        </Fragment>
    )
}