import { ApolloServer } from "@apollo/server";
import { User } from "../user";
import { prismaClient } from "../../clients/db";
import { GraphqlContext } from "../../interface";

async function createApolloGraphqlServer(){
    const graphqlServer = new ApolloServer<GraphqlContext>({
        typeDefs: `
            ${User.types}
            type Query {
                ${User.queries}
            }
            type Mutation {
                createUser(email: String!, password: String!, firstName: String!, lastName: String!): Boolean
            }
        `,
        resolvers: {
            Query: {
                ...User.resolvers.queries
             },
            Mutation: {
                createUser: async (_, { firstName, lastName, email, password }: { firstName: string, lastName: string, email: string, password: string }) => {
                    await prismaClient.user.create({
                        data: {
                            email,
 
                            lastName,
                            firstName,
                        }
                    });
                    return true;
                }
            }
        }
    });

    await graphqlServer.start();
    return graphqlServer;
}

export default createApolloGraphqlServer;