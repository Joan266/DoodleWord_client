import React from 'react';
import { useUserContext, useRoomContext, usePhaseContext, useGameContext } from "../context.js";
import styles from '../Room.module.scss'; 
const ColoredText = () => {
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
    const fontSize = `${42 + index}px`;
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
const RoomInfo = () => {
  const { code } = useRoomContext(); 
  const { name } = useUserContext();
  const { phase } = usePhaseContext();
  const {round} = useGameContext();
  const screenWidth = window.innerWidth;
  return (screenWidth > 768 || phase === 0) ? (
    <div className={styles.roomInfoContainer}>
      <div className={styles.titleContainer}>
        <ColoredText />
      </div>
      <div className={styles.infoContainer}>
        <p>Code: {code}</p>
        <p>Name: {name}</p>
        <p>Phase: {phase}</p>
        {phase !== 0 && <p>Round: {round}</p>}
      </div>
    </div>
  ) : null;
};

export default RoomInfo;
