'use server'
import { PrismaClient } from "../generated/prisma/client"
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// get latest products
export async function getLatestProducts(){
      const connectionString = process.env.DATABASE_URL;
      if (!connectionString) {
        throw new Error("DATABASE_URL environment variable is not set");
      }
    
      const pool = new Pool({ connectionString });
      const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({adapter})
    try {
        const data = await prisma.product.findMany({take:5, orderBy:{createdAt:"desc"}})

        return data;
    } catch (error) {
        
    }
}