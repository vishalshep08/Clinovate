import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const run = async () => {
  const students = await prisma.student.findMany({
    select: { id: true, email: true, otp: true },
  });
  console.table(students);
  process.exit();
};

run();
