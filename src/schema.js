const { GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLBoolean } = require('grahpql');

module.exports = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});
