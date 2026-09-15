import { useEffect, useState, useRef } from "react";

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export function SnakeGame({ onExit }: { onExit: () => void }) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const snakeRef = useRef(snake);
  const directionRef = useRef(direction);
  const foodRef = useRef(food);

  useEffect(() => {
    snakeRef.current = snake;
    directionRef.current = direction;
    foodRef.current = food;
  }, [snake, direction, food]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "q" || (e.key === "c" && e.ctrlKey)) {
        e.preventDefault();
        onExit();
        return;
      }
      if (e.key === "p" || e.key === " ") {
        setIsPaused((p) => !p);
        return;
      }
      if (e.key === "r") {
        e.preventDefault();
        setSnake(INITIAL_SNAKE);
        setDirection(INITIAL_DIRECTION);
        setFood({ x: 5, y: 5 });
        setScore(0);
        setGameOver(false);
        setIsPaused(false);
        return;
      }

      if (gameOver) return;

      const dir = directionRef.current;
      switch (e.key) {
        case "ArrowUp":
          if (dir.y === 0) setDirection({ x: 0, y: -1 });
          e.preventDefault();
          break;
        case "ArrowDown":
          if (dir.y === 0) setDirection({ x: 0, y: 1 });
          e.preventDefault();
          break;
        case "ArrowLeft":
          if (dir.x === 0) setDirection({ x: -1, y: 0 });
          e.preventDefault();
          break;
        case "ArrowRight":
          if (dir.x === 0) setDirection({ x: 1, y: 0 });
          e.preventDefault();
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOver, onExit]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      const currentSnake = [...snakeRef.current];
      const first = currentSnake[0]!;
      const head: Point = { x: first.x, y: first.y };
      const dir = directionRef.current;

      head.x += dir.x;
      head.y += dir.y;

      // Wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        return;
      }

      // Self collision
      if (currentSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return;
      }

      currentSnake.unshift(head);

      // Food collision
      const f = foodRef.current;
      if (head.x === f.x && head.y === f.y) {
        setScore((s) => s + 10);
        setFood({
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE),
        });
      } else {
        currentSnake.pop();
      }

      setSnake(currentSnake);
    };

    const interval = setInterval(moveSnake, 120 - Math.min(score, 80)); // speeds up
    return () => clearInterval(interval);
  }, [gameOver, score, isPaused]);

  // Render grid
  const grid = Array.from({ length: GRID_SIZE }, () => Array.from({ length: GRID_SIZE }, () => "·"));
  
  snake.forEach((segment, i) => {
    if (segment.y >= 0 && segment.y < GRID_SIZE && segment.x >= 0 && segment.x < GRID_SIZE) {
      grid[segment.y]![segment.x] = i === 0 ? "O" : "o";
    }
  });

  if (food.y >= 0 && food.y < GRID_SIZE && food.x >= 0 && food.x < GRID_SIZE) {
    grid[food.y]![food.x] = "*";
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-emerald-400 p-4">
      <div className="flex justify-between w-full max-w-[20rem]">
        <span>SCORE: {score}</span>
        <span className="text-white/50 text-xs">Restart: 'r' | Exit: 'q'</span>
      </div>
      
      <div className="font-mono leading-none tracking-widest bg-black/40 p-2 rounded border border-white/10 select-none">
        {grid.map((row, y) => (
          <div key={y}>{row.map(cell => (
             <span key={Math.random()} className={cell === '*' ? 'text-red-400' : cell === '·' ? 'text-white/10' : 'text-emerald-400'}>
               {cell}
             </span>
          ))}</div>
        ))}
      </div>

      {gameOver && (
        <div className="text-red-400 animate-pulse font-bold mt-4">
          GAME OVER - Press 'r' to restart or 'q' to exit
        </div>
      )}
      {isPaused && !gameOver && (
        <div className="text-amber-400 animate-pulse mt-4">
          PAUSED
        </div>
      )}
    </div>
  );
}
