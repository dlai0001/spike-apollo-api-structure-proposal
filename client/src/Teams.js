import React from 'react'
import { useQuery, gql } from '@apollo/client'
import TeamDetails from './TeamDetails'

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



export default function Teams() {
    const { data } = useQuery(TeamsQuery)

    return <div>
        <h1>Teams</h1>
        {(!data || !data.teams) && <div>Loading...</div>}
        {data && data.teams && data.teams.map((team) => (
            <TeamDetails team={team}/>
        ))}
    </div>
}

