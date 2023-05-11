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

  const clickStone = (y: number, x: number) => {
    console.log(y, x);
    const newBoard = JSON.parse(JSON.stringify(board));

    // -1 -> 石
    // 0 -> 画像なしセル
    //1~8 -> 数字セル
    //9-> 石＋？
    //10-> 石＋旗
    //11-> ボムセル

    function openStone(x: number, y: number) {
      let bombCount = 0;

      if (bombMap[y][x] === 1) {
        console.log('11'); //爆破セル 11を表示
      } else if (bombMap[y][x] === 0) {
        console.log('a'); //周りのボムの数を数えて、その数を表示
        for (const i of directions) {
          if (bombMap[y + i[0]][x + i[1]] === undefined) {
            continue;
          } else if (bombMap[y + i[0]][x + i[1]] === 1) {
            bombCount += 1;
          }
        }
        if (bombCount === 0) {
          for (const t of directions) {
            openStone(y + t[0], x + t[1]); //再起関数
          }
        } else if (bombCount >= 1 || bombCount <= 8) {
          //数字に対応した数字セルを出現させる
        }
      }
    }

    openStone(y, x);
  };

  //計算値

  // userInputs.forEach((row) => {
  //   const boarRow = [...row];
  //   board.push(boardRow);
  // });

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((val, x) => (
            <div className={styles.cell} key={`${x}-${y}`}>
              {val !== 0 &&
                (val === -1 ? (
                  <div className={styles.stone} onClick={() => clickStone(y, x)} />
                ) : null)}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default Home;
