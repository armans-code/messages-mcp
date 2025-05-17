import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getLongestMessagesQuery() {
  const results = await prisma.$queryRaw`
      SELECT
        ROWID,
        text,
        length(text) AS text_length,
        is_from_me,
        datetime(date + strftime('%s','2001-01-01'), 'unixepoch') AS human_date
      FROM
        message
      WHERE
        text IS NOT NULL
      ORDER BY
        text_length DESC
      LIMIT 10;
    `;

  return results;
}

export async function getMostSentMessageQuery() {
  const result = await prisma.$queryRaw`
      SELECT
        text,
        COUNT(*) AS count
      FROM
        message
      WHERE
        is_from_me = 1
        AND text IS NOT NULL
        AND text != ' '
        AND text != ''
        AND text != '￼'
      GROUP BY
        text
      ORDER BY
        count DESC
      LIMIT 1;
    `;

  return result;
}

export async function getAllMessageTextsQuery(): Promise<string[]> {
  const results = await prisma.$queryRaw<{ text: string | null }[]>`
      SELECT text
      FROM message
      WHERE text IS NOT NULL
    `;
  return results.map((r) => r.text ?? "");
}
