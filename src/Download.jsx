import React, { Fragment, useRef, useEffect } from 'react'
import { MdCancel } from "react-icons/md";

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

let colors = {
    0: "#B3C7F7",
    1: "#F7D29C",
    2: "#CAB8F2",
    3: "#F2B8A2",
    4: "#A7D3F5",
    5: "#F6C3DC",
    6: "#D7BCE8",
    7: "#F2CB8E",
    8: "#B0A4E3",
    9: "#FFCF9F",
    10: "#C6D2FA",
    11: "#F7C4A5",
    12: "#C9B4ED",
    13: "#FAD6A5",
    14: "#BFD6F8",
    15: "#E5B9F0",
    16: "#D0B4E3",
    17: "#FBCFAA",
    18: "#AFC6F7",
    19: "#E3AEE3",
    20: "#F3BC8D",
    21: "#C9B0FA",
    22: "#F6BFA0",
    23: "#ADBCF9",
    24: "#E2A3DB",
    25: "#F2AE8D"
};

function MultiGameComponent({ games, heading, open, setOpen }) {
    const screenWidth = window.innerWidth
    const gameRefs = useRef([])
    useEffect(() => {
        if (games && games.length > 0) {
            gameRefs.current = games.map((_, i) => gameRefs.current[i] || React.createRef())
        }
    }, [games])

    const downloadPDF = async () => {
        try {
            if (!games || games.length === 0) {
                console.error('No games to download');
                return;
            }

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const marginTop = 30;

            for (let i = 0; i < games.length; i++) {
                if (i > 0) {
                    pdf.addPage();
                }
                pdf.setFontSize(16);
                pdf.text(games.length > 1 ? `${heading} - Game ${i + 1}` : `${heading}`, 10, 20);
                const canvas = await html2canvas(gameRefs.current[i].current, { scale: 2 });
                const imgData = canvas.toDataURL('image/png');
                const imgProps = pdf.getImageProperties(imgData);
                const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
                const maxHeight = pdfHeight - marginTop - 10;
                let finalWidth = pdfWidth;
                let finalHeight = imgHeight;

                if (imgHeight > maxHeight) {
                    finalHeight = maxHeight;
                    finalWidth = (imgProps.width * maxHeight) / imgProps.height;
                }

                pdf.addImage(imgData, 'PNG', 0, marginTop, finalWidth, finalHeight);
            }

            pdf.save(games.length > 1 ? `jumping_julia_games.pdf` : `jumping_julia_game.pdf`);
        } catch (error) {
            console.error('PDF download failed:', error);
        }
    };

    const handleClick = (gameIndex, rowIndex, colIndex) => {
        console.log(`Clicked on game ${gameIndex}, cell [${rowIndex}, ${colIndex}]`);
    };

    return (
        <Fragment>
            {open && <div className='jumping-julia-popup-main'>
                <div className='jumping-julia-popup-container download-main'>
                    <div className='jumping-julia-popup-cancel'>
                        <span onClick={() => setOpen(false)}><MdCancel /></span>
                    </div>
                    <h2>{heading}</h2>
                    <button className='download-maze-pdf-btn' onClick={() => downloadPDF()}>
                        {games.length > 1 ? "Download All Games as PDF" : "Download Game as PDF"}
                    </button>
                    <div className='jumping-julia-popup-body'>
                        {games && games.map((game, gameIndex) => (
                            <section key={gameIndex} className='jumping-julia-grid-section' style={{ marginBottom: '20px' }}>
                                <h3>Game {gameIndex + 1}</h3>
                                {game && game.grid &&
                                    <div
                                        className='game-grid-container download-grid-container'
                                        ref={gameRefs.current[gameIndex]}
                                        style={{
                                            gridTemplateRows: `repeat(${game.size[0]}, ${screenWidth < 600 ? 50 : 100}px)`,
                                            gridTemplateColumns: `repeat(${game.size[1]}, ${screenWidth < 600 ? 50 : 100}px)`,
                                        }}
                                    >
                                        {game.grid.map((rows, rowIndex) => {
                                            return rows.map((item, colIndex) => {
                                                return (
                                                    <div
                                                        key={`${gameIndex}-${rowIndex}-${colIndex}`}
                                                        onClick={() => handleClick(gameIndex, rowIndex, colIndex)}
                                                        style={{
                                                            backgroundColor: rowIndex === game.start[0] && colIndex === game.start[1] ? "blue" :
                                                                rowIndex === game.end[0] && colIndex === game.end[1] ? "green" :
                                                                    colors[item]
                                                        }}
                                                    >
                                                        <span className='download-span'>
                                                            {item}
                                                        </span>
                                                    </div>
                                                )
                                            })
                                        })}
                                    </div>
                                }
                            </section>
                        ))}
                    </div>

                </div>
            </div>}
        </Fragment>
    )
}

export default MultiGameComponent