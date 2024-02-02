// Import statements
import React, { useEffect, useReducer, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import styles from '../Room.module.scss';
import { socket } from '../../socket.js';
import { usePhaseContext } from '../context.js';
import { Spinner } from 'react-bootstrap';
import DrawingTools from './DrawingTools.jsx';
import { renderLines } from './canvasUtils.js';

// Constants
const BUFFER_UPDATE_DELAY = 400;

// Reducer function to handle state updates
const artistReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_LINE':
      return { ...state, lines: [...state.lines, action.line], line: { points: [] }};
    case 'NEW_LINE':
      return { ...state, line: action.newLine };
    case 'UPDATE_LINE':
      return { ...state, line: { ...state.line, points: [...state.line.points, ...action.points] } };
    case 'RESET_BUFFER':
      return { ...state, buffer: { lg: 0, point_i: 0 } };
    case 'UPDATE_BUFFER':
      return { ...state, buffer: { ...state.buffer, point_i: action.point_i, lg: action.lg } };
    case 'SET_IS_DRAWING':
      return { ...state, isDrawing: action.isDrawing };
    case 'SET_TOOL':
      return { ...state, tool: action.tool };
    case 'SET_COLOR':
      return { ...state, color: action.color };
    case 'SET_TIMER':
      return { ...state, timer: action.timer };
    case 'SWITCH_TIMER':
      return { ...state, timer: !state.timer };
    case 'CLEAN_CANVAS':
      return { ...state, lines:[], line: { points: [] } };
    default:
      return state;
  }
};

const ArtistBoard = () => {
  // Initial state
  const initialState = {
    tool: 'brush',
    color: '#0f0f0f',
    lines:[],
    line: { points: [] },
    buffer: { lg: 0, point_i: 0 },
    isDrawing: false,
    timer: false,
  };

  const [state, dispatch] = useReducer(artistReducer, initialState);
  const { color, tool, lines, line, buffer, isDrawing, timer } = state;
  const phaseContext = usePhaseContext();
  const boardContainerRef = useRef(null);
  const stageRef = useRef(null);

  const updateBoardState = (selectedTool, selectedColor) => {
    dispatch({ type: 'SET_TOOL', tool: selectedTool });
    dispatch({ type: 'SET_COLOR', color: selectedColor });
  };
  const cleanCanvas = () => {
    dispatch({ type: 'RESET_BUFFER' });
    dispatch({ type: 'CLEAN_CANVAS' });
    socket.emit("board_client:clean_canvas");
  };
  useEffect(() => {
    // Resize handler
    const resizeHandler = () => {
      if (boardContainerRef.current && stageRef.current) {
        const { width, height } = boardContainerRef.current.getBoundingClientRect();
        stageRef.current.width(width);
        stageRef.current.height(height);
        socket.emit("board_client:canvas_size", {width,height});
      }
    };
    resizeHandler();
    dispatch({ type: 'RESET_BUFFER' });
    dispatch({ type: 'CLEAN_CANVAS' });
  }, [phaseContext]);
 


useEffect(() => {
  const newLinesCheck = ({ lg, point_i }, callback) => {
    let linesArr = [...lines.slice(lg)];

    if (line.points.length > 3) {
        linesArr = [...linesArr, line];
    }
    if (linesArr.length === 0) {
        return callback({
            success: false,
            message: 'There is no new Lines.',
        });
    }

    linesArr[0] = { ...linesArr[0], points: linesArr[0].points.slice(point_i) };
 
    linesArr.forEach((line, index) => {
       if (line.points.length < 4) {
            return callback({
                success: false,
                message: 'Added empty line',
            });
        }
    });

    return callback({
        success: true,
        message: 'There are new lines, and they are clean.',
        linesArr,
    });
  };
  if((lines.length>buffer.lg || line.points.length > 3)){
    newLinesCheck(buffer, (result) => {
     if (result.success) {
          socket.emit("board_client:add_buffer_points", { buffer, linesArr: result.linesArr });
          dispatch({ type: 'UPDATE_BUFFER', lg: lines.length, point_i: line.points.length });
      }
     });
  }
}, [ timer ]);
useEffect(()=>{
  if (phaseContext.phase === 2 && !phaseContext.loading) {
      const timer = setInterval(() => {
        dispatch({ type: 'SWITCH_TIMER' });
      }, BUFFER_UPDATE_DELAY);
  
      return () => clearInterval(timer);
  }else{
    dispatch({ type: 'SET_TIMER', timer: false });
  }
},[phaseContext]);

  const handleMouseDown = (e) => {
    // Mouse down handler logic
    dispatch({ type: 'SET_IS_DRAWING', isDrawing: true });
    const pos = e.target.getStage().getPointerPosition();
    const newLine = { color, tool, points: [Math.floor(pos.x), Math.floor(pos.y)] };
    dispatch({ type: 'NEW_LINE', newLine });
  };

  const handleMouseMove = (e) => {
    // Mouse move handler logic
    if (!isDrawing) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const x = Math.floor(point.x);
    const y = Math.floor(point.y);
    const dx = Math.abs(point.x - line.points[line.points.length - 2]);
    const dy = Math.abs(point.y - line.points[line.points.length - 1]);

    if (dx >= 8 || dy >= 8) {
      dispatch({ type: 'UPDATE_LINE', points: [x, y] });
    }
  };

  const handleMouseUp = () => {
    // Mouse up handler logic
    if(state.isDrawing){
      dispatch({ type: 'SET_IS_DRAWING', isDrawing: false });
      if (line.points.length > 3) {
        dispatch({ type: 'ADD_LINE', line });
      }  
    } 
  };

  const handleMouseLeave = () => {
    if(state.isDrawing){
      dispatch({ type: 'SET_IS_DRAWING', isDrawing: false });
      if (line.points.length > 3) {
        dispatch({ type: 'ADD_LINE', line });
      }  
    }
  };
  return (
    <>
      <div className={`${styles.boardContainer} ${phaseContext.phase === 2 ? 'no-scroll' : ''}`} ref={boardContainerRef}>
          {phaseContext.loading ? (
            <Spinner
              as="span"
              animation="border"
              size="lg"
              role="status"
              aria-hidden="true"
              variant="info"
            />
          )  : (
          <Stage ref={stageRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
            className={isDrawing ? 'no-scroll' : ''}
           >
            <Layer>
              {renderLines({lines:[...lines, line]})}
            </Layer>
          </Stage>
        )}
      </div>
      <div className={styles.toolsContainer}>
        {!phaseContext.loading && <DrawingTools updateBoardState={updateBoardState} cleanCanvas={cleanCanvas} />}
      </div>
    </>
  );
};


export default ArtistBoard;
