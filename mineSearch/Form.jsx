import React, {useState, useCallback, useContext, memo} from 'react';
import { TableContext } from './MineSearch';
import {START_GAME} from './MineSearch';

const Form = memo(() => {
    //새로 몇 줄 할지
    const [row, setRow] = useState(10);
    //가로 
    const [cell, setCell] = useState(10);
    //지뢰
    const [mine, setMine] = useState(10);
    const {dispatch} = useContext(TableContext);

    //불필요한 렌더링을 막기위해서 습관적으로 useCallback를 넣어주는 것이 좋다.
    const onChangeRow = useCallback((e) => {
        setRow(e.target.value);
    }, []);
    const onChangeCell = useCallback((e) => {
        setCell(e.target.value);
    }, []);
    const onChangeMine = useCallback((e) => {
        setMine(e.target.value);
    },[]);

    //중요 context API를 적용할 거
    const onClickBtn = useCallback(() => {
        //START_GAME에 아래에서 받은 row, cell, mine 데이터의 값을 넘겨줌
        dispatch({ type: START_GAME, row, cell, mine})
    }, [row, cell, mine])

    return(
        <div>
            <input type="number" placeholder='세로' value={row} onChange={onChangeRow} />
            <input type="number" placeholder='가로' value={cell} onChange={onChangeCell} />
            <input type="number" placeholder='지뢰' value={mine} onChange={onChangeMine} />
            <button onClick={onClickBtn}>시작</button>
        </div>
    )
});

export default Form;