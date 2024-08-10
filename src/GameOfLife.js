import React, {useState, useEffect, useCallback} from 'react';
import {View, Button, StyleSheet, TouchableOpacity} from 'react-native';

const NUM_CELLS = 20;

const initialGrid = Array(NUM_CELLS)
  .fill(0)
  .map(() => Array(NUM_CELLS).fill(0));

const GameOfLife = () => {
  const [grid, setGrid] = useState(initialGrid);
  const [isPlaying, setIsPlaying] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  // change the state of a cell in the grid
  const toggleCell = (x, y) => {
    if (!isPlaying) {
      const newGrid = grid.map(row => [...row]);
      newGrid[x][y] = newGrid[x][y] ? 0 : 1; // Toggle cell state
      setGrid(newGrid);
    }
  };

  // Game logic to generate the next state
  const computeNextGeneration = useCallback(() => {
    const newGrid = grid.map(row => [...row]);

    for (let x = 0; x < NUM_CELLS; x++) {
      for (let y = 0; y < NUM_CELLS; y++) {
        const liveNeighbors = countLiveNeighbors(x, y);
        if (grid[x][y] === 1) {
          newGrid[x][y] = liveNeighbors === 2 || liveNeighbors === 3 ? 1 : 0; // Survive or die
        } else {
          newGrid[x][y] = liveNeighbors === 3 ? 1 : 0; // Birth
        }
      }
    }
    setGrid(newGrid);
  }, [grid]);

  // count the number of live neighbors surrounding a cell
  const countLiveNeighbors = (x, y) => {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue; // Skip the cell itself
        const newX = x + i;
        const newY = y + j;
        if (newX >= 0 && newY >= 0 && newX < NUM_CELLS && newY < NUM_CELLS) {
          count += grid[newX][newY];
        }
      }
    }
    return count;
  };

  const startGame = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      const id = setInterval(computeNextGeneration, 300);
      setIntervalId(id);
    }
  };

  const pauseGame = () => {
    if (isPlaying) {
      setIsPlaying(false);
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  const stopGame = () => {
    pauseGame();
    setGrid(initialGrid);
  };

  useEffect(() => {
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [intervalId]);

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {grid.map((row, x) => (
          <View key={x} style={styles.row}>
            {row.map((cell, y) => (
              <TouchableOpacity
                key={y}
                style={[styles.cell, cell ? styles.live : styles.dead]}
                onPress={() => toggleCell(x, y)}
                disabled={isPlaying} // Disable clicking when playing
              />
            ))}
          </View>
        ))}
      </View>
      <View style={styles.controls}>
        <Button
          title={isPlaying ? 'Pause' : 'Play'}
          onPress={isPlaying ? pauseGame : startGame}
        />
        <Button title="Stop" onPress={stopGame} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    borderWidth: 2,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 19,
    height: 19,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  live: {
    backgroundColor: 'black',
  },
  dead: {
    backgroundColor: 'white',
  },
  controls: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
  },
});

export default GameOfLife;
