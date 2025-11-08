import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getRequests = async (req, res) => {
  const users = await prisma.user.findMany({ where: { isApproved: false } });
  res.json(users);
};

export const approveUser = async (req, res) => {
  const { id } = req.params;
  await prisma.user.update({ where: { id: Number(id) }, data: { isApproved: true } });
  res.json({ message: "User approved" });
};

export const declineUser = async (req, res) => {
  const { id } = req.params;
  await prisma.user.delete({ where: { id: Number(id) } });
  res.json({ message: "User declined and removed" });
};
