import React, { useReducer, createContext, useMemo, useEffect } from "react";
import Form from "./Form";
import Table from "./Table";

//지뢰상태 코드 정상 -1 지뢰는 -7
export const CODE = {
  MINE: -7,
  NORMAL: -1,
  QUESTION: -2,
  FLAG: -3,
  QUESTION_MINE: -4,
  FLAG_MINE: -5,
  CLICKED_MINE: -6,
  OPENED: 0, // 0 이상이면 다 opened
};

//기본값을 넣을 수 잇음
export const TableContext = createContext({
  tableData: [],
  dispatch: () => {},
  halted: true,
});

const initialState = {
  tableData: [],
  data: {
    row: 0,
    cell: 0,
    mine: 0,
  },
  timer: 0,
  result: "",
  halted: true,
  openedCount: 0,
};
//지뢰를 심는
const plantMine = (row, cell, mine) => {
  console.log(row, cell, mine);
  const candidata = Array(row * cell).fill().map((arr, i) => {
      return i;
    });
  const shuffle = [];
  while (candidata.length > row * cell - mine) {
    const chosen = candidata.splice(Math.floor(Math.random() * candidata.length),)[0];
    shuffle.push(chosen);
  }
  const data = [];
  for (let i = 0; i < row; i++) {
    const rowData = [];
    data.push(rowData);
    for (let j = 0; j < cell; j++) {
      rowData.push(CODE.NORMAL);
    }
  }
  for (let k = 0; k < shuffle.length; k++) {
    const ver = Math.floor(shuffle[k] / cell);
    const hor = shuffle[k] % cell;
    data[ver][hor] = CODE.MINE;
  }
  console.log(data);
  return data;
};
export const START_GAME = "START_GAME";
export const OPEN_CELL = "OPEN_CELL";
export const CLICK_MINE = "CLICK_MINE";
export const FLAG_CELL = "FLAG_CELL";
export const QUESTION_CELL = "QUESTION_CELL";
export const NORMALIZE_CELL = "NORMALIZE_CELL";
export const INCREMENT_TIMER = "INCREMENT_TIMER";

const reducer = (state, action) => {
  switch (action.type) {
    case START_GAME:
      return {
        ...state,
        data: {
          row: action.row,
          cell: action.cell,
          mine: action.mine,
        },
        openedCount: 0,
       
        tableData: plantMine(action.row, action.cell, action.mine),
        halted: false,
        timmer: 0,
      };
    case OPEN_CELL:
      const tableData = [...state.tableData];
      //하나의 칸이 아닌 모든 칸들을 복사
      tableData.forEach((row, i) => {
        tableData[i] = [...row];
      });
      //한번 검사한 칸은 다시 검사하지 않도록
      //다이나믹 프로그램도 이와 비슷 - 한번 계산 한 값은 다시 계산하지 않는다.
      const checked = [];
      let openedCount = 0; //count가 바뀜으로 const 가 아닌 let 으로 
      //주변의 칸을 검사하는 것을 만들어서(내기준으로 ) - 지뢰의 갯수를 검사하기 위한
      const checkArround = (row, cell) => {
        //내가 빈칸 일때만 클릭을 해야함으로 여기서 걸러준다. - 닫힌칸 걸러줌
        if([CODE.OPENED, CODE.FLAG_MINE, CODE.FLAG, CODE.QUESTION_MINE, CODE.QUESTION].includes(tableData[row][cell])){
          return;
        }
        //js의 특성상 죄우는 undefind로 인식 그래서 상하 위주로 검사를 진행함 - filter로 undefined를 잡아주어 check
        if(row < 0 || row >= tableData.length || cell < 0 || cell >= tableData[0].length){ //상하좌우 필터링
          return;
        }
        //서로 옆은 칸을 검사하는 것을 막아주어야 안터짐
        if(checked.includes(row + ',' + cell)){ //이미 검사한 칸이면 return 
          return;
        }else{ //
          checked.push(row + ',' + cell);
        }
        let around = [tableData[row][cell - 1], tableData[row][cell + 1],];
        //칸이 없는 아래줄과 위줄 미리처리
        if (tableData[row - 1]) {
          around = around.concat(
            tableData[row - 1][cell - 1],
            tableData[row - 1][cell],
            tableData[row - 1][cell + 1]
          );
          if (tableData[action.row + 1]) {
            around = around.concat(
              tableData[row + 1][cell - 1],
              tableData[row + 1][cell],
              tableData[row + 1][cell + 1]
            );
          }
        }
        //위에 여덜칸 중에서 지뢰의 갯수를 센다.
        //주변에 지뢰가 잇는지 찾아서 갯수를 센다.
        const count = around.filter((v) =>
          [CODE.MINE, CODE.FLAG_MINE, CODE.QUESTION_MINE].includes(v)
        ).length;
        console.log(around, count);
        tableData[row][cell] = count;
        //내가 빈칸이면 주변칸 검사
        //주변칸을 클릭할것
        if (count === 0) {
          if(row > -1){
            const near = [];
            //제일 위의 칸 내가 가장 위의 칸이면 나의 위에는 칸이 없음
            if(row - 1 > -1){
              near.push([row - 1, cell - 1]);
              near.push([row - 1, cell]);
              near.push([row - 1, cell + 1]);
            }
            near.push([row, cell - 1]);
            near.push([row, cell + 1]);
            //내가 제일 아래칸이면 나보다 아래의 칸은 없음
            if(row + 1 > tableData.length){
              near.push([row + 1, cell - 1]);
              near.push([row + 1, cell]);
              near.push([row + 1, cell + 1]);
            }
            //주위에 있는 칸들만 클릭하는 것
            near.forEach((n) => {
              if (tableData[n[0]][n[1]] !== CODE.OPENED) {
                checkArround(n[0], n[1]);
              }
            })
          }
        }
        if (tableData[row][cell] === CODE.NORMAL) { // 내 칸이 닫힌 칸이면 카운트 증가
          openedCount += 1;
        }
        tableData[row][cell] = count;
      };
      checkArround(action.row, action.cell);
      //칸을 열엇을 때 승리 조건도 같이 넣어준다.
      let halted = false; 
      let result = ''; // 
      if(state.data.row * state.data.cell - state.data.mine === state.openedCount - openedCount){ //승리
        halted = true; //승리하면 게임을 멈춘다.
        result = `${state.timer}초 승리하셨습니다.` //승리 후 메시지
      }
      return {
        ...state,
        tableData,
        openedCount: state.openedCount + openedCount,
        halted,
        result,
      };
    case CLICK_MINE: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      tableData[action.row][action.cell] = CODE.CLICKED_MINE;
      return {
        ...state,
        tableData,
        halted: true,
      };
    }
    case FLAG_CELL: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      if (tableData[action.row][action.cell] === CODE.MINE) {
        tableData[action.row][action.cell] = CODE.FLAG_MINE;
      } else {
        tableData[action.row][action.cell] = CODE.FLAG;
      }
      return {
        ...state,
        tableData,
      };
    }
    case QUESTION_CELL: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      if (tableData[action.row][action.cell] === CODE.FLAG_MINE) {
        tableData[action.row][action.cell] = CODE.QUESTION_MINE;
      } else {
        tableData[action.row][action.cell] = CODE.QUESTION;
      }
      return {
        ...state,
        tableData,
      };
    }
    case NORMALIZE_CELL: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      if (tableData[action.row][action.cell] === CODE.QUESTION_MINE) {
        tableData[action.row][action.cell] = CODE.MINE;
      } else {
        tableData[action.row][action.cell] = CODE.NORMAL;
      }
      return {
        ...state,
        tableData,
      };
    }
    case INCREMENT_TIMER: {
      return{
        ...state,
        timer: state.timer + 1,
      }
    }
    default:
      return state;
  }
};

const MineSearch = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  //이런 식으로 캐싱을 한번 해주어야지 context API를 할 때 성능 저하가 덜 발생한다.
  //dispatch는 절대로 변화가 없음으로 input안에 넣어주면 안된다.
  const { tableData, halted, result, timer } = state;

  const value = useMemo(() => ({ tableData: tableData, halted: halted, dispatch }), [tableData, halted]);

  useEffect(() => {
    let timer;
    if(halted === false){
      timer = setInterval(() => {
        dispatch({type: INCREMENT_TIMER});
      }, 1000);
    }
    
    return () => {
      clearInterval(timer);
    }
  }, [halted]);

  return (
    <TableContext.Provider value={value}>
      <Form />
      <div>{timer}</div>
      <Table />
      <div>{result}</div>
    </TableContext.Provider>
  );
};

export default MineSearch;
