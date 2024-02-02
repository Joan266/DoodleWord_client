// Import statements
import React from 'react';
import { useUserContext, usePhaseContext, useGameContext } from '../context.js';
import NonArtistBoard from '../Board_components/NonArtistBoard.jsx';
import ArtistBoard from '../Board_components/ArtistBoard.jsx';

const Board = () => {
  const user = useUserContext();
  const { artistId } = useGameContext();
  const { phase } = usePhaseContext();
  const isGameArtist = user._id === artistId;
  const shouldRenderArtistBoard = phase === 2 && isGameArtist;
  return (
    shouldRenderArtistBoard ? (
      <ArtistBoard />
    ) : (
      <NonArtistBoard />
    )
  );
};


export default Board;
