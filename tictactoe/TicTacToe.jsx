import React, {useCallback, useState, useReducer, useEffect} from "react";
import Table from './Table'

const initialState = {
    winner: '',
    true: '0',
    tableData: [['','',''], ['','',''], ['','','']],
    recentCell: [-1, -1],
}

export const SET_WINNER = 'SET_WINNER';
export const CLICK_CELL = 'CLICK_CELL';
export const CHANGE_TURN = 'CHANGE_TURN';
export const RESET_GAME= 'RESET_GAME'

const reducer = (state, action) => {
    switch (action.type) {
      case SET_WINNER:
        //state.winner = action.winner이런 식으로 하면 불변성에 위배
        return {
          ...state,
          winner: action.winner,
        };
      case CLICK_CELL: {
        const tableData = [...state.tableData];
        tableData[action.row] = [...tableData[action.row]]; // immer라는 라이브러리로 가독성 해결
        tableData[action.row][action.cell] = state.turn;
        return {
          ...state,
          tableData,
          recentCell: [action.row, action.cell],
        };
      }
      case CHANGE_TURN: {
        return {
          ...state,
          turn: state.turn === 'O' ? 'X' : 'O',
        };
      }
      case RESET_GAME: {
        return {
          ...state,
          turn: '0',
          tableData: [['','',''], ['','',''], ['','','']],
          recentCell: [-1, -1],
        };
      }
      default:
        return state;
    }
}

const TicTacToe = () => {

    const [state, dispatch] = useReducer(reducer, initialState);
    const { tableData, turn, winner, recentCell } = state;
    // const [winner, setWinner] = useState('');
    // const [turn, setTurn] = useState('0');
    // const [tableDate, setTableDate] = useState([['','',''], ['','',''], ['','','']]);

    const onClickTable = useCallback(() => {
        dispatch({type: 'SET_WINNER', winner: '0'});
    }, []);

    useEffect(() => {
      const [row, cell] = recentCell;
      //useEffect 는 처음에도 실행이 되기 때문에 -1일때 걸러준것
      if(row < 0){
        return;
      }
      let win = false;
      //테이블 다 검사 - 가로
      if (tableData[row][0] === turn && tableData[row][1] === turn && tableData[row][2] === turn) {
        win = true;
      }
      //새로
      if (tableData[0][cell] === turn && tableData[1][cell] === turn && tableData[2][cell] === turn) {
        win = true;
      }
      //대각선
      if (tableData[0][0] === turn && tableData[1][1] === turn && tableData[2][2] === turn) {
        win = true;
      }
      //대각선
      if (tableData[0][2] === turn && tableData[1][1] === turn && tableData[2][0] === turn) {
        win = true;
      }
      if(win){//승리
        dispatch({type: SET_WINNER, winner: turn})
        dispatch({type: RESET_GAME});
      }else{ //무승부
        let all = true; //무승부라는 의미
        tableData.forEach((row) => { //무승부검사
          row.forEach((cell) => {
            if(!cell){
              all = false; //무승부아님
            }
          });
        });
        if(all){
          dispatch({type: RESET_GAME});
        }else{
          //Td에 있던 changeturn를 가지고 온 이유는 비동기때문에 순서가 원하는 방향으로 가지 못해서 이동
          dispatch({type: CHANGE_TURN});
        }
      }
    }, [recentCell]);

    return(
        <>
            <Table onClick={onClickTable} tableData={tableData} dispatch={dispatch}/>
            {winner && <div>{winner}님의 승리</div>}
        </>
    )

}

export default TicTacToe;