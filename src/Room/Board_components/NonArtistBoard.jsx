// Import statements
import React, { useEffect, useReducer, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import { socket } from '../../socket.js';
import { usePhaseContext } from '../context.js';
import { renderLines } from './canvasUtils.js';
import styles from '../Room.module.scss';
import { Spinner } from 'react-bootstrap';

// Reducer function to handle state updates
const nonArtistReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_LINES':
      const { updatedLines } = action;
      return {
        ...state,
        lines: updatedLines 
      };
    case 'CLEAN_CANVAS':
      return { ...state, lines:[] };
    case 'SET_CANVAS_SCALE':
    return { ...state,  scaleX: action.scaleX, scaleY: action.scaleY, };
    default:
      return state;
  }
};

const NonArtistBoard = () => {
  const initialState = {
    lines:[],
    scaleX:1,
    scaleY:1,
  };
  const [state, dispatch] = useReducer(nonArtistReducer, initialState);
  const {  lines } = state;
  const phaseContext = usePhaseContext();
  const boardContainerRef = useRef(null);
  const stageRef = useRef(null);

  useEffect(() => {
    // Resize handler
    const resizeHandler = () => {
      if (boardContainerRef.current && stageRef.current) {
        const { width, height } = boardContainerRef.current.getBoundingClientRect();
        stageRef.current.width(width);
        stageRef.current.height(height);
      }
    };
    resizeHandler();
    dispatch({ type: 'CLEAN_CANVAS' });
  }, [phaseContext]);
useEffect(()=>{
  const handleCanvasSize = ({width,height}) => {
    if (stageRef.current) {
      const stageWidth = stageRef.current.width();
      const stageHeight = stageRef.current.height();
      const scaleX =  stageWidth/width;
      const scaleY = stageHeight/height;
      dispatch({ type: 'SET_CANVAS_SCALE', scaleX, scaleY});
    }
  }
  if (socket) {
    socket.on('board_server:canvas_size', handleCanvasSize);
  }

  return () => {
    if (socket) {
      socket.off('board_server:canvas_size', handleCanvasSize);
    }
  };
},[]);
  useEffect(()=>{
     const handleCleanCanvas = () => {
      dispatch({ type: 'CLEAN_CANVAS' });
    }
    if (socket) {
      socket.on('board_server:clean_canvas', handleCleanCanvas);
    }

    return () => {
      if (socket) {
        socket.off('board_server:clean_canvas', handleCleanCanvas);
      }
    };
  },[])
  useEffect(() => {
    const handleBoardDrawing = ({ buffer, linesArr }) => {
      let updatedLines = [];
      if (lines.length === buffer.lg) {
        updatedLines = [...lines, ...linesArr];
      } else if (lines.length > buffer.lg) {
        const combinedLines = [...lines, ...linesArr];
        const mergedPoints = [
          ...combinedLines[lines.length-1].points,
          ...combinedLines[lines.length ].points,
        ];
  
        updatedLines = [
          ...combinedLines.slice(0, lines.length-1),
          { ...combinedLines[lines.length], points: mergedPoints },
          ...combinedLines.slice(lines.length + 1),
        ];
      }else{
        return
      }
  
      dispatch({ type: 'UPDATE_LINES', updatedLines });
    };

    if (socket) {
      socket.on('board_server:add_buffer_points', handleBoardDrawing);
    }

    return () => {
      if (socket) {
        socket.off('board_server:add_buffer_points', handleBoardDrawing);
      }
    };
  }, [lines]);

  return (
    <>
      <div className={styles.boardContainer} ref={boardContainerRef}>
        { phaseContext.loading ? (
            <Spinner
              as="span"
              animation="border"
              size="lg"
              role="status"
              aria-hidden="true"
              variant="info"
            />
          ) : (
          <Stage ref={stageRef}>
            <Layer>
              {renderLines({lines, scaleX: state.scaleX, scaleY: state.scaleY})}
            </Layer>
          </Stage>
          )}
      </div>
      <div className={styles.toolsContainer}>
       </div>
    </>
  );
};


export default NonArtistBoard;
