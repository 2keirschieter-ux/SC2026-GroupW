const API_URL = 'https://commons.wikimedia.org/w/api.php';
const USER_AGENT = 'WorldCards/1.0 (Wikimedia Commons attribution cache)';
const EXCLUDED_TERMS = /\b(map|maps|diagram|chart|logo|flag|coat of arms|symbol|icon|location)\b/i;

type SearchPage = { pageid: number; title: string; imageinfo?: Array<{ thumburl?: string; url?: string; mime?: string; extmetadata?: Record<string, { value?: string }> }> };
type SearchResponse = { query?: { pages?: Record<string, SearchPage> } };

function plainText(value: string) {
  return value.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').trim();
}

function isUsable(page: SearchPage) {
  const info = page.imageinfo?.[0];
  return Boolean(info?.thumburl || info?.url) && (!info?.mime || ['image/jpeg', 'image/png', 'image/webp'].includes(info.mime)) && !EXCLUDED_TERMS.test(page.title);
}

async function searchWikimedia(query: string): Promise<SearchPage | null> {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    origin: '*',
    generator: 'search',
    gsrsearch: query,
    gsrnamespace: '6',
    gsrlimit: '8',
    prop: 'imageinfo',
    iiprop: 'url|mime|extmetadata',
    iiurlwidth: '640',
  });
  const response = await fetch(`${API_URL}?${params}`, {
    headers: { 'User-Agent': USER_AGENT },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) return null;
  const data = await response.json() as SearchResponse;
  return Object.values(data.query?.pages ?? {}).find(isUsable) ?? null;
}

export async function fetchWikimediaImage(subject: string, kind: 'country' | 'capital') {
  const queries = kind === 'capital'
    ? [`${subject} city skyline`, `${subject} cityscape`, subject]
    : [`${subject} landscape`, `${subject} nature`, subject];

  try {
    let page: SearchPage | null = null;
    for (const query of queries) {
      page = await searchWikimedia(query);
      if (page) break;
    }
    const info = page?.imageinfo?.[0];
    const imageUrl = info?.thumburl ?? info?.url;
    if (!page || !imageUrl) return null;

    const metadata = info?.extmetadata ?? {};
    const title = page.title.replace(/^File:/, '');
    const artist = plainText(metadata.Artist?.value ?? metadata.Credit?.value ?? 'Unknown photographer');
    const license = plainText(metadata.LicenseShortName?.value ?? 'Wikimedia Commons license');
    return {
      imageUrl,
      imageCredit: `${title} — ${artist} — ${license} (Wikimedia Commons)`,
    };
  } catch {
    return null;
  }
}
