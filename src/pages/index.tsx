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

  const farstBombCount = 10;

  //0->ボムなし
  //1->ボムあり

  const [bombMap, setBombMap] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const board: number[][] = [
    [-1, 0, 1, 2, 3, 4, 5, 6, 7],
    [8, 9, 10, 11, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
  ];

  const isPlaying = userInputs.some((row) => row.some((input) => input !== 0));
  const isFailure = userInputs.some((row, y) =>
    row.some((input, x) => input === 1 && bombMap[y][x] === 1)
  );

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

  // -1 -> 石
  // 0 -> 画像なしセル
  //1~8 -> 数字セル
  //9-> 石＋？
  //10-> 石＋旗
  //11-> ボムセル

  let bombCount = 0;

  //userInputとbombMapを見てboardを作成

  const checkAround = (y: number, x: number) => {
    if (userInputs[y][x] === 1) {
      for (const dir of directions) {
        //指定した座標の周りを調べる
        if (bombMap[y + dir[0]] === undefined && bombMap[y + dir[0]][x + dir[1]] === undefined) {
          break;
        } else if (bombMap[y + dir[0]][x + dir[1]] === 0) {
          break;
        } else if (bombMap[y + dir[0]][x + dir[1]] === 1) {
          bombCount += 1;
        }
      }
      board[y][x] = bombCount;
      if (bombCount === 0) {
        //周りのuserInputsを１に変える
        for (const dir of directions) {
          //指定した座標の周りを調べる
          if (
            userInputs[y + dir[0]] === undefined &&
            userInputs[y + dir[0]][x + dir[1]] === undefined
          ) {
            break;
          } else if (userInputs[y + dir[0]][x + dir[1]] === 0) {
            userInputs[y + dir[0]][x + dir[1]] = 1;
            checkAround(y + dir[0], x + dir[1]);
          }
        }
      }
    }
  };

  //boardを調べる
  const checkBoard = () => {
    for (let i = 0; i < 9; i += 1) {
      for (let h = 0; h < 9; h += 1) {
        checkAround(i, h);
      }
    }
  };
  //石を変える

  function settingBoard() {
    checkBoard();
    //
  }

  //本プログラム
  settingBoard();

  // userInputs.forEach((row) => {
  //   const boardRow = [...row];
  //   board.push(boardRow);
  // });

  const clickStone = (y: number, x: number) => {
    console.log(y, x);
    const newUserInputs = JSON.parse(JSON.stringify(userInputs));
    const newBombMap = JSON.parse(JSON.stringify(bombMap));

    newUserInputs[y][x] = 1;

    //ランダムにボムを生成
    if (!isPlaying) {
      let n = 0;
      while (n < 10) {
        const height = Math.floor(Math.random() * 9);
        const width = Math.floor(Math.random() * 9);
        if (!bombMap[height][width]) {
          newBombMap[height][width] = 1;
          n += 1;
        }
      }
      setBombMap(newBombMap);
    }

    if (isPlaying) {
      if (isFailure) {
        console.log('bom');
      }
    }
    setUserInputs(newUserInputs);
  };
  //userInputsによる条件分岐

  //計算値(2つのuseStateからボードを作る)（ボードは毎回作り直す）

  // -1 -> 石
  // 0 -> 画像なしセル
  //1~8 -> 数字セル
  //9-> 石＋？
  //10-> 石＋旗
  //11-> ボムセル

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((val, x) => (
            <div className={styles.cell} key={`${x}-${y}`}>
              {val !== 0 &&
                (val === -1 ? (
                  <div
                    className={styles.stone}
                    style={{ background: val === -1 ? 'rgb(219, 36, 36)' : '#ffffff0' }}
                    onClick={() => clickStone(y, x)}
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
