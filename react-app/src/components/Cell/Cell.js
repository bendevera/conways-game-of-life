import React from 'react';
import chroma from 'chroma-js';


class Cell extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            alive: props.alive,
            row: props.row,
            col: props.col,
            counter: props.counter
        }
    }

    handleClick = () => {
        var newState = this.state.alive ? false : true;
        this.setState({
            alive: newState
        })
        this.props.changeCell(newState, this.state.row, this.state.col)
    }

    componentWillReceiveProps(newProps) {
        if (newProps.alive != this.state.alive | newProps.counter != this.state.counter) {
            this.setState({
                alive: newProps.alive,
                counter: newProps.counter
            })
        }
    }

    render() {
        var cellBase = "col cell cell-";
        var cellClassName = cellBase + this.state.row.toString() + "-" + this.state.col.toString();
        let customScale = chroma.scale(['#9CDF7C','#2A4858']).domain([0, 1])
        let backgroundColor;
        if (this.state.alive) {
            cellClassName += " alive";
            if (this.state.counter > 20 | !this.props.running) {
                backgroundColor = customScale(1)
            } else {
                backgroundColor = customScale(this.state.counter/20)
            }
        } else {
            backgroundColor = "white"
            cellClassName += " dead";
        }
        if (this.props.running) {
            return (
                <div className={cellClassName} style={{"backgroundColor": backgroundColor, "color": backgroundColor, "cursor": "none"}}>
                    {this.state.row}|{this.state.col}
                </div>
            )
        }
        return (
            <div className={cellClassName} style={{"backgroundColor": backgroundColor, "color": backgroundColor}} onClick={this.handleClick}>
                {this.state.row}|{this.state.col}
            </div>
        )
    }
}


export default Cell