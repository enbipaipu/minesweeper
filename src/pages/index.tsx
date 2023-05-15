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
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
  ];
  const newUserInputs = JSON.parse(JSON.stringify(userInputs));
  const newBombMap = JSON.parse(JSON.stringify(bombMap));

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

  //userInputとbombMapを見てboardを作成

  const checkAround = (y: number, x: number) => {
    let bombCount = 0;
    for (const dir of directions) {
      //指定した座標の周りを調べる
      if (bombMap[y + dir[0]] === undefined || bombMap[x + dir[1]] === undefined) {
        //
      } else if (bombMap[y + dir[0]][x + dir[1]] === 0) {
        //
      } else if (bombMap[y + dir[0]][x + dir[1]] === 1) {
        bombCount += 1;
      }
    }
    board[y][x] = bombCount;
    if (bombCount === 0) {
      for (const dir of directions) {
        //指定した座標の周りを調べる
        if (board[y + dir[0]] === undefined || board[x + dir[1]] === undefined) {
          //
        } else if (board[y + dir[0]][x + dir[1]] === -1) {
          checkAround(y + dir[0], x + dir[1]);
        }
      }
    }
  };

  //boardを調べる
  const makeBoard = () => {
    for (let i = 0; i < 9; i += 1) {
      for (let h = 0; h < 9; h += 1) {
        if (userInputs[i][h] === 1) {
          checkAround(i, h);
        }
        if (isFailure && bombMap[i][h]) {
          board[i][h] = 11;
          if (userInputs[i][h] === 1) {
            board[i][h] = 25;
          }
        }
      }
    }
  };
  //石を変える

  function settingBoard() {
    makeBoard();
    //
  }

  //本プログラム
  settingBoard();

  // userInputs.forEach((row) => {
  //   const boardRow = [...row];
  //   board.push(boardRow);
  // });

  const firstBomb = (y: number, x: number, p: number) => {
    for (let i = -1; i <= 1; i++) {
      for (let h = -1; h <= 1; h++) {
        newBombMap[y + i][x + h] = p;
      }
    }
  };

  const clickStone = (y: number, x: number) => {
    console.log(y, x);

    newUserInputs[y][x] = 1;

    //ランダムにボムを生成
    if (!isPlaying) {
      firstBomb(y, x, 1);
      let n = 0;
      while (n < 9) {
        const a = Math.floor(Math.random() * 9);
        const b = Math.floor(Math.random() * 9);
        if (!newBombMap[a][b]) {
          newBombMap[a][b] = 1;
          n += 1;
        }
      }
      firstBomb(y, x, 0);
      setBombMap(newBombMap);
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
            <div
              className={styles.cell}
              key={`${x}-${y}`}
              style={{ background: val === 25 ? '#f00' : '#fff0' }}
              onClick={() => clickStone(y, x)}
            >
              {val !== 0 &&
                (val !== -1 ? (
                  <div
                    className={styles.icon}
                    style={{ backgroundPosition: `${-(val - 1) * 30}px` }}
                  />
                ) : (
                  val < 11 && <div className={styles.stone} />
                ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default Home;
