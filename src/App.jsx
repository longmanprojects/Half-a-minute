import { useState, useEffect } from 'react'
import { playClick } from './utils/sounds.js'
import { shuffleDeck } from './data/cards.js'
import SplashScreen from './components/SplashScreen.jsx'
import HomeScreen from './components/HomeScreen.jsx'
import RulesScreen from './components/RulesScreen.jsx'
import TeamSetupScreen from './components/TeamSetupScreen.jsx'
import TargetScoreScreen from './components/TargetScoreScreen.jsx'
import WhoStartsScreen from './components/WhoStartsScreen.jsx'
import GameplayScreen from './components/GameplayScreen.jsx'
import ScoresScreen from './components/ScoresScreen.jsx'

// Bold, distinct team colours — clearly separate from app's yellow/blue palette
export const TEAM_COLORS = [
  '#E53935', // red
  '#8E24AA', // purple
  '#43A047', // green
  '#FB8C00', // orange
  '#00897B', // teal
  '#E91E8C', // pink
  '#1E88E5', // blue
  '#6D4C41', // brown
]

export const COLOR_NAMES = {
  '#E53935': 'Red',
  '#8E24AA': 'Purple',
  '#43A047': 'Green',
  '#FB8C00': 'Orange',
  '#00897B': 'Teal',
  '#E91E8C': 'Pink',
  '#1E88E5': 'Blue',
  '#6D4C41': 'Brown',
}

export function colorTeamName(color) {
  return `${COLOR_NAMES[color] ?? 'Team'} Team`
}

const DEFAULT_TEAMS = [
  { id: 1, name: colorTeamName(TEAM_COLORS[0]), color: TEAM_COLORS[0], score: 0, players: [], customName: false },
  { id: 2, name: colorTeamName(TEAM_COLORS[1]), color: TEAM_COLORS[1], score: 0, players: [], customName: false },
]

function App() {
  const [screen, setScreen] = useState('splash')

  // Global button click sound via event delegation
  useEffect(() => {
    const handler = (e) => { if (e.target.closest('button')) playClick() }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, []) // splash | home | rules | setup | target | draw | gameplay | scores
  const [teams, setTeams] = useState(DEFAULT_TEAMS)
  const [targetScore, setTargetScore] = useState(30)
  const [deck, setDeck] = useState([])
  const [cardIdx, setCardIdx] = useState(0)
  const [currentTeamIdx, setCurrentTeamIdx] = useState(0)
  const [playerIndices, setPlayerIndices] = useState({}) // { [teamId]: currentPlayerIndex }
  const [roundNumber, setRoundNumber] = useState(1)
  const [lastTurnPoints, setLastTurnPoints] = useState(0)
  const [winner, setWinner] = useState(null)
  const [turnsPlayed, setTurnsPlayed] = useState({})
  const [pendingWin, setPendingWin] = useState(false)
  const [winTriggerTeam, setWinTriggerTeam] = useState(null)

  const currentTeam = teams[currentTeamIdx]
  const currentPlayerIdx = playerIndices[currentTeam?.id] ?? 0
  const currentPlayerName = currentTeam?.players?.[currentPlayerIdx]?.name ?? ''

  const nextTeamIdxComputed = (currentTeamIdx + 1) % teams.length
  const nextTeam = teams[nextTeamIdxComputed]
  const nextPlayerIdx = playerIndices[nextTeam?.id] ?? 0
  const nextPlayerName = nextTeam?.players?.[nextPlayerIdx]?.name ?? ''

  function goHome() {
    setTeams(DEFAULT_TEAMS)
    setPlayerIndices({})
    setWinner(null)
    setPendingWin(false)
    setWinTriggerTeam(null)
    setTurnsPlayed({})
    setScreen('home')
  }

  function finishTeamSetup(configuredTeams) {
    const cleaned = configuredTeams.map(t => ({
      ...t,
      score: 0,
      players: t.players.filter(p => p.name.trim()),
    }))
    setTeams(cleaned)
    setScreen('target')
  }

  function startGame(configuredTarget) {
    const shuffled = shuffleDeck()
    const indices = {}
    const turns = {}
    teams.forEach(t => { indices[t.id] = 0; turns[t.id] = 0 })
    setTargetScore(configuredTarget)
    setDeck(shuffled)
    setCardIdx(0)
    setRoundNumber(1)
    setWinner(null)
    setPendingWin(false)
    setWinTriggerTeam(null)
    setPlayerIndices(indices)
    setTurnsPlayed(turns)
    setScreen('draw')
  }

  function beginGame(startingTeamIdx) {
    setCurrentTeamIdx(startingTeamIdx)
    setScreen('gameplay')
  }

  function endTurn(points) {
    setLastTurnPoints(points)

    const scoringTeam = teams[currentTeamIdx]
    const newTeams = teams.map((t, i) =>
      i === currentTeamIdx ? { ...t, score: t.score + points } : t
    )
    setTeams(newTeams)

    const newTurns = { ...turnsPlayed, [scoringTeam.id]: (turnsPlayed[scoringTeam.id] || 0) + 1 }
    setTurnsPlayed(newTurns)

    const turnValues = Object.values(newTurns)
    const allEqual = turnValues.every(c => c === turnValues[0])
    const anyHitTarget = newTeams.some(t => t.score >= targetScore)
    const isGameEndCondition = (pendingWin || anyHitTarget) && allEqual

    if (isGameEndCondition) {
      const best = newTeams.reduce((a, b) => b.score > a.score ? b : a)
      setWinner(best)
      setPendingWin(false)
      setWinTriggerTeam(null)
    } else if (anyHitTarget && !pendingWin) {
      setPendingWin(true)
      setWinTriggerTeam(scoringTeam)
    }

    setScreen('scores')
  }

  function nextTurn() {
    const nextIdx = (currentTeamIdx + 1) % teams.length
    // Advance the player index for the team that just played
    const playingTeam = teams[currentTeamIdx]
    if (playingTeam?.players?.length > 0) {
      const advanced = ((playerIndices[playingTeam.id] ?? 0) + 1) % playingTeam.players.length
      setPlayerIndices(p => ({ ...p, [playingTeam.id]: advanced }))
    }
    const nextCardIdx = cardIdx + 1
    if (nextCardIdx >= deck.length) {
      setDeck(shuffleDeck())
      setCardIdx(0)
    } else {
      setCardIdx(nextCardIdx)
    }
    if (nextIdx === 0) setRoundNumber(r => r + 1)
    setCurrentTeamIdx(nextIdx)
    setScreen('gameplay')
  }

  function resetToSetup() {
    setTeams(teams.map(t => ({ ...t, score: 0 })))
    setWinner(null)
    setPendingWin(false)
    setWinTriggerTeam(null)
    setTurnsPlayed({})
    setScreen('setup')
  }

  return (
    <>
      {screen === 'splash' && (
        <SplashScreen onBegin={() => setScreen('home')} />
      )}
      {screen === 'home' && (
        <HomeScreen
          onHowToPlay={() => setScreen('rules')}
          onStartGame={() => setScreen('setup')}
        />
      )}
      {screen === 'rules' && (
        <RulesScreen
          onPlay={() => setScreen('setup')}
          onHome={goHome}
        />
      )}
      {screen === 'setup' && (
        <TeamSetupScreen
          initialTeams={teams}
          teamColors={TEAM_COLORS}
          onNext={finishTeamSetup}
          onHome={goHome}
        />
      )}
      {screen === 'target' && (
        <TargetScoreScreen
          initialTarget={targetScore}
          onStart={startGame}
          onBack={() => setScreen('setup')}
          onHome={goHome}
        />
      )}
      {screen === 'draw' && (
        <WhoStartsScreen
          teams={teams}
          onBegin={beginGame}
          onHome={goHome}
        />
      )}
      {screen === 'gameplay' && (
        <GameplayScreen
          card={deck[cardIdx] || { id: -1, front: [], back: [] }}
          team={teams[currentTeamIdx]}
          playerName={currentPlayerName}
          roundNumber={roundNumber}
          onEndTurn={endTurn}
          onHome={goHome}
        />
      )}
      {screen === 'scores' && (
        <ScoresScreen
          teams={teams}
          targetScore={targetScore}
          currentTeamIdx={currentTeamIdx}
          lastTurnPoints={lastTurnPoints}
          winner={winner}
          pendingWin={pendingWin}
          winTriggerTeam={winTriggerTeam}
          turnsPlayed={turnsPlayed}
          nextTeam={nextTeam}
          nextPlayerName={nextPlayerName}
          onNext={nextTurn}
          onReset={resetToSetup}
          onHome={goHome}
        />
      )}
    </>
  )
}

export default App
