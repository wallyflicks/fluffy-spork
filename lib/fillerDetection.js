// Context-aware filler word detection

const ALWAYS_FILLER = new Set(['um', 'uh', 'basically', 'literally', 'actually', 'honestly']);

// Verbs that form natural "verb + like" phrases — never filler
const VERBS_BEFORE_LIKE = new Set([
  'feels','feel','felt',
  'looks','look','looked',
  'seems','seem','seemed',
  'sounds','sound','sounded',
  'acts','act','acted',
  'views','view','viewed','viewing',
  'appears','appear','appeared',
  'smells','smell','smelled',
  'tastes','taste','tasted',
]);

// "right" before these words is an adjective, not a filler
const NOUNS_AFTER_RIGHT = new Set([
  'decision','way','answer','thing','choice','direction',
  'time','place','now','there','here','person','step','move',
]);

const MULTI_WORD_FILLERS = [
  { word: 'you know', re: /\byou\s+know\b/gi },
  { word: 'sort of',  re: /\bsort\s+of\b/gi },
  { word: 'kind of',  re: /\bkind\s+of\b/gi },
];

const CONTEXT_WORDS = new Set(['like', 'right', 'so', 'just']);

function tokenize(transcript) {
  const raw = transcript.trim().split(/\s+/).filter(Boolean);
  return raw.map((w, i) => ({
    clean: w.toLowerCase().replace(/[^a-z']/g, ''),
    trailingPunct: (w.match(/[,;:.!?]+$/) || [''])[0],
    atSentenceStart: i === 0 || /[.!?]/.test(raw[i - 1]),
    atSentenceEnd:   i === raw.length - 1 || /[.!?]$/.test(w),
  }));
}

function isContextFiller(index, tokens) {
  const tok  = tokens[index];
  const prev = tokens[index - 1] ?? null;
  const next = tokens[index + 1] ?? null;
  const pp   = tokens[index - 2] ?? null;
  const pc   = prev?.clean ?? '';
  const nc   = next?.clean ?? '';
  const ppc  = pp?.clean   ?? '';

  switch (tok.clean) {
    case 'like': {
      // "feels like", "looks like", etc. — real usage
      if (VERBS_BEFORE_LIKE.has(pc)) return false;
      // "just like", "nothing like", "much like" — real comparison
      if (['just', 'nothing', 'much', 'more', 'less'].includes(pc)) return false;
      // Sentence-opening filler: "Like, I think..."
      if (tok.atSentenceStart) return true;
      // Pause-position filler: "and, like, the thing is"
      if (prev?.trailingPunct.includes(',')) return true;
      // Before pronoun/article: "I was like I didn't know", "like a dream"
      if (['i','you','we','it','he','she','they','a','the'].includes(nc)) return true;
      return false;
    }
    case 'right': {
      // "the right decision", "right way", "right answer" — adjective
      if (NOUNS_AFTER_RIGHT.has(nc)) return false;
      // "what is right", "doing right", "right for me"
      if (['doing','is','are','was','for','me','you','us','by','about'].includes(nc)) return false;
      // Tag question at sentence end: "right?"
      if (tok.atSentenceEnd) return true;
      // "am I right" or "isn't that right"
      if (pc === 'i' && ppc === 'am') return true;
      if (pc === 'that' && ["isn't", 'isnt', 'is'].includes(ppc)) return true;
      return false;
    }
    case 'so': {
      // Filler only when it opens a sentence: "So, I think..."
      return tok.atSentenceStart;
    }
    case 'just': {
      // Filler only in "just like" pattern
      return nc === 'like';
    }
    default:
      return false;
  }
}

export function detectFillers(transcript) {
  const fillerWordList = {};
  let totalFillers = 0;

  // Multi-word fillers — always filler, detect via regex
  for (const { word, re } of MULTI_WORD_FILLERS) {
    const n = (transcript.match(re) || []).length;
    if (n > 0) { fillerWordList[word] = n; totalFillers += n; }
  }

  // Single-word fillers — context-aware for like/right/so/just
  const tokens = tokenize(transcript);
  for (let i = 0; i < tokens.length; i++) {
    const { clean } = tokens[i];
    if (ALWAYS_FILLER.has(clean)) {
      fillerWordList[clean] = (fillerWordList[clean] || 0) + 1;
      totalFillers++;
    } else if (CONTEXT_WORDS.has(clean) && isContextFiller(i, tokens)) {
      fillerWordList[clean] = (fillerWordList[clean] || 0) + 1;
      totalFillers++;
    }
  }

  const topFiller = Object.entries(fillerWordList).sort((a, b) => b[1] - a[1])[0] ?? null;
  return { fillerWordList, totalFillers, topFiller };
}
