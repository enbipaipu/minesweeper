import type { MouseEvent } from 'react';
import { useEffect, useState } from 'react';
import styles from './index.module.css';
const Home = () => {
  //0 -> 未入力
  //1 -> 左クリック
  //2 -> 右クリック
  //3 -> 旗
  const effortUserInputs = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];
  const initialUserInputs: (0 | 1 | 2 | 3)[][] = effortUserInputs.map((row) =>
    row.map((cell) => cell as 0 | 1 | 2 | 3)
  );
  const [userInputs, setUserInputs] = useState<(0 | 1 | 2 | 3)[][]>(initialUserInputs);

  //0->ボムなし
  //1->ボムあり
  const effortBombMap = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];
  const [bombMap, setBombMap] = useState(effortBombMap);

  const [seconds, setSeconds] = useState(0);

  const [play, setPlay] = useState(false);
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

  let brother = 12;

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
  let end = true;

  //userInputとbombMapを見てboardを作成
  const checkAround = (y: number, x: number) => {
    let aroundBombCount = 0;
    for (const dir of directions) {
      //指定した座標の周りを調べる
      if (bombMap[y + dir[0]] === undefined || bombMap[x + dir[1]] === undefined) {
        //
      } else if (bombMap[y + dir[0]][x + dir[1]] === 0) {
        //
      } else if (bombMap[y + dir[0]][x + dir[1]] === 1) {
        aroundBombCount += 1;
      }
    }
    board[y][x] = aroundBombCount;
    if (aroundBombCount === 0) {
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
        if (isFailure && bombMap[i][h]) {
          board[i][h] = 11;
          if (userInputs[i][h] === 1) {
            board[i][h] = 25;
            brother = 14;
            end = false;
          }
        } else if (userInputs[i][h] === 1 && bombMap[i][h] === 0) {
          checkAround(i, h);
        } else if (newUserInputs[i][h] === 3) {
          board[i][h] = 10;
        } else if (newUserInputs[i][h] === 2) {
          board[i][h] = 9;
        }
      }
    }
    let bombCount = 0;
    for (let s = 0; s < 9; s += 1) {
      for (let t = 0; t < 9; t += 1) {
        if (board[s][t] === -1 || board[s][t] === 9 || board[s][t] === 10) {
          bombCount += 1;
        }
      }
    }
    if (bombCount === 10) {
      //にこちゃんをグラサンに変える
      brother = 13;
      end = false;
    }
  };

  makeBoard();

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);

    // コンポーネントがアンマウントされたときにタイマーをクリアする

    return () => {
      clearInterval(timer);
    };
  }, []);

  const firstBomb = (y: number, x: number, p: number) => {
    newBombMap[y][x] = p;
  };
  //左クリック
  const clickStone = (y: number, x: number) => {
    if (play) {
      if (end) {
        if (board[y][x] !== 9 && board[y][x] !== 10) {
          console.log(y, x);
          newUserInputs[y][x] = 1;
          //ランダムにボムを生成
          if (!isPlaying) {
            firstBomb(y, x, 1);
            let n = 0;
            while (n < 10) {
              const a = Math.floor(Math.random() * 9);
              const b = Math.floor(Math.random() * 9);
              if (!newBombMap[a][b]) {
                console.log(n);
                newBombMap[a][b] = 1;
                n += 1;
              }
            }
            firstBomb(y, x, 0);
            setBombMap(newBombMap);
          }
        }
      }
      //数字クリック
      let nextFlagCount = 0;
      for (let s = -1; s <= 1; s++) {
        for (let t = -1; t <= 1; t++) {
          if (bombMap[y + s] === undefined || bombMap[x + t] === undefined) {
            //
          } else if (board[y + s][x + t] === 10) {
            nextFlagCount += 1;
          }
        }
      }
      if (board[y][x] > 0 && board[y][x] < 9) {
        if (board[y][x] === nextFlagCount) {
          for (let i = -1; i <= 1; i++) {
            for (let h = -1; h <= 1; h++) {
              if (userInputs[y + i] !== undefined && userInputs[y + i][x + h] === 0) {
                newUserInputs[y + i][x + h] = 1;
              }
            }
          }
        }
      }
      setUserInputs(newUserInputs);
    }
  };

  //右クリック
  const clickRight = (y: number, x: number, event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    const newUserInputs: (0 | 1 | 2 | 3)[][] = JSON.parse(JSON.stringify(userInputs));
    if (end) {
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
    }
  };

  //ボードの初期化
  const resetBoard = () => {
    setUserInputs(initialUserInputs);
    setBombMap(effortBombMap);
  };

  //flagの表示用
  let flagCount = 10;
  for (let i = 0; i <= 9; i++) {
    for (let h = 0; h <= 9; h++) {
      if (board[i] === undefined || board[i][h] === undefined) {
        //
      } else if (board[i][h] === 10) {
        flagCount--;
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.under}>
        <div className={styles.brother}>
          <div className={styles.flagcountboard}>
            <h1>
              <span className={styles.flagcount}>{flagCount}</span>
            </h1>
          </div>

          <div
            className={styles.reset}
            style={{
              backgroundPosition: brother === 12 ? '90px' : brother === 13 ? '60px' : '30px',
            }}
            onClick={() => resetBoard()}
          />

          <div className={styles.timer}>
            <h1>
              <span className={styles.timecount}>{seconds}</span>
            </h1>
          </div>
        </div>
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
    </div>
  );
};
export default Home;
