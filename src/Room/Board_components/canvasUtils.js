import { Line } from 'react-konva';

const commonLineProps = ({line, scaleX, scaleY, key}) => {
  const { points, color, tool } = line;
  const formattedKey = String(key);

  return {
    key: formattedKey,
    points: [...points],
    scaleX,
    scaleY,
    stroke: color,
    strokeWidth: getLineWidth(tool),
    tension: 0.5,
    lineCap: getLineCap(tool),
    lineJoin: "round",
    globalCompositeOperation: 'source-over',
  };
};


const getLineWidth = (tool) => {
  switch (tool) {
    case 'pencil':
      return 1;
    case 'paintRoller':
      return 100;
    case 'brush':
      return 5;
    case 'biggerBrush':
      return 20;
    default:
      return 5;
  }
};

const getLineCap = (tool) => (tool === 'paintRoller' || tool === 'biggerBrush' ? 'square' : 'round');

export const renderLines = ({ lines, scaleX = 1, scaleY = 1 }) => (
  lines.map((line,index) => <Line {...commonLineProps({ line, scaleX, scaleY, key: index })} />)
);
