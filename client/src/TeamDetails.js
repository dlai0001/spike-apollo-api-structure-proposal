import React from 'react'
import { useMutation, gql } from '@apollo/client'

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

export default function TeamDetails({team}) {

    const [removePlayer] = useMutation(RemovePlayerMutation)

    const handleRemove = (teamId, playerId) => {
        removePlayer({
            variables: {
                teamId,
                playerId
            }
        })
        // Notice I don't have to call 'refetchQueries' or 'update' here.
        // By selecting the udpated fields, the cache is automatically updated.
    }

    return <div>
        <h3>{team.name}</h3>
        {team.players.map((player) => (
            <div>
                <h5>{player.name}</h5>
                <button onClick={() => handleRemove(team.id, player.id)}>Remove</button>
            </div>
        ))}
    </div>
}
