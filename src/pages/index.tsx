import type { MouseEvent } from 'react';
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

  // -1 -> 石
  // 0 -> 画像なしセル
  //1~8 -> 数字セル
  //9-> 石＋？
  //10-> 石＋旗
  //11-> ボムセル
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
    const minusCount = 0;
    console.log('66666666');
    for (let i = 0; i < 9; i += 1) {
      for (let h = 0; h < 9; h += 1) {
        if (isFailure && bombMap[i][h]) {
          board[i][h] = 11;
          if (userInputs[i][h] === 1) {
            board[i][h] = 25;
          }
        }

        if (userInputs[i][h] === 1 && bombMap[i][h] === 0) {
          checkAround(i, h);
        }

        if (newUserInputs[i][h] === 3) {
          board[i][h] = 10;
        }
        if (newUserInputs[i][h] === 2) {
          board[i][h] = 9;
        }
      }
    }
    console.log('----------');
    console.log(minusCount);
    // if (minusCount === 10) {
    //   //にこちゃんをグラサンに変える
    //   alert('終了');
    // }
  };

  makeBoard();
  console.table(board);

  const firstBomb = (y: number, x: number, p: number) => {
    for (let i = -1; i <= 1; i++) {
      for (let h = -1; h <= 1; h++) {
        newBombMap[y + i][x + h] = p;
      }
    }
  };

  //左クリック
  const clickStone = (y: number, x: number) => {
    if (board[y][x] !== 9 && board[y][x] !== 10) {
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
    }
  };

  //右クリック
  const clickRight = (y: number, x: number, event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    console.log(y, x);
    const newUserInputs: (0 | 1 | 2 | 3)[][] = JSON.parse(JSON.stringify(userInputs));
    switch (board[y][x]) {
      case -1:
        newUserInputs[y][x] = 3;
        break;
      case 9:
        newUserInputs[y][x] = 0;
        break;
      case 10:
        newUserInputs[y][x] = 2;
        break;
    }
    setUserInputs(newUserInputs);
  };

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
              onContextMenu={(event) => clickRight(y, x, event)}
            >
              {val !== 0 &&
                (val !== -1 && val !== 9 && val !== 10 ? (
                  <div
                    className={styles.icon}
                    style={{ backgroundPosition: `${-(val - 1) * 30}px` }}
                  />
                ) : (
                  val < 11 && (
                    <div className={styles.stone}>
                      {board[y][x]}
                      {(board[y][x] === 9 || board[y][x] === 10) && (
                        <div
                          className={styles.flag}
                          style={{ backgroundPosition: `${-(val - 1) * 100}%` }}
                        />
                      )}
                    </div>
                  )
                ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default Home;
