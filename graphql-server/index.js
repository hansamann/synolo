

const path = require('path');
const { GraphQLServer } = require('graphql-yoga')
const { fileLoader, mergeTypes, mergeResolvers  } = require('merge-graphql-schemas');
 
const typesArray = fileLoader(path.join(__dirname, './types'));
const resolversArray = fileLoader(path.join(__dirname, './resolvers'));
 
console.log("--- MERGED SCHEMA ---");
let mergedSchema = mergeTypes(typesArray, { all: true })
console.log(mergedSchema);
console.log("--- MERGED SCHEMA ---")

const server = new GraphQLServer({
  typeDefs: mergeTypes(typesArray, { all: true }),
  resolvers: mergeResolvers(resolversArray)
})

server.start( () => {
  console.log(`Server is running on http://localhost:4000`)
})