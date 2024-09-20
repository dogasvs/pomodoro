import { useEffect, useRef, useState } from 'react'
import './App.css'

const buttons = ['pomodoro', 'short break', 'long break'];

function App() {
  const [settings, setSettings] = useState({
    pomodoro: '25:00',
    shortBreak: '5:00',
    longBreak: '15:00'
  });

  const [selectedMode, setSelectedMode] = useState('pomodoro');

  return (
    <div className='container'>
      <Header />
      <Nav  selectedMode={selectedMode} setSelectedMode={setSelectedMode}/>
      <Main settings={settings} selectedMode={selectedMode} />
      <Settings setSettings={setSettings} settings={settings}/>
    </div>
  )
}

function Header() {
  return (
    <div className='header'>
      <h1>pomodoro</h1>
    </div>
  )
}

function Nav({selectedMode, setSelectedMode}) {

  return (
    <div className='nav'>
    {buttons.map((btn, i) => (
      <button
        key={i}
        className={selectedMode === btn ? 'selected' : ''}
        onClick={() => setSelectedMode(btn)}>
        {btn}
      </button>
    ))}
    </div>
  )
}

function Main({settings, selectedMode}) {
  const [timer, setTimer] = useState('');
  const [running, setrunning] = useState(false);

  useEffect(() => {
    let interval;
    let minutes = +String(timer).split(':')[0];
    let seconds = +String(timer).split(':')[1];
    if(running) {
      interval = setInterval(() => {
        if(seconds === 0) {
          if(minutes === 0) {
            clearInterval(interval);
            setrunning(false);
            return;
          }
          seconds = 59;
          minutes--;
        } else {
          seconds--;
        } 
        setTimer(`${minutes} : ${seconds < 10 ? "0" + seconds : seconds} `);
      }, 1000)
    }
    return () => clearInterval(interval);
  }, [running, settings]);

  useEffect(() => {
    if(selectedMode === 'pomodoro') {
      setTimer(settings.pomodoro);
    } else if(selectedMode === 'short break') {      
      setTimer(settings.shortBreak);
    } else if(selectedMode === 'long break') {
      setTimer(settings.longBreak);
    }
    setrunning(false);
  }, [settings, selectedMode])

  function handleRunning() {
    setrunning(!running);
  }

  return (
    <div className='main'>
      <div className="timerControls">
        <div className='timer'>{timer}</div>
        <button className='mainStarBtn' onClick={handleRunning}>{running ? 'Pause' : 'Start'}</button>
      </div>
    </div>
  )
}

// <svg width="250" height="250">
//         {/* {sayım > -1 && ( */}
//         <text
//           x="50%"
//           y="50%"
//           style={{
//             fill: '#fff',
//             fontSize: '60px',
//             fontWeight: "bold",
//             transform: 'translate(0, 15px)', 
//           }}
//           dominantBaseline="middle"
//           textAnchor="middle"
//           className="progress-text">
//           {/* {count.toString().padStart(2, '0')} Sayıyı iki haneli göster */}
//         </text>
//         {/* )} */}
// </svg> 

function Settings({setSettings, settings}) {
  const ModalRef = useRef(null);
  const [pomodoro, setPomodoro] = useState(settings.pomodoro); 
  const [shortBreak, setshortBreak] = useState(settings.shortBreak); 
  const [longBreak, setlongBreak] = useState(settings.longBreak); 

  const openModal = () => {
    ModalRef.current.showModal();  
  };

  const closeModal = () => {
    ModalRef.current.close();  
  };

  function handleSaved(e) {
    e.preventDefault();
    setSettings({
      pomodoro:  pomodoro ? `${pomodoro}: 00` : pomodoro,
      shortBreak: shortBreak ?  `${shortBreak} : 00`: shortBreak,
      longBreak:  longBreak ? `${longBreak}: 00`: longBreak
    });
    closeModal();
  }

  return (
    <div className='settings'>
      <button className='settingsBtn' onClick={openModal}><img src="/img/settings.svg" alt="settings img" /></button>
      <Modal
        closeModal={closeModal}
        ModalRef={ModalRef} 
        handleSaved={handleSaved}
        setPomodoro={setPomodoro}
        setshortBreak={setshortBreak}
        setlongBreak={setlongBreak} />
    </div>
  );
}

function Modal({ closeModal, ModalRef, handleSaved, pomodoro, setPomodoro, shortBreak, setshortBreak, longBreak, setlongBreak }) {

  return (
    <dialog className='modal' ref={ModalRef}>
      <div className="modalHeader">
      <h1>Settings</h1>
      <button onClick={closeModal}> <img src="/img/closemodal.svg" alt="close modal img" /> </button>
      </div>
      <hr />
      <h3 className='modaltimeTitle'>TIME (MINUTES)</h3>
      <div className="modaltime">
        <div className="Item">
          <p>pomodoro</p>
          <input
           type="number" 
           name='pomodoro' 
           min={'0'} max={'999'} 
           value={pomodoro}
           onChange={(e) => setPomodoro(Number(e.target.value))} />
        </div>
        <div className="Item">
          <p>short break</p>
          <input type="number"
           name="shortBreak" 
           min={'0'} max={'999'} 
           value={shortBreak}
           onChange={(e) => setshortBreak(Number(e.target.value))}/>
        </div>
        <div className="Item">
          <p>long break</p>
          <input 
          type="number" 
          name="longBreak" 
          min={'0'}  max={'999'} 
          value={longBreak}
          onChange={(e) => setlongBreak(Number(e.target.value))}/>
        </div>
      </div>
      <hr />
      <div className="font">
        <h1>FONT</h1>
        <div className="fontBtn">
          <button>Aa</button>
          <button>Aa</button>
          <button>Aa</button>
        </div>
      </div>
      <hr />
      <div className="color">
        <h1>COLOR</h1>
        <div className="colorBtn">
          <button> </button>
          <button> </button>
          <button> </button>
        </div>
      </div>
      <button className='modalApplyBtn' onClick={handleSaved}>Apply</button>
    </dialog>
  )
}

export default App
