import React from 'react';
import Cell from '../Cell/Cell';


class Grid extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            cells: this.getBlankGrid(25, 25),
            gen: 0,
            running: false,
            intervalId: null
        }
    }

    getBlankGrid = (height, width) => {
        let cells = [];

        for (var row=0; row < height; row++) {
            let curr_row = [];
            for (var col=0; col < width; col++) {
                var curr_cell = {
                    alive: false,
                    row: row,
                    col: col,
                    counter: 0
                }
                curr_row.push(curr_cell);
            }
            cells.push(curr_row);
        }

        return cells;
    }

    clearGrid = () => {
        this.setState({
            cells: this.getBlankGrid(25, 25),
            gen: 0
        })
    }

    printGrid = () => {
        let height = this.state.cells.length
        for (var i=0; i<height; i++) {
            console.log(this.state.cells[i])
        }
    }

    changeCell = (newAliveState, row, col) => {
        console.log("changing...")
        let newCells = this.state.cells;
        this.state.cells[row][col].alive = newAliveState;
        this.forceUpdate()
    }

    startGame = () => {
        console.log("Starting game")
        this.setState({
                running: true
            },
            this.gameLoop
        )
        console.log("end of start game")
    }

    stopGame = () => {
        console.log("stoping game")
        clearInterval(this.state.intervalId)
        this.setState({
            intervalId: null,
            running: false
        })
    }

    gameLoop = () => {
        var intervalId = setInterval(this.getNewGen, 1000)
        this.setState({
            intervalId: intervalId
        })
    }

    nextGen = () => {
        this.getNewGen()
    }

    getNewGen = () => {
        let newCells = this.getNewCells(this.state.cells)
        console.log("getting new cells")
        let newGen = this.state.gen + 1
        console.log(newGen)
        this.setState({
            cells: newCells,
            gen: newGen
        })
        console.log("set new state")
    }

    getNewCells = (cells) => {
        var height = cells.length;
        var width = cells[0].length
        let newCells = []

        for (var row = 0; row < height; row++) {
            let currRow = [];
            for (var col = 0; col < width; col++) {
                var oldCell = cells[row][col];
                var liveNeighborCount = this.getLiveNeighborCount(cells, height, width, row, col);
                if (oldCell.alive) {
                    if (liveNeighborCount == 2 | liveNeighborCount == 3) {
                        var newCell = {
                            ...oldCell,
                            counter: oldCell.counter + 1
                        }
                    } else {
                        var newCell = {
                            ...oldCell,
                            alive: false,
                            counter: 0
                        }
                    }
                } else {
                    if (liveNeighborCount == 3) {
                        var newCell = {
                            ...oldCell,
                            alive: true,
                            counter: 1
                        }
                    } else {
                        // counter should already be 0
                        var newCell = {
                            ...oldCell
                        }
                    }
                }
                currRow.push(newCell)
            }
            newCells.push(currRow)
        }

        return newCells;
    }

    getLiveNeighborCount = (cells, height, width, row, col) => {
        let liveNeighborCount = 0;
        for (var i=row-1; i<row+2; i++) {
            for (var j=col-1; j<col+2; j++) {
                if (i >= 0 & i < height & j >= 0 & j < width) {
                    if (i != row | j != col) {
                        if (cells[i][j].alive) {
                            liveNeighborCount++
                        }
                    }
                }
            }
        }

        return liveNeighborCount
    }

    render() {
        var stopStartButton;
        if (this.state.running) {
            stopStartButton = (
                <button className="btn btn-outline-danger mx-2" onClick={this.stopGame}>Stop Game</button>
            )
        } else {
            stopStartButton = (
                <button className="btn btn-outline-success mx-2" onClick={this.startGame}>Start Game</button>
            )
        }
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <a className="navbar-brand" href="#">Conway's Game of Life   -   <i className="font-weight-light">Gen {this.state.gen}</i></a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            {stopStartButton}
                        </li>
                        <li className="nav-item">
                            <button className="btn btn-outline-primary mx-2" onClick={this.nextGen}>Next Generation</button>
                        </li>
                        <li className="nav-item">
                            <button className="btn btn-outline-primary mx-2" onClick={this.printGrid}>Print Grid</button>
                        </li>
                        <li className="nav-item">
                            <button className="btn btn-outline-info mx-2" onClick={this.clearGrid}>Clear Grid</button>
                        </li>
                        </ul>
                    </div>
                </nav>
                <div className="container">
                    {this.state.cells.map((row, rowNum) => {
                        var rowClassName = "row row-" + rowNum.toString();
                        // var cellBase = "col cell cell-";
                        return (
                            <div className={rowClassName} key={rowNum}>
                                {this.state.cells[rowNum].map((col, colNum) => {
                                    // var cellClassName = cellBase + rowNum.toString() + "-" + colNum.toString();
                                    return (
                                        <Cell 
                                            key={colNum}
                                            alive={col.alive}
                                            row={col.row}
                                            col={col.col}
                                            counter={col.counter}
                                            changeCell={this.changeCell} />
                                            
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default Grid;