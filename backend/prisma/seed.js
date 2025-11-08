import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = bcrypt.hashSync("Admin@123", 10);

  await prisma.admin.create({
    data: {
      email: "admin@clinovate.com",
      password: hashedPassword,
      name: "Admin",
    },
  });

  console.log("Admin created");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
