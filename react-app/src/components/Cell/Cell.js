import React from 'react';


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
            console.log("newprops")
            console.log(newProps)
            this.setState({
                alive: newProps.alive,
                counter: newProps.counter
            })
        }
    }

    render() {
        var cellBase = "col cell cell-";
        var cellClassName = cellBase + this.state.row.toString() + "-" + this.state.col.toString();
        if (this.state.alive) {
            cellClassName += " alive";
        } else {
            cellClassName += " dead";
        }
        return (
            <div className={cellClassName} onClick={this.handleClick}>
                {this.state.row}|{this.state.col}
            </div>
        )
    }
}


export default Cell