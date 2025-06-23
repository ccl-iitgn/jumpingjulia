import { Fragment } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Game from "./Game";
import GenPuzzle from "./GenPuzzle";
import './App.css'
export default function App() {
  return (
    <Fragment>
      <Router>
        <Routes>
          <Route path="/gen" element={<GenPuzzle />} />
          <Route path="/maze/:level" element={<Game />} />
        </Routes>
      </Router>
    </Fragment>
  )
}