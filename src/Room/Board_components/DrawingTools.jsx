import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faPaintBrush, faTrashCan, faPaintRoller, faBrush } from '@fortawesome/free-solid-svg-icons';
import styles from '../Room.module.scss';

const ToolButton = ({ tool, selectedTool, onClick, getToolIcon }) => (
  <div className={styles.toolContainer}>
    <button
      className={styles.toolButton}
      onClick={() => onClick(tool)}
      style={{
        border: selectedTool === tool ? 'hotpink 2px solid' : '',
        backgroundColor: selectedTool === tool ? '#e6e6fa' : '',
        color: selectedTool === tool ? 'black' : 'white',
      }}
    >
      {getToolIcon(tool)}
    </button>
  </div>
);

const ColorButton = ({ color, selectedColor, onClick }) => (
  <div  
    className={styles.colorButtonContainer}
    onClick={() => onClick(color)}
    style={{
      backgroundColor: selectedColor === color ? 'lightblue' : '',
    }}
  >
    <button
      className={styles.colorButton}
      style={{
        backgroundColor: color,
      }}
    ></button>
  </div>
);

const DrawingTools = ({ updateBoardState, cleanCanvas}) => {
  const [selectedTool, setSelectedTool] = useState('brush');
  const [selectedColor, setSelectedColor] = useState('#0f0f0f');

  const handleToolClick = (tool) => {
    setSelectedTool(tool);
    updateBoardState(tool, selectedColor);
  };

  const handleColorClick = (color) => {
    setSelectedColor(color);
    updateBoardState(selectedTool, color);
  };
  const handleTrashClick = () => {
    cleanCanvas();
  };

  const getToolIcon = (tool) => {
    switch (tool) {
      case 'pencil':
        return <FontAwesomeIcon icon={faPencilAlt} />;
      case 'brush':
        return <FontAwesomeIcon icon={faPaintBrush} />;
      case 'biggerBrush':
        return <FontAwesomeIcon icon={faBrush} />;
      case 'paintRoller':
        return <FontAwesomeIcon icon={faPaintRoller} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className={styles.brushesContainer}>
        <div className={styles.toolContainer}>
          <button onClick={handleTrashClick} className={styles.trashButton}>
            <FontAwesomeIcon icon={faTrashCan} />
          </button>
        </div>
        <ToolButton tool="pencil" selectedTool={selectedTool} onClick={handleToolClick} getToolIcon={getToolIcon} />
        <ToolButton tool="brush" selectedTool={selectedTool} onClick={handleToolClick} getToolIcon={getToolIcon} />
        <ToolButton tool="biggerBrush" selectedTool={selectedTool} onClick={handleToolClick} getToolIcon={getToolIcon} />
        <ToolButton tool="paintRoller" selectedTool={selectedTool} onClick={handleToolClick} getToolIcon={getToolIcon} />
      </div>
      <div className={styles.colorsContainer}>
        <ColorButton color="#0f0f0f" selectedColor={selectedColor} onClick={handleColorClick} />
        <ColorButton color="#ccc" selectedColor={selectedColor} onClick={handleColorClick} />
        <ColorButton color="white" selectedColor={selectedColor} onClick={handleColorClick} />
        <ColorButton color="#0caaad" selectedColor={selectedColor} onClick={handleColorClick} />
        <ColorButton color="#d94948" selectedColor={selectedColor} onClick={handleColorClick} />
        <ColorButton color="#24a15d" selectedColor={selectedColor} onClick={handleColorClick} />
        <ColorButton color="#b787c5" selectedColor={selectedColor} onClick={handleColorClick} />
        <ColorButton color="#fe68b0" selectedColor={selectedColor} onClick={handleColorClick} />
        <ColorButton color="#f0c00d" selectedColor={selectedColor} onClick={handleColorClick} />
        <ColorButton color="#ff9447" selectedColor={selectedColor} onClick={handleColorClick} />
        <ColorButton color="#655446" selectedColor={selectedColor} onClick={handleColorClick} />
      </div>
    </>
  );
};

export default DrawingTools;