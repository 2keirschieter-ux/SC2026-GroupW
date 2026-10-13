const API_URL = 'https://en.wikipedia.org/api/rest_v1/page/summary';
const COMMONS_API_URL = 'https://commons.wikimedia.org/w/api.php';
const OPENVERSE_API_URL = 'https://api.openverse.org/v1/images/';
const USER_AGENT = 'WorldCards/1.0 (Wikipedia image attribution cache)';

type SummaryResponse = {
  title?: string;
  description?: string;
  type?: string;
  thumbnail?: { source?: string };
  originalimage?: { source?: string };
  content_urls?: { desktop?: { page?: string } };
};

type CommonsPage = {
  title: string;
  imageinfo?: Array<{ url?: string; mime?: string; width?: number; height?: number; extmetadata?: Record<string, { value?: string }> }>;
};

type CommonsResponse = { query?: { pages?: Record<string, CommonsPage> } };
type ImageCandidate = { imageUrl: string; imageCredit: string; score: number };
type OpenverseResult = {
  url?: string;
  thumbnail?: string;
  foreign_landing_url?: string;
  title?: string;
  creator?: string;
  license?: string;
  width?: number;
  height?: number;
};
type OpenverseResponse = { results?: OpenverseResult[] };

function titleCandidates(subject: string, kind: 'country' | 'capital', countryName?: string) {
  if (kind === 'capital') {
    return [
      `${subject}, ${countryName ?? ''}`.replace(/,\s*$/, ''),
      `${subject} (city)`,
      subject,
      `${subject} (island)`,
    ];
  }
  return [subject, `${subject} (country)`, `${subject} (island)`];
}

async function fetchSummary(title: string): Promise<SummaryResponse | null> {
  const encodedTitle = encodeURIComponent(title.replace(/\s+/g, '_'));
  const url = `${API_URL}/${encodedTitle}`;
  console.log(`[Wikipedia] Summary query: "${title}"`);
  console.log(`[Wikipedia] Request URL: ${url}`);

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Accept: 'application/json', 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(8000),
    });
  } catch (error) {
    console.error(`[Wikipedia] Fetch error for "${title}":`, error);
    return null;
  }

  const body = await response.text();
  console.log(`[Wikipedia] HTTP status for "${title}": ${response.status} ${response.statusText}`);
  if (!response.ok) {
    if (response.status !== 404) {
      console.error(`[Wikipedia] Raw error response for "${title}": ${body}`);
    }
    return null;
  }

  try {
    return JSON.parse(body) as SummaryResponse;
  } catch (error) {
    console.error(`[Wikipedia] JSON parse error for "${title}":`, error);
    console.error(`[Wikipedia] Raw response body for "${title}": ${body}`);
    return null;
  }
}

function isUsableImage(summary: SummaryResponse, imageUrl: string, kind: 'country' | 'capital') {
  const searchableText = `${summary.title ?? ''} ${summary.description ?? ''} ${imageUrl}`.toLowerCase();
  const excludedTerms = /\b(flag|coat[ _-]?of[ _-]?arms|map|locator|emblem|logo|symbol|outline|seal|insignia|portrait|people|person|crowd|festival|parade)\b/;
  const isSvg = /\.svg(?:[?#]|$)/i.test(imageUrl);
  const isLikelyPhoto = /\.(?:jpe?g|png|webp)(?:[?#]|$)/i.test(imageUrl);
  return summary.type !== 'disambiguation'
    && !excludedTerms.test(searchableText)
    && !isSvg
    && isLikelyPhoto;
}

function commonsQueries(subject: string, kind: 'country' | 'capital', countryName?: string) {
  if (kind === 'capital' && countryName) {
    const place = `${subject} ${countryName}`;
    return [
      `${place} landmark`,
      `${place} monument`,
      `${place} architecture`,
      `${place} skyline`,
      `${place} tourism`,
      `${place} travel`,
    ];
  }
  return [
    `${subject} landscape`,
    `${subject} landmark`,
    `${subject} monument`,
    `${subject} nature`,
    `${subject} tourism`,
    `${subject} travel`,
  ];
}

function isUsableCommonsPhoto(page: CommonsPage) {
  const info = page.imageinfo?.[0];
  const text = `${page.title} ${info?.extmetadata?.Categories?.value ?? ''}`.toLowerCase();
  const excludedTerms = /\b(flag|coat[ _-]?of[ _-]?arms|map|locator|emblem|logo|symbol|outline|seal|insignia|diagram|chart|portrait|people|person|crowd|festival|parade)\b/;
  const isLandscape = (info?.width ?? 0) >= (info?.height ?? 0) * 1.2;
  return Boolean(info?.url && ['image/jpeg', 'image/png', 'image/webp'].includes(info.mime ?? '') && isLandscape)
    && !excludedTerms.test(text);
}

async function searchCommons(subject: string, kind: 'country' | 'capital', countryName?: string, excludedUrls: Set<string> = new Set()): Promise<ImageCandidate | null> {
  for (const query of commonsQueries(subject, kind, countryName)) {
    const params = new URLSearchParams({
      action: 'query',
      format: 'json',
      origin: '*',
      generator: 'search',
      gsrsearch: query,
      gsrnamespace: '6',
      gsrlimit: '10',
      prop: 'imageinfo',
      iiprop: 'url|mime|size|extmetadata',
    });
    const url = `${COMMONS_API_URL}?${params}`;
    console.log(`[Wikimedia Commons] Photo query: "${query}"`);
    let response: Response;
    try {
      response = await fetch(url, {
        headers: { 'User-Agent': USER_AGENT },
        signal: AbortSignal.timeout(8000),
      });
    } catch (error) {
      console.error(`[Wikimedia Commons] Fetch error for "${query}":`, error);
      continue;
    }
    if (!response.ok) {
      console.error(`[Wikimedia Commons] HTTP status for "${query}": ${response.status}`);
      continue;
    }
    let data: CommonsResponse;
    try {
      data = JSON.parse(await response.text()) as CommonsResponse;
    } catch (error) {
      console.error(`[Wikimedia Commons] JSON parse error for "${query}":`, error);
      continue;
    }
    const page = Object.values(data.query?.pages ?? {}).find(isUsableCommonsPhoto);
    const info = page?.imageinfo?.[0];
    if (page && info && info.url && !excludedUrls.has(info.url)) {
      return {
        imageUrl: info.url,
        imageCredit: `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}`,
        score: 10,
      };
    }
  }
  return null;
}

function openverseQueries(subject: string, kind: 'country' | 'capital', countryName?: string) {
  if (kind === 'capital' && countryName) {
    const place = `${subject} ${countryName}`;
    return [
      `${place} landmark`,
      `${place} monument`,
      `${place} architecture`,
      `${place} skyline`,
      `${place} tourism`,
      `${place} travel`,
    ];
  }
  return [
    `${subject} landscape`,
    `${subject} landmark`,
    `${subject} monument`,
    `${subject} nature`,
    `${subject} tourism`,
    `${subject} travel`,
  ];
}

function isUsableOpenverseResult(result: OpenverseResult) {
  const text = `${result.title ?? ''} ${result.url ?? ''}`.toLowerCase();
  const excludedTerms = /\b(flag|coat[ _-]?of[ _-]?arms|map|locator|emblem|logo|symbol|outline|seal|insignia|diagram|chart)\b/;
  return Boolean(result.url && result.foreign_landing_url)
    && !excludedTerms.test(text)
    && (result.width ?? 0) >= 640
    && (result.height ?? 0) >= 360;
}

async function searchOpenverse(subject: string, kind: 'country' | 'capital', countryName?: string, excludedUrls: Set<string> = new Set()): Promise<ImageCandidate | null> {
  for (const query of openverseQueries(subject, kind, countryName)) {
    const params = new URLSearchParams({ q: query, page_size: '20', mature: 'false' });
    const url = `${OPENVERSE_API_URL}?${params}`;
    console.log(`[Openverse] Photo query: "${query}"`);
    try {
      const response = await fetch(url, {
        headers: { Accept: 'application/json', 'User-Agent': USER_AGENT },
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) {
        console.error(`[Openverse] HTTP status for "${query}": ${response.status}`);
        continue;
      }
      const data = JSON.parse(await response.text()) as OpenverseResponse;
      const result = data.results?.find(isUsableOpenverseResult);
      if (result?.url && result.foreign_landing_url && !excludedUrls.has(result.url)) {
        return {
          imageUrl: result.url,
          imageCredit: result.foreign_landing_url,
          score: 5 + Math.min(2, Math.floor((result.width ?? 0) / 1500)),
        };
      }
    } catch (error) {
      console.error(`[Openverse] Failed query "${query}":`, error);
    }
  }
  return null;
}

export async function fetchWikimediaImage(subject: string, kind: 'country' | 'capital', countryName?: string, excludedUrls: string[] = []) {
  try {
    const candidates: ImageCandidate[] = [];
    const excluded = new Set(excludedUrls);
    for (const title of titleCandidates(subject, kind, countryName)) {
      const summary = await fetchSummary(title);
      const imageUrl = summary?.originalimage?.source ?? summary?.thumbnail?.source;
      const articleUrl = summary?.content_urls?.desktop?.page;
      if (imageUrl && articleUrl && !excluded.has(imageUrl) && isUsableImage(summary, imageUrl, kind)) {
        candidates.push({
          imageUrl,
          imageCredit: articleUrl,
          score: 3,
        });
        break;
      }
      console.warn(`[Wikipedia] Rejected non-photo or missing city image for "${title}"`);
    }
    const commonsImage = await searchCommons(subject, kind, countryName, excluded);
    if (commonsImage) candidates.push(commonsImage);
    const openverseImage = await searchOpenverse(subject, kind, countryName, excluded);
    if (openverseImage) candidates.push(openverseImage);
    candidates.sort((left, right) => right.score - left.score);
    if (candidates[0]) {
      return {
        imageUrl: candidates[0].imageUrl,
        imageCredit: candidates[0].imageCredit,
      };
    }
  } catch (error) {
    console.error(`[Wikipedia] Failed to fetch ${kind} image for "${subject}":`, error);
  }
  return null;
}
