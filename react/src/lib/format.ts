// Like Rails' pluralize helper: pluralize(2, "review") => "2 reviews"
export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`
}

// Like Rails' Array#to_sentence: ["a", "b", "c"] => "a, b, and c"
export function toSentence(words: string[]): string {
  if (words.length <= 2) return words.join(" and ")
  return `${words.slice(0, -1).join(", ")}, and ${words[words.length - 1]}`
}
