import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { UN_COUNTRY_CODES, UN_COUNTRY_COUNT } from './data/un-countries';

const API_URL = 'https://api.restcountries.com/countries/v5';
const API_KEY = process.env.REST_COUNTRIES_API_KEY;
const PAGE_SIZE = 100;
const OUTPUT_PATH = path.join(process.cwd(), 'prisma', 'seed', 'data', 'countries.json');

type ApiCountry = {
  names?: { common?: string };
  codes?: { alpha_2?: string };
  population?: number;
  continents?: string[];
  capitals?: Array<{ name?: string; primary?: boolean }> | string[];
  flag?: { url_svg?: string; url_png?: string };
};

type ApiResponse = {
  data?: { objects?: Array<{ attributes?: ApiCountry } & ApiCountry> };
};

type ExportCountry = {
  name: string;
  code: string;
  population: number;
  continent: string;
  capital: string | null;
  flag: string;
};

function firstCapital(country: ApiCountry) {
  if (Array.isArray(country.capitals)) {
    const primary = country.capitals.find((capital) => typeof capital === 'object' && capital.primary);
    const capital = primary ?? country.capitals[0];
    return typeof capital === 'string' ? capital : capital?.name ?? null;
  }
  return null;
}

function flatten(record: { attributes?: ApiCountry } & ApiCountry): ExportCountry | null {
  const country = record.attributes ?? record;
  const name = country.names?.common;
  const code = country.codes?.alpha_2;
  const population = country.population;
  const continent = country.continents?.[0];
  const flag = country.flag?.url_svg ?? country.flag?.url_png;
  if (!name || !code || typeof population !== 'number' || !Number.isInteger(population) || population <= 0 || !continent || !flag) return null;
  return { name, code, population, continent, capital: firstCapital(country), flag };
}

async function main() {
  if (!API_KEY) throw new Error('REST_COUNTRIES_API_KEY is required');

  const countries: ExportCountry[] = [];
  let skipped = 0;
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const url = new URL(API_URL);
    url.searchParams.set('response_fields', 'names,codes,population,continents,capitals,flag');
    url.searchParams.set('limit', String(PAGE_SIZE));
    url.searchParams.set('offset', String(offset));
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`,
        'User-Agent': 'WorldCards country snapshot exporter',
      },
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error(`REST_COUNTRIES_EXPORT_FAILED_${response.status}`);
    const payload = await response.json() as ApiResponse;
    const page = payload.data?.objects ?? [];
    if (!page.length) break;
    const flattened = page.map(flatten);
    skipped += flattened.filter((country) => country === null).length;
    countries.push(...flattened.filter((country): country is ExportCountry => country !== null && UN_COUNTRY_CODES.has(country.code)));
    if (page.length < PAGE_SIZE) break;
  }

  if (countries.length !== UN_COUNTRY_COUNT) {
    throw new Error(`REST_COUNTRIES_EXPORT_EXPECTED_${UN_COUNTRY_COUNT}_COUNTRIES_GOT_${countries.length}`);
  }
  countries.sort((left, right) => left.name.localeCompare(right.name));
  await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, `${JSON.stringify(countries, null, 2)}\n`, 'utf8');
  console.log(`Exported ${countries.length} countries to ${OUTPUT_PATH}${skipped ? ` (skipped ${skipped} records without required fields)` : ''}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
