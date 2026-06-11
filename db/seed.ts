import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { sampleData } from "./sample-data";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {


    // Delete existing products
    await prisma.author.deleteMany();
    await prisma.genre.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    await prisma.verificationToken.deleteMany();

    // Derive and insert unique authors
    const authorsMap = new Map<string, string | null>();
    sampleData.products.forEach((product) => {
      if (!authorsMap.has(product.author)) {
        authorsMap.set(product.author, product.images[0] || null);
      }
    });

    const authorsData = Array.from(authorsMap.entries()).map(([name, image]) => ({
      name,
      image,
      bio: `Writer of standard literary works, including publications featured in Milestone Books.`,
    }));

    await prisma.author.createMany({
      data: authorsData,
    });

    // Derive and insert unique genres
    const genresSet = new Set<string>();
    sampleData.products.forEach((product) => {
      product.genres.forEach((genre) => genresSet.add(genre));
    });

    const genresData = Array.from(genresSet).map((name) => ({
      name,
    }));

    await prisma.genre.createMany({
      data: genresData,
    });

    // Insert sample data
    await prisma.product.createMany({
      data: sampleData.products,
    });
    await prisma.user.createMany({
      data: sampleData.users,
    });
    // await prisma.account.createMany({
    //   data: sampleData.accounts,
    // });
    // await prisma.product.createMany({
    //   data: sampleData.products,
    // });
    // await prisma.product.createMany({
    //   data: sampleData.products,
    // });



  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main()
  .then(async () => {
    process.exit(0);
  })
  .catch(async (error) => {
    console.error(error);
    process.exit(1);
  });
