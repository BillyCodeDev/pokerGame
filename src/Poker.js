import React, { useState } from 'react';

const refreshPage = () => {
  window.location.reload();
};

const symboles = ['C', 'D', 'H', 'S'];
const ranks = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const generateDeck = () => {
  const deck = [];
  for (const rank of ranks) {
    for (const symbole of symboles) {
      deck.push(`${rank}-${symbole}`);
    }
  }
  return deck;
};

const evaluateHand = (hand) => {
  const rankCounts = {};
  hand.forEach(card => {
    const rank = card.split('-')[0];
      rankCounts[rank] = (rankCounts[rank] || 0) + 1;
  });

  const counts = Object.values(rankCounts).sort((a, b) => b - a);
  
  if (counts[0] === 4) return { result: 'Carré', score: 4 };
  if (counts[0] === 3) return { result: 'Brelan', score: 3 };
  if (counts[0] === 2 && counts[1] === 2) return { result: 'Double Paire', score: 2 };
  if (counts[0] === 2) return { result: 'Paire', score: 1 };

  const highCard = hand.map(card => card.split('-')[0])
                        .sort((a, b) => ranks.indexOf(b) - ranks.indexOf(a))[0];
  return { result: `Aucune annonce. Carte forte: ${highCard}`, score: 0 };
};

const Poker = () => {
  const [playerHand, setPlayerHand] = useState([]);
  const [computerHand, setComputerHand] = useState([]);
  const [result, setResult] = useState('');
  const [winner, setWinner] = useState('');
  const [playerWins, setPlayerWins] = useState(0);
  const [computerWins, setComputerWins] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const dealHands = () => {
    if (gameOver) return; // Ne pas distribuer si le jeu est terminé

    const deck = generateDeck();
    const shuffledDeck = deck.sort(() => Math.random() - 0.5);
    
    const newPlayerHand = shuffledDeck.slice(0, 4);
    const newComputerHand = shuffledDeck.slice(4, 8);
    
    setPlayerHand(newPlayerHand);
    setComputerHand(newComputerHand);

    const playerEvaluation = evaluateHand(newPlayerHand);
    const computerEvaluation = evaluateHand(newComputerHand);
    
    setResult(`Joueur: ${playerEvaluation.result} | Ordinateur: ${computerEvaluation.result}`);

    if (playerEvaluation.score > computerEvaluation.score) {
      setWinner('Le Joueur a gagné !');
      setPlayerWins(prevWins => {
        const newWins = prevWins + 1;
        if (newWins === 3) {
          setGameOver(true);
          setWinner('Le Joueur a remporté 3 victoires !');
        }
        return newWins;
      });
    } else if (playerEvaluation.score < computerEvaluation.score) {
      setWinner('L\'Ordinateur a gagné !');
      setComputerWins(prevWins => {
        const newWins = prevWins + 1;
        if (newWins === 3) {
          setGameOver(true);
            setWinner('L\'Ordinateur a remporté 3 victoires !');
        }
        return newWins;
      });
    } else {
      setWinner('Match nul !');
    }
  };
    
    
return (
    
      <>
          
      <h1 className='title'>Simple Poker</h1>
      <button onClick={dealHands} className='startButton' disabled={gameOver}>Let's start</button>
      <div className='gamePad'>
        <div className='playerCards'>
          <h2 id='handGamer'>Main du Joueur:</h2>
          <div style={{ display: 'flex' }}>
            {playerHand.map((card, index) => (
              <img 
                key={index} 
                src={`${process.env.PUBLIC_URL}/images/${card}.png`} 
                alt={card} 
                style={{ width: '100px', margin: '5px' }} 
              />
            ))}
          </div>
        </div>

        <div className='table'></div>
        
        <div className='ordiCards'>
          <h2 id='handComputer'>Main de l'Ordinateur:</h2>
          <div style={{ display: 'flex' }}>
            {computerHand.map((card, index) => (
              <img 
                key={index} 
                src={`${process.env.PUBLIC_URL}/images/${card}.png`} 
                alt={card} 
                style={{ width: '100px', margin: '5px' }} 
              />
            ))}
          </div>
        </div>
      </div>

      <h2>Résultat: {result}</h2>
      <h2>{winner}</h2>
          <h2>Victoire du Joueur: {playerWins} | Victoire de l'Ordinateur: {computerWins}</h2>
           
      <button className="restartButton" onClick={refreshPage}>Another one ?</button>
  
    </>
  );
};

export default Poker;





  