import { useState } from 'react'
import './TeamSetupScreen.css'
import HomeButton from './HomeButton.jsx'

export default function TeamSetupScreen({ initialTeams, teamColors, onNext, onHome }) {
  function withMinPlayers(players) {
    const filled = [...players]
    while (filled.length < 2) filled.push({ id: Date.now() + filled.length, name: '' })
    return filled
  }

  const [teams, setTeams] = useState(initialTeams.map(t => ({ ...t, players: withMinPlayers(t.players || []) })))
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [colorPickerId, setColorPickerId] = useState(null) // team id with open picker

  function addTeam() {
    if (teams.length >= 3) return
    const usedColors = teams.map(t => t.color)
    const nextColor = teamColors.find(c => !usedColors.includes(c)) || teamColors[teams.length % teamColors.length]
    const id = Date.now()
    setTeams([...teams, {
      id,
      name: `Team ${teams.length + 1}`,
      color: nextColor,
      score: 0,
      players: [{ id: id + 1, name: '' }, { id: id + 2, name: '' }],
    }])
  }

  function addPlayer(teamId) {
    setTeams(teams.map(t =>
      t.id === teamId
        ? { ...t, players: [...t.players, { id: Date.now(), name: '' }] }
        : t
    ))
  }

  function removePlayer(teamId, playerId) {
    const team = teams.find(t => t.id === teamId)
    if (team?.players.length <= 2) return
    setTeams(teams.map(t =>
      t.id === teamId
        ? { ...t, players: t.players.filter(p => p.id !== playerId) }
        : t
    ))
  }

  function updatePlayer(teamId, playerId, name) {
    setTeams(teams.map(t =>
      t.id === teamId
        ? { ...t, players: t.players.map(p => p.id === playerId ? { ...p, name } : p) }
        : t
    ))
  }

  function removeTeam(id) {
    if (teams.length <= 2) return
    setTeams(teams.filter(t => t.id !== id))
  }

  function startEdit(team) {
    setEditingId(team.id)
    setEditingName(team.name)
    setColorPickerId(null)
  }

  function commitEdit(id) {
    setTeams(teams.map(t => t.id === id ? { ...t, name: editingName.trim() || t.name } : t))
    setEditingId(null)
  }

  function toggleColorPicker(id) {
    setColorPickerId(prev => prev === id ? null : id)
    setEditingId(null)
  }

  function pickColor(id, color) {
    setTeams(teams.map(t => t.id === id ? { ...t, color } : t))
    setColorPickerId(null)
  }

  const canStart = teams.length >= 2 &&
    teams.every(t => t.players.filter(p => p.name.trim()).length >= 2)

  return (
    <div className="screen setup-screen" onClick={() => setColorPickerId(null)}>
      <HomeButton onHome={onHome} />

      <div className="setup-header">
        <p className="setup-step">STEP 1 OF 2</p>
        <h1 className="setup-title">THE LINEUP</h1>
        <p className="setup-sub">Who's playing?</p>
      </div>

      <div className="team-list" onClick={e => e.stopPropagation()}>
        {teams.map((team) => (
          <div className="team-card" key={team.id}>
            <div className="team-row">
              <button
                className="color-dot"
                style={{ background: team.color }}
                onClick={() => toggleColorPicker(team.id)}
                title="Choose colour"
              />
              {editingId === team.id ? (
                <input
                  className="team-name-input"
                  value={editingName}
                  autoFocus
                  onChange={e => setEditingName(e.target.value)}
                  onBlur={() => commitEdit(team.id)}
                  onKeyDown={e => e.key === 'Enter' && commitEdit(team.id)}
                  maxLength={20}
                />
              ) : (
                <button className="team-name" onClick={() => startEdit(team)}>
                  {team.name}
                  <span className="edit-hint">✎</span>
                </button>
              )}
              {teams.length > 2 && (
                <button className="remove-btn" onClick={() => removeTeam(team.id)}>✕</button>
              )}
            </div>

            {colorPickerId === team.id && (
              <div className="color-picker">
                {teamColors.map(color => (
                  <button
                    key={color}
                    className={`color-swatch ${team.color === color ? 'selected' : ''}`}
                    style={{ background: color }}
                    onClick={() => pickColor(team.id, color)}
                  />
                ))}
              </div>
            )}

            <div className="player-section">
              {team.players.map((player) => (
                <div className="player-row" key={player.id}>
                  <input
                    className="player-input"
                    value={player.name}
                    placeholder="Player name"
                    onChange={e => updatePlayer(team.id, player.id, e.target.value)}
                    maxLength={20}
                  />
                  {team.players.length > 2 && (
                    <button
                      className="player-remove-btn"
                      onClick={() => removePlayer(team.id, player.id)}
                    >✕</button>
                  )}
                </div>
              ))}
              {team.players.length < 5 && (
                <button className="add-player-btn" onClick={() => addPlayer(team.id)}>
                  + Add Player
                </button>
              )}
              {team.players.length >= 5 && (
                <p className="player-max-note">Max 5 players</p>
              )}
            </div>
          </div>
        ))}

        {teams.length < 3 && (
          <button className="add-team-btn" onClick={addTeam}>
            + ADD ANOTHER TEAM
          </button>
        )}
      </div>

      <div className="setup-footer">
        <button
          className="btn-primary"
          disabled={!canStart}
          onClick={() => onNext(teams)}
        >
          NEXT →
        </button>
      </div>
    </div>
  )
}
