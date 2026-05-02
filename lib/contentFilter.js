// Add new blocked words here
export const BLOCKED_WORDS = [
  // ── Core profanity ──────────────────────────────────────────────────────────
  'fuck', 'fucker', 'fuckface', 'fuckhead', 'motherfucker', 'clusterfuck',
  'dumbfuck', 'mindfuck', 'godfuck',
  'shit', 'bullshit', 'horseshit', 'shithead', 'shitstain', 'dipshit',
  'apeshit', 'bitchass',
  'bitch', 'bitches',
  'cunt', 'cunts',
  'pussy', 'pussies',
  'dick', 'dicks',
  'cock', 'cocks',
  'ass', 'arse', 'asshole', 'arsehole', 'asshat', 'asswipe', 'jackass',
  'smartass', 'dumbass', 'badass', 'halfass',
  'piss', 'pisser',
  'prick', 'pricks',
  'twat', 'twats',
  'bastard', 'bastards',
  'whore', 'whores',
  'slut', 'sluts',
  'wank', 'wanker', 'wankers',
  'cum', 'jizz', 'spunk',
  'boner', 'erection',
  'fap',

  // ── Phrases ─────────────────────────────────────────────────────────────────
  'piece of shit', 'suck my', 'suck ass', 'sucks ass', 'this is ass',
  'go fuck', 'get fucked', 'fuck you', 'fuck off', 'fuck this',
  'shut the fuck', 'what the fuck',
  'jack off', 'jerk off',
  'kill yourself', 'go die', 'kys', 'wtf', 'stfu', 'gtfo',

  // ── Slurs and hate speech ────────────────────────────────────────────────────
  'nigger', 'nigga', 'nigg', 'niga',
  'faggot', 'faggots', 'fag',
  'dyke', 'dykes',
  'tranny', 'trannies',
  'spic', 'spics',
  'wetback', 'wetbacks',
  'beaner', 'beaners',
  'chink', 'chinks',
  'gook', 'gooks',
  'kike', 'kikes',
  'raghead', 'towelhead',
  'coon', 'coons',
  'paki', 'pakis',
  'honky', 'honkeys',
  'cracker',
  'retard', 'retarded', 'retards',
  'nazi', 'nazis',
  'hitler',

  // ── Sexually explicit ────────────────────────────────────────────────────────
  'porn', 'pornhub', 'xvideos', 'xnxx', 'onlyfans',
  'dildo', 'dildos',
  'vibrator',
  'anal', 'anus', 'butthole',
  'blowjob', 'blowjobs',
  'handjob', 'handjobs',
  'rimjob', 'rimjobs',
  'cumshot', 'cumshots',
  'creampie',
  'gangbang',
  'orgy',
  'rape', 'raping', 'rapist',
  'molest', 'molester',
  'pedophile', 'paedophile', 'pedo',
  'nonce',
  'masturbate', 'masturbation', 'masturbating',
  'horny',
]

// Normalise leetspeak / special-char substitutions so "f4ck", "sh!t",
// "a$$hole" etc. are caught.
function normalize(text) {
  return text
    .toLowerCase()
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/7/g, 't')
    .replace(/8/g, 'b')
    .replace(/@/g, 'a')
    .replace(/\$/g, 's')
    .replace(/!/g, 'i')
    .replace(/\|/g, 'i')
    .replace(/\+/g, 't')
    .replace(/9/g, 'g')
}

export function containsInappropriateContent(text) {
  if (!text || typeof text !== 'string') return false

  const norm = normalize(text)
  // Strip all non-alpha chars so "a.s.s" or "f-u-c-k" etc. are caught as substrings
  const stripped = norm.replace(/[^a-z]/g, '')

  for (const word of BLOCKED_WORDS) {
    if (word.includes(' ')) {
      // Multi-word phrase: check the normalized text (which keeps spaces)
      if (norm.includes(word)) return true
    } else if (word.length <= 4) {
      // Short words: use word boundary to avoid false positives (e.g. "ass" in "class")
      const re = new RegExp(`\\b${word}\\b`)
      if (re.test(norm)) return true
    } else {
      // Longer words: substring check on both normalized and stripped text so
      // "a55hole", "f.u.c.k.i.n.g" etc. are caught even when embedded
      if (norm.includes(word) || stripped.includes(word)) return true
    }
  }
  return false
}
