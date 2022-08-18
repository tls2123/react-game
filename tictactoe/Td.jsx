import React, { memo, useCallback, useEffect, useRef } from "react";
import { CLICK_CELL} from "./TicTacToe";

const Td = memo(({rowIndex, cellIndex, dispatch, cellData}) => {
    console.log('td rendering');

    const ref = useRef([]);
    useEffect(() => {
        //바뀌는 게 있다면 그건 false가 될 것이고 그게 rerandering하게 만드는 것이다.
        //어떤게 바뀌는지 모를 때 어떤게 렌더링이 된지 않은지 모르겟을때 사용
        console.log(rowIndex === ref.current[0], cellIndex === ref.current[1], dispatch === ref.current[2], cellData === ref.current[3]);
        ref.current = [rowIndex, cellIndex, dispatch, cellData];
    }, [rowIndex, cellIndex, dispatch, cellData])
    const onClickTd = useCallback(() => {
        console.log(rowIndex, cellIndex);
        if(cellData){
            return;
        }
        dispatch({type: CLICK_CELL, row: rowIndex, cell: cellIndex});
        
    },[cellData]);

    return (
        <td onClick={onClickTd}>{cellData}</td>
    )
});

export default Td;