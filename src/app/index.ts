import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
import { prismaClient } from "../clients/db";
import { User } from "./user";

export async function initServer() {
    const app = express();

    app.use(bodyParser.json());
    
    const graphqlServer = new ApolloServer({
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
                            password,
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

    app.use('/graphql', expressMiddleware(graphqlServer));

    return app;
}

initServer();
