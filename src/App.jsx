import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // State variables
  const [scores, setScores] = useState([0, 0]);
  const [currentScore, setCurrentScore] = useState(0);
  const [activePlayer, setActivePlayer] = useState(0);
  const [diceNumber, setDiceNumber] = useState(1);
  const [isDiceHidden, setIsDiceHidden] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [winner, setWinner] = useState(null);
  const [showMessage, setShowMessage] = useState(false);

  // Effect para manejar el mensaje de victoria y reinicio
  useEffect(() => {
    if (winner !== null) {
      setShowMessage(true);
      // Esperar 3 segundos y reiniciar
      const timer = setTimeout(() => {
        setShowMessage(false);
        // Esperar a que termine la animación de salida
        setTimeout(initGame, 500);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [winner]);

  // Funcion para cambiar el turno del jugador activo.
  const switchPlayer = () => {
    setCurrentScore(0);
    setActivePlayer(prev => prev === 0 ? 1 : 0);
  };

  // Funcion para iniciar los valores del juego "Dados".
  const initGame = () => {
    setScores([0, 0]);
    setCurrentScore(0);
    setActivePlayer(0);
    setIsDiceHidden(true);
    setIsPlaying(true);
    setWinner(null);
  };

  // Funcion para utilizar el boton del lanzamiento del dado.
  const throwDice = () => {
    if (!isPlaying) return;

    const newDiceNumber = Math.trunc(Math.random() * 6) + 1;
    setDiceNumber(newDiceNumber);
    setIsDiceHidden(false);

    if (newDiceNumber !== 1) {
      setCurrentScore(prev => prev + newDiceNumber);
    } else {
      switchPlayer();
    }
  };

  // Funcion para agregar el score actual al score total del jugador activo.
  const holdScore = () => {
    if (!isPlaying) return;

    setScores(prevScores => {
      const newScores = [...prevScores];
      newScores[activePlayer] += currentScore;
      
      if (newScores[activePlayer] >= 100) {
        setIsPlaying(false);
        setWinner(activePlayer + 1);
        return newScores;
      }
      
      return newScores;
    });
    
    // Realizamos el cambio del juegador despues de confimar la suma del score.
    switchPlayer();
  };

  return (
    <main>
      <section className={`player player--0 ${activePlayer === 0 ? 'player--active' : ''} ${!isPlaying && scores[0] >= 100 ? 'player--winner' : ''}`}>
        <h2 className="name" id="name--0">Player 1</h2>
        <p className="score" id="score--0">{scores[0]}</p>
        <div className="current">
          <p className="current-label">Current</p>
          <p className="current-score" id="current--0">
            {activePlayer === 0 ? currentScore : 0}
          </p>
        </div>
      </section>

      <section className={`player player--1 ${activePlayer === 1 ? 'player--active' : ''} ${!isPlaying && scores[1] >= 100 ? 'player--winner' : ''}`}>
        <h2 className="name" id="name--1">Player 2</h2>
        <p className="score" id="score--1">{scores[1]}</p>
        <div className="current">
          <p className="current-label">Current</p>
          <p className="current-score" id="current--1">
            {activePlayer === 1 ? currentScore : 0}
          </p>
        </div>
      </section>

      <img 
        src={`dice-${diceNumber}.png`} 
        alt="Playing dice" 
        className={`dice ${isDiceHidden ? 'hidden' : ''}`}
      />
      <button className="btn btn--new" onClick={initGame}>🔄 New game</button>
      <button className="btn btn--roll" onClick={throwDice}>🎲 Roll dice</button>
      <button className="btn btn--hold" onClick={holdScore}>📥 Hold</button>

      {showMessage && (
        <>
          <div className="victory-overlay" />
          <div className="victory-message">
            <h1>¡Felicidades! 🎉</h1>
            <span>Jugador {winner} ha ganado</span>
          </div>
        </>
      )}
    </main>
  );
}

export default App;
