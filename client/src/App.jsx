
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

//components
import Header from './components/Header'
import LoginForm from './components/LoginForm'

import {  logIn, logout, getAlphabetTableAPI } from './API/Api.js'

// library

import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router'
import { useLocation } from 'react-router';



//  *****

import { Container } from "react-bootstrap";

import Timer from "./components/Timer";
import Game from "./components/Game";
 ///******** */

function App() {

  const location = useLocation();
  const [message, setMessage] = useState('')
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({})
  const [loading, setLoading] = useState(false)

  //****** */

  const [stage, setStage] = useState(1);   // controls which stage is active
  const [timerActive, setTimerActive] = useState(false);
  const [userLoaded, setUserLoaded] = useState(false);
  const [gameResult, setGameResult] = useState(null); // correct / wrong / win / timeout / abort
  const [gameData, setGameData] = useState(null);
  const [onTimeUpHandler, setOnTimeUpHandler] = useState(null);
  const isInGamePage = location.pathname === "/" ;
  const showHeader = location.pathname !== "/login";
  const [alphabetTable, setAlphabetTable] = useState({});

  const update_gamePlayed = (game_played) => setUser((u) => ({ ...u, game_played }));


  useEffect(() => {
    async function fetchAlphabet() {
      try {
        const table = await getAlphabetTableAPI();
        setAlphabetTable(table);
      } catch (err) {
        console.error(err);
      }
    }
    fetchAlphabet();
  }, []);


  // login

  const handleLogin = async (credentials) => {
    try {
      const loginUser = await logIn(credentials);
      setUser(loginUser);
      setLoggedIn(true);
      setUserLoaded(true);
      setMessage({ msg: `🎉 Welcome, ${loginUser.username}!`, type: 'success' });      
    } catch (err) {
      setMessage({ msg: err, type: 'danger' })
    }

  }

  // logout

  const handleLogout = async () => {
    await logout();
    setLoggedIn(false);
    setMessage('');
  }


  useEffect(() => {
    if (message && message.msg) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  // controlled function for state variable change suggested by professor

  const stage_set = (n) => setStage(n);
  const set_time = (flag) => setTimerActive(flag);
  const set_gameData = (e)=> setGameData(e);
  const set_user = (u)=> setUser(u);

  return (
    <>
    {message && message.msg && (
      <div className={`custom-alert alert-${message.type}`}>
        {message.msg}
      </div>
    )}



    {loading ? (
      <div>...page loading...</div>
    ):
    <>
    {showHeader && <Header user={user} loggedIn={loggedIn} handleLogout={handleLogout} gameActive={isInGamePage && stage === 3 } />}

      <Container fluid className="p-0">
      {timerActive && stage === 3 && <Timer duration={60} onTimeout={() => {
          if (onTimeUpHandler) {
                onTimeUpHandler(); // calls Stage3's onTimeUp
               }}   
       }/> 
      }

    <Routes>
      <Route path="/" element={
            <Game
              stage={stage}
              setStage={stage_set}
              setTimerActive={set_time}
              loggedIn={loggedIn}
              user={user}
              setUser={setUser}
              gameResult={gameResult}
              setGameResult={setGameResult}
              userLoaded={userLoaded}
              gameData={gameData}
              setGameData= {set_gameData}
              setOnTimeUpHandler={setOnTimeUpHandler}
              alphabetTable={alphabetTable}
              onGameQuantityUpdate={update_gamePlayed}

            />
        } />

          <Route path="login" element={loggedIn ? <Navigate replace to='/' /> : <LoginForm handleLogin={handleLogin} />} />
    
    </Routes> 
    </Container>
    </>


    }
      
    </>
  )
}

export default App
