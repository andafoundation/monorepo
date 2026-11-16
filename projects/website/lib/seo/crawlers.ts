/**
 * The crawlers robots.txt names. The site allows every crawler; the groups are
 * named anyway so that a crawler that obeys only its own group, and ignores
 * `*`, still finds the rules and the sitemap.
 */

/** Search engines and AI answer engines that fetch pages to cite them. */
export const SEARCH_AND_CITATION_CRAWLERS = [
  'OAI-SearchBot',
  'ChatGPT-User',
  'Claude-User',
  'Claude-SearchBot',
  'PerplexityBot',
  'Perplexity-User',
  'Googlebot',
  'Bingbot',
  'Applebot',
  'DuckAssistBot',
] as const;

/**
 * Crawlers that collect content for model training, allowed like every other
 * crawler because the foundation wants AI assistants to know its texts.
 * Opting out of training means giving this group `disallow: '/'` in
 * robots.txt while the citation crawlers stay allowed. `Google-Extended` and
 * `Applebot-Extended` are permission tokens rather than fetchers: they only
 * decide whether pages Googlebot and Applebot fetched may be used for training.
 */
export const AI_TRAINING_CRAWLERS = [
  'GPTBot',
  'ClaudeBot',
  'Google-Extended',
  'Applebot-Extended',
  'meta-externalagent',
  'Amazonbot',
  'CCBot',
] as const;
