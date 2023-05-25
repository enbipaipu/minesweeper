import type { MouseEvent } from 'react';
import { useEffect, useState } from 'react';
import { useBoard } from './useBoard';
export const useIndex = () => {
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
  const { board, end, brother } = useBoard({ userInputs, bombMap });

  const [seconds, setSeconds] = useState(0);

  const [play, setPlay] = useState(false);
  // -1 -> 石
  // 0 -> 画像なしセル
  //1~8 -> 数字セル
  //9-> 石＋？
  //10-> 石＋旗
  //11-> ボムセル

  const newUserInputs = JSON.parse(JSON.stringify(userInputs));
  const newBombMap = JSON.parse(JSON.stringify(bombMap));

  const isPlaying = userInputs.some((row) => row.some((input) => input !== 0));

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

  return { board, clickStone, clickRight, seconds, flagCount, brother, resetBoard };
};
