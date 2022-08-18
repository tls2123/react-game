import React, {memo, useContext} from 'react';
import { TableContext } from './MineSearch';
import Td from './Td';

//tableData[0]의 값이 0일것을 대비해서 보호연산자를 해줌
const Tr = memo(({rowIndex}) => {
    const {tableData} = useContext(TableContext);
    return (
        <tr>
            {tableData[0] && Array(tableData[0].length).fill().map((td, i) => <Td rowIndex={rowIndex} cellIndex={i}/>)}
        </tr>
        
    )
});

export default Tr;