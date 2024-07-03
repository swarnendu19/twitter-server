import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
import cors from "cors"
import createApolloGraphqlServer from "./graphql";
import JWTService from "../services/jwt";

export async function initServer() {
    const app = express();

    app.use(bodyParser.json());
    app.use(cors())
    
     
    const graphqlServer = await createApolloGraphqlServer();
    app.use('/graphql', expressMiddleware(graphqlServer,{
        context: async({req,res})=>{
            return{
                user:req.headers.authorization ? JWTService.decodeToken(req.headers.authorization.split("Bearer ")[1]): undefined
            }
        }
    }));

    return app;
}

initServer();
