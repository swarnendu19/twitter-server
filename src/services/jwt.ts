import { User } from "@prisma/client";
import { prismaClient } from "../clients/db";
import JWT from "jsonwebtoken"

const JWT_SECRET = "wew";

class JWTService{
    public static async generateTokenForUser(user:User){
 
        const payload = {
            id: user?.id,
            email: user?.email
        };
        const token = JWT.sign(payload,JWT_SECRET);
        return token;
    }
}

export default JWTService