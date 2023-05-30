import { useMemo } from 'react';

export function useBoard({
  userInputs,
  bombMap,
  setPlay,
}: {
  userInputs: (0 | 1 | 2 | 3)[][];
  bombMap: number[][];
  setPlay: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { board, brother, end } = useMemo(() => {
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
    let brother = 12;
    let end = true;
    const newUserInputs = JSON.parse(JSON.stringify(userInputs));

    const isFailure = userInputs.some((row, y) =>
      row.some((input, x) => input === 1 && bombMap[y][x] === 1)
    );
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
              setPlay(false);
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
        setPlay(false);
      }
    };

    makeBoard();

    return { board, brother, end };
  }, [bombMap, userInputs, setPlay]);
  return { board, brother, end };
}
