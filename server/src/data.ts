import { PrismaClient } from "@prisma/client";
import {
  getAllMessageTextsQuery,
  getLongestMessagesQuery,
  getMostSentMessageQuery,
} from "./queries";
import { countEmojis } from "./util";

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

export async function getLongestMessages() {
  const result = await getLongestMessagesQuery();
  const trimmedResults = (result as any[]).map((msg) => ({
    ...msg,
    text: typeof msg.text === "string" ? msg.text.slice(0, 100) : msg.text,
  }));
  console.table(trimmedResults);
}

export async function getMostSentMessage() {
  getMostSentMessageQuery()
    .then((data: any) => {
      console.log("Most sent message:", data[0]);
    })
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}

export async function getEmojis() {
  const texts = await getAllMessageTextsQuery();
  const emojiStats = countEmojis(texts);
  const top = emojiStats.slice(0, 10);

  console.log("Top 10 emojis used:");
  top.forEach(([emoji, count], i) =>
    console.log(`${i + 1}. ${emoji} — ${count} times`)
  );
  return top;
}

async function getRecentMessagesForPhoneNumber(phoneNumber: string) {
  const result = await prisma.$queryRawUnsafe<
    {
      message_id: number;
      text: string | null;
      date: bigint;
      chat_identifier: string;
    }[]
  >(
    `
      SELECT
        m.ROWID AS message_id,
        m.text,
        m.date,
        c.chat_identifier
      FROM
        message m
      JOIN
        chat_message_join cmj ON cmj.message_id = m.ROWID
      JOIN
        chat c ON cmj.chat_id = c.ROWID
      WHERE
        c.chat_identifier = ?
        AND m.text IS NOT NULL
        AND m.text != ' '
        AND m.text != ''
        AND m.text != '￼'
      ORDER BY
        m.date DESC
      LIMIT 10;
      `,
    phoneNumber
  );

  console.table(result);
  return result;
}

getRecentMessagesForPhoneNumber("+15555555555");
