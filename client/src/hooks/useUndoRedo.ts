import { useState, useCallback, useRef } from 'react';

interface UndoRedoState<T> {
  history: T[];
  currentIndex: number;
}

export function useUndoRedo<T>(initialState: T, maxHistorySize: number = 50) {
  const [state, setState] = useState<UndoRedoState<T>>({
    history: [initialState],
    currentIndex: 0
  });
  
  const timeoutRef = useRef<NodeJS.Timeout>();

  const saveToHistory = useCallback((newState: T, debounceMs: number = 300) => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce rapid changes (like dragging)
    timeoutRef.current = setTimeout(() => {
      setState(prevState => {
        // Don't save if state hasn't changed
        const currentState = prevState.history[prevState.currentIndex];
        if (JSON.stringify(currentState) === JSON.stringify(newState)) {
          return prevState;
        }

        // Remove future history if we're not at the end
        const newHistory = prevState.history.slice(0, prevState.currentIndex + 1);
        
        // Add new state
        newHistory.push(newState);
        
        // Limit history size
        if (newHistory.length > maxHistorySize) {
          newHistory.shift();
          return {
            history: newHistory,
            currentIndex: newHistory.length - 1
          };
        }
        
        return {
          history: newHistory,
          currentIndex: newHistory.length - 1
        };
      });
    }, debounceMs);
  }, [maxHistorySize]);

  const undo = useCallback(() => {
    setState(prevState => {
      if (prevState.currentIndex > 0) {
        return {
          ...prevState,
          currentIndex: prevState.currentIndex - 1
        };
      }
      return prevState;
    });
  }, []);

  const redo = useCallback(() => {
    setState(prevState => {
      if (prevState.currentIndex < prevState.history.length - 1) {
        return {
          ...prevState,
          currentIndex: prevState.currentIndex + 1
        };
      }
      return prevState;
    });
  }, []);

  const canUndo = state.currentIndex > 0;
  const canRedo = state.currentIndex < state.history.length - 1;
  const currentState = state.history[state.currentIndex];

  return {
    currentState,
    saveToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    historyLength: state.history.length,
    currentIndex: state.currentIndex
  };
}