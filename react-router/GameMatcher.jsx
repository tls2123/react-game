import React, {Component} from "react";
import Baseball from '../baseketball/baseballClass';
import RSP from '../RSP/RSPClass';
import Lotto from '../lotto/LottoClass';

class GameMatch extends Component {
    render() {
        console.log(this.props.history, this.props.match)
        return (
            <>
                <Baseball />
                <RSP />
                <Lotto />
            </>
        );
    }
}

export default GameMatch;