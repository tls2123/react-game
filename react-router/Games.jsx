import React from 'react';
import { BrowserRouter, HashRouter, Route, Link } from 'react-router-dom';
import GameMatch from './GameMatcher';



const Games = () => {
  
  return (
    <BrowserRouter>
      <div>
        <Link to = '/game/number-baseball'>숫자야구</Link>
        &nbsp;
        <Link to = '/game/rock-scissors-paper'>가위바위보</Link>
        &nbsp;
        <Link to = '/game/lotto-generator'>로또</Link>
        &nbsp;
        <Link to = '/game/index'>게임</Link>
      </div>
      <div>
        <Route path = '/game/:name' component={GameMatch}/>
      </div>
    </BrowserRouter>
  );
};

export default Games;