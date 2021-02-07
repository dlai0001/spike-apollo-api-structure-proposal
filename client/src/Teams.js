import React from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'

const TeamsQuery = gql`
    query {
        teams {
            id
            name
            players {
            id
            name
            }
        }
    }
`

const RemovePlayerMutation = gql`
    mutation removePlayer($teamId: ID, $playerId: ID) {
        team(teamId: $teamId) {
            removePlayer(playerId: $playerId) {
                id
                players {
                    id
                }
            }
        }
    }
`

export default function Teams() {
    const { data } = useQuery(TeamsQuery)
    const [removePlayer] = useMutation(RemovePlayerMutation)

    const handleRemove = (teamId, playerId) => {
        removePlayer({
            variables: {
                teamId,
                playerId
            }
        })
    }

    return <div>
        <h1>Teams</h1>
        {(!data || !data.teams) && <div>Loading...</div>}
        {data && data.teams && data.teams.map((team) => (
            <div>
                <h3>{team.name}</h3>
                {team.players.map((player) => (
                    <div>
                        <h5>{player.name}</h5>
                        <button onClick={() => handleRemove(team.id, player.id)}>Remove</button>
                    </div>
                ))}
            </div>
        ))}
    </div>
}