
const ColoredTitle = () => {
  const text = "DoodleWords";

  const getLetterStyle = (letter, index) => {
    const colors = [
      'var(--blue)',
      'var(--red)',
      'var(--green)',
      'var(--purple)',
      'var(--pink)',
      'var(--yellow)',
    ];
    const fontSize = `${48 + index}px`;
    const fontWeight = index % 2 === 0 ? 'bold' : 'normal'; 
    const color = colors[ (index % colors.length)];
    const fontFamily = 'Rubik';
    return { color, fontSize, fontWeight, fontFamily };
  };

  const renderColoredText = () => {
    return text.split("").map((letter, index) => (
      <span key={index} style={getLetterStyle(letter, index)}>
        {letter}
      </span>
    ));
  };

  return <h2>{renderColoredText()}</h2>;
};

export default ColoredTitle;