import emojiRegex from "emoji-regex";

export function countEmojis(messages: string[]): [string, number][] {
  const regex = emojiRegex();
  const emojiCounts: Record<string, number> = {};

  for (const message of messages) {
    const matches = message.match(regex);
    if (!matches) continue;

    for (const emoji of matches) {
      emojiCounts[emoji] = (emojiCounts[emoji] || 0) + 1;
    }
  }

  return Object.entries(emojiCounts).sort((a, b) => b[1] - a[1]);
}
