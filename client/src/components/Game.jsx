
import Stage1 from "./stages/Stage1";
import Stage2 from "./stages/Stage2";
import Stage3 from "./stages/Stage3";
import Stage4 from "./stages/Stage4";
import '.././index.css';


function Game({ stage, setStage, setTimerActive, loggedIn, user,setUser, gameResult, setGameResult, userLoaded, setGameData, gameData ,setOnTimeUpHandler,alphabetTable, onGameQuantityUpdate}) {


  const registerTimeUp = (callback) => {
  setOnTimeUpHandler(() => callback);
  };


  const updateCoins = (coins) => setUser((u) => ({ ...u, coins }));

  const handleFinish = (result ) => {
    setGameResult(result);

  };


  return (
    <div className="game-wrapper">
      {stage === 1 && <Stage1 onNext={() => setStage(2)} loggedIn={loggedIn} user={user} />}


      {stage === 2 && (
        <Stage2
          loggedIn={loggedIn}
          user={user}
          userLoaded={true}
          setGameData={setGameData}
          onStart={() => {
            setStage(3);
            setTimerActive(true); // start timer from App.jsx
          }}
        />
      )}



      {stage === 3 && !gameResult && (
        <Stage3
          loggedIn={loggedIn}
          user={user}
          setUser={setUser}
          setStage={setStage}
          gameId={gameData?.gameId}
          miniGameId={gameData?.miniGameId}
          initialString={gameData?.string}
          setTimerActive= {setTimerActive}
          onCoinsUpdate={updateCoins}
          onGameQuantityUpdate={onGameQuantityUpdate}
          onFinish={handleFinish}
          onTimeUpSignal={registerTimeUp}
          alphabetTable={alphabetTable}
        />
      )}

      {/* stage === 4 && */ gameResult && (
        <Stage4
          loggedIn={loggedIn}
          gameResult={gameResult}
          onPlayAgain={() => {
          setGameResult(null);
          setStage(1);
          }}    
        />
      )}

      
    </div>
  );
}

export default Game;
