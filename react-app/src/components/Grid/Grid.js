import React from 'react';
import Cell from '../Cell/Cell';


class Grid extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            cells: this.getBlankGrid(25, 25),
            gen: 0,
            running: false,
            intervalId: null,
            speed: "slow"
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

    getRandomGrid = () => {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        var height = 25;
        var width = 25;
        let cells = [];
        var aliveThreshold = Math.random();

        for (var row=0; row < height; row++) {
            let curr_row = [];
            for (var col=0; col < width; col++) {
                var aliveDecider = Math.random();
                if (aliveDecider > aliveThreshold) {
                    var curr_cell = {
                        alive: true,
                        row: row,
                        col: col,
                        counter: 0
                    }
                } else {
                    var curr_cell = {
                        alive: false,
                        row: row,
                        col: col,
                        counter: 0
                    }
                }
                curr_row.push(curr_cell);
            }
            cells.push(curr_row);
        }
        this.setState({
            cells: cells,
            gen: 0,
            running: false,
            intervalId: null
        })
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
        this.state.cells[row][col].alive = newAliveState;
        this.forceUpdate()
    }

    startGame = () => {
        this.setState({
                running: true,
                gen: 0
            },
            this.gameLoop
        )
    }

    stopGame = () => {
        clearInterval(this.state.intervalId)
        this.setState({
            intervalId: null,
            running: false
        })
    }

    gameLoop = () => {
        let intervalSpeed;
        if (this.state.speed == "slow") {
            intervalSpeed = 1000
        } else if (this.state.speed == "med") {
            intervalSpeed = 500
        } else {
            intervalSpeed = 250
        }
        var intervalId = setInterval(this.getNewGen, intervalSpeed)
        this.setState({
            intervalId: intervalId
        })
    }

    nextGen = () => {
        this.getNewGen()
    }

    getNewGen = () => {
        let [changeMade, newCells] = this.getNewCells(this.state.cells)
        if (changeMade) {
            let newGen = this.state.gen + 1
            this.setState({
                cells: newCells,
                gen: newGen
            })
        } else {
            clearInterval(this.state.intervalId)
            this.setState({
                running: false,
                intervalId: null
            })
            alert("Cells have hit a gridlock. End of simulation at generation " + this.state.gen.toString() + ".")
        }
    }

    getNewCells = (cells) => {
        var height = cells.length;
        var width = cells[0].length
        let newCells = []
        let changeMade = false;

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
                        changeMade = true;
                    }
                } else {
                    if (liveNeighborCount == 3) {
                        var newCell = {
                            ...oldCell,
                            alive: true,
                            counter: 1
                        }
                        changeMade = true;
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

        return [changeMade, newCells];
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

    changeSpeed = (e) => {
        var newSpeed = e.target.value;
        this.setState({
            speed: newSpeed
        })
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
                    <a className="navbar-brand" href="#">Conway's Game of Life</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <i className="font-weight-light">Generation {this.state.gen}</i>
                        </li>
                        </ul>
                    </div>
                </nav>
                <div className="container my-2">
                    <h5 className="ml-4 text-left">
                        Rules:
                    </h5>
                    <ul className="list-group list-group-flush text-left">
                        <li className="list-group-item">Any live cell with two or three live neighbours survives.</li>
                        <li className="list-group-item">Any dead cell with three live neighbours becomes a live cell.</li>
                        <li className="list-group-item">All other live cels die in the next generation. Similarly, all other dead cells stay dead.</li>
                    </ul>
                </div>
                <div className="row justify-content-center my-2">
                    {stopStartButton}
                    <button className="btn btn-outline-primary mx-2" onClick={this.nextGen}>Next Generation</button>
                    <button className="btn btn-outline-secondary mx-2" onClick={this.getRandomGrid}>Random Grid</button>
                    <button className="btn btn-outline-primary mx-2" onClick={this.printGrid}>Print Grid</button>
                    <button className="btn btn-outline-info mx-2" onClick={this.clearGrid}>Clear Grid</button>
                    <div className="btn-group mx-2">
                        <button className="btn btn-secondary" onClick={this.changeSpeed} value="slow">Slow</button>
                        <button className="btn btn-secondary" onClick={this.changeSpeed} value="med">Medium</button>
                        <button className="btn btn-secondary" onClick={this.changeSpeed} value="fast">Fast</button>
                    </div>
                </div>
                <div className="container my-2 grid-container">
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
                                            changeCell={this.changeCell}
                                            running={this.state.running} />
                                            
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