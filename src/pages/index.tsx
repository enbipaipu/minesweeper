import { useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  //0 -> 未入力
  //1 -> 左クリック
  //2 -> 右クリック
  //3 -> 旗
  const [userInputs, setUserInputs] = useState<(0 | 1 | 2 | 3)[][]>([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const bombCount = 10;

  //0->ボムなし
  //1->ボムあり

  const [bombMap, setBombMap] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const isPlaying = userInputs.some((row) => row.some((input) => input !== 0));
  const isFailure = userInputs.some((row, y) =>
    row.some((input, x) => input === 1 && bombMap[y][x] === 1)
  );

  //prett -ignore
  const directions = [
    [-1, 0],
    [-1, -1],
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
  ];

  const rClickStone = (x: number, y: number) => {
    // 右クリックを消す
    // setUserInputs(newUserInputs);
    // document.getElementsByTagName('html')[0].oncontextmenu = function () {
    //   return false;
  };

  const clickStone = (x: number, y: number) => {
    console.log(x, y);
    const newuserInputs = JSON.parse(JSON.stringify(userInputs));

    if (board[x][y] === 0) {
      newuserInputs[x][y] = 1;
    }
  };
  //0 -> 未入力
  //1 -> 左クリック
  //2 -> 右クリック
  //3 -> 旗

  // -1 -> 石
  // 0 -> 画像なしセル
  //1~8 -> 数字セル
  //9-> 石＋？
  //10-> 石＋旗
  //11-> ボムセル

  //計算値
  const board: number[][] = [];

  for (let y = 0; y < 9; y++) {
    const row: number[] = [];
    for (let x = 0; x < 9; x++) {
      row.push(0);
    }
    board.push(row);
  }

  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      if (userInputs[y][x] !== 0) {
        // ユーザーの入力がある場合
        board[y][x] = -1; // 石のセルを表す値
      } else if (bombMap[y][x] === 1) {
        // ボムがある場合
        board[y][x] = 11; // ボムセルを表す値
      } else {
        // 周囲のボムの数を計算する
        let bombCount = 0;
        for (const [dx, dy] of directions) {
          const newX = x + dx;
          const newY = y + dy;
          if (newX >= 0 && newX < 9 && newY >= 0 && newY < 9) {
            if (bombMap[newY][newX] === 1) {
              bombCount++;
            }
          }
        }
        board[y][x] = bombCount; // 数字セルの値を設定
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((val, x) => (
            <div className={styles.cell} key={`${x}-${y}`}>
              {val !== 3 &&
                (val === 0 ? (
                  <div
                    className={styles.stone}
                    onClick={() => clickStone(x, y)}
                    onContextMenu={() => rClickStone(x, y)}
                  />
                ) : null)}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;

// let zeroList: { x: number; y: number }[];
// for () {
//   zeroList = // board + directions + userInputs + bombMap
// }

// let openedCount: number
// for () {
//   openedCount = // board
// }

// const isSuccess = // openedCount + bombCount
// let isFailure: boolean
// for () {
//   isFialure = // userInputs + bombMap
// }

// let isStarted: boolean
// for () {
//   isStarted = // userInputs
// }

// const addZeroAroundZero = (hoge: fuga) => {

// }// 再帰関数

// const reset = () => {

// };
