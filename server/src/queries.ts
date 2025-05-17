import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getOutboundMessages({ take = 10 }: { take?: number }) {
  const messages = await prisma.message.findMany({
    select: {
      text: true,
    },
    where: {
      is_from_me: 1,
      text: {
        not: null,
      },
    },
    orderBy: {
      date: "desc",
    },
    take,
  });
  return messages;
}
