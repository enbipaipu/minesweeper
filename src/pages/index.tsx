import { useBoard } from '../hooks/useBoard';
import styles from './index.module.css';
const Home = () => {
  const { board, clickStone, clickRight, seconds, flagCount, brother, resetBoard } = useBoard();

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
