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
    [1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const board: number[][] = [
    [-1, -1, 0, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
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

  let bombCount = 0; //?

  const checkAround = (y: number, x: number) => {
    for (const dis of directions) {
      //指定した座標の周りを調べる
      if (bombMap[y + dis[0]][x + dis[1]] === undefined) {
        break;
      } else if (bombMap[y + dis[0]][x + dis[1]] === 0) {
        break;
      } else if (bombMap[y + dis[0]][x + dis[1]] === 1) {
        bombCount += 1;
      }
    }
  };

  //boardを調べる
  const checkBoard = () => {
    for (let i = 0; i < 9; i += 1) {
      for (let h = 0; h < 9; h += 1) {
        checkAround(i, h);
        if (bombCount === 0) {
          board[i][h] = 0;
          checkAround(i, h);
        } else if (1 <= bombCount && bombCount <= 8) {
          //数字に対応した数字セルを表示
        }
      }
    }
  };
  //石を変える

  function openStone(y: number, x: number) {
    if (board[y][x] === -1) {
      board[y][x] = 0;
    }
    if (bombMap[y][x] === 1) {
      board[y][x] = 11;
    }
  }

  //本プログラム

  // openStone(y, x);

  const clickStone = (y: number, x: number) => {
    console.log(y, x);
    const newUserInputs = JSON.parse(JSON.stringify(userInputs));
    const newBombMap = JSON.parse(JSON.stringify(bombMap));

    if (isPlaying === false) {
      //userinput

      const makeBomb = () => {
        let n = 0;
        while (n < 10) {
          const hig = Math.floor(Math.random() * 9);
          const whi = Math.floor(Math.random() * 9);
          if (bombMap[hig][whi] === 0) {
            newBombMap[hig][whi] = 1;
            n += 1;
          } else if (bombMap[hig][whi] === 1) {
            //
          }
        }
      };
      setBombMap(newBombMap);
    }

    if (isPlaying) {
      newUserInputs[y][x] === 1;
      if (isFailure) {
        //ボムを爆破
      }
    }
    //userInputsによる条件分岐

    //計算値(2つのuseStateからボードを作る)（ボードは毎回作り直す）

    // userInputs.forEach((row) => {
    //   const boarRow = [...row];
    //   board.push(boardRow);
    // });

    setUserInputs(newUserInputs);
  };

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
