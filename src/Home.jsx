import { Fragment } from "react"
import "./Home.css"
export default function Home() {
    return (
        <Fragment>
            <h1>Jumping julia Puzzle</h1>
            <main className="home-page-main">
                <img src="/home-img.png" alt="home-page-img" />
                <div>
                    <button onClick={()=>window.location.href="/maze/1"}>Play Now</button>
                    <button onClick={()=>window.location.href="/own/1"}>Play Own Puzzles</button>
                    <button onClick={()=>window.location.href="/gen"}>Generate Own Puzzles</button>
                </div>
            </main>
        </Fragment>
    )
}