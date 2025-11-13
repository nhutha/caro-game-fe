import React, { FC } from 'react';

interface GameBoardProps {
  boardState: (string | null)[];
  isCurrentUserTurn: boolean;
  onCellClick: (index: number) => void;
  size?: number;
}

export const GameBoard: FC<GameBoardProps> = ({
  boardState,
  isCurrentUserTurn,
  onCellClick,
  size = 15,
}) => {
  return (
    <div className="flex justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-4">
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
          {boardState.map((cell, index) => (
            <button
              key={index}
              onClick={() => onCellClick(index)}
              disabled={!isCurrentUserTurn || cell !== null}
              className={`w-12 h-12 border border-gray-300 dark:border-gray-600 rounded-md font-bold text-lg transition-all ${
                cell === 'X'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 cursor-not-allowed'
                  : cell === 'O'
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 cursor-not-allowed'
                    : isCurrentUserTurn && cell === null
                      ? 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer'
                      : 'bg-gray-50 dark:bg-gray-700 cursor-not-allowed'
              }`}
            >
              {cell}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
