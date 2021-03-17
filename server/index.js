const { ApolloServer, gql, ApolloError } = require('apollo-server');
const shortUuid = require('short-uuid')

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.  
  
  type Player {
      id: ID
      name: String
  }

  type Team {    
    id: ID
    name: String
    players: [Player]
  }

  type TeamRemovePlayerPayload {
    mutationId: String
    team: Team
  }

  type TeamOps {
    removePlayer(playerId: ID): TeamRemovePlayerPayload
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    teams: [Team]
  }  

  type Mutation {
    team(teamId:ID): TeamOps
  }
`;


const teams = [
  {
    id: '1',
    name: 'Mushroom Kingdom',
    players: [
      { id: '1', name: 'Mario' },
      { id: '2', name: 'Luigi' },
      { id: '3', name: 'Princess' },
      { id: '4', name: 'Toad' },
    ],
  },
  {
    id: '2',
    name: 'Koopas',
    players: [
      { id: '5', name: 'Bowser' },
      { id: '6', name: 'Roy Jr.' },
      { id: '7', name: 'Wendy' },
      { id: '8', name: 'Larry' },
    ],
  },
];

const removePlayer = (team, playerId, mutationId) => {  

  const player = team.players.find(x => x.id === playerId)  
  if(!player) {
    throw new ApolloError('Player not found', '404-101')
  }
  console.info({
    mutationId,
    message: 'removing player',
    playerId: player.id
  })
  const playerIndex = team.players.indexOf(player)  
  team.players.splice(playerIndex, 1)

  console.info({
    mutationId,
    message: 'removed player',
    playerId: player.id
  })
}

const TeamOps = (_, {teamId}) => {
  const team = teams.find(x => x.id === teamId)
  
  return {
    removePlayer: ({playerId}) => { 
      const mutationId = shortUuid.generate()  
      removePlayer(team, playerId, mutationId)

      return {
        mutationId,
        team,
      }
    }
  }
}

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    teams: () => {
      return teams
    }
  },
  Mutation: {
    team: TeamOps,
  }
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

