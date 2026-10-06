import type { CardType } from '@/types/domain';
import type { Rarity } from '@/types/domain';
import { byIso } from 'country-code-lookup';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import world from 'world-atlas/countries-110m.json';
import type { FeatureCollection } from 'geojson';
import type { Topology } from 'topojson-specification';

type CardVisualProps = {
  type: CardType;
  rarity: Rarity;
  countryCode?: string;
  continent?: string;
  flagUrl?: string;
  imageUrl?: string | null;
  imageCredit?: string | null;
  countryName: string;
};

function continentClass(continent?: string) {
  return `card-visual--${(continent ?? 'default').toLowerCase().replace(/\s+/g, '-')}`;
}

const rarityColors: Record<Rarity, string> = {
  common: '#64748b',
  uncommon: '#42945a',
  rare: '#d97732',
  epic: '#477bd1',
  legendary: '#d4a72c',
  special: '#a05bd5',
};

function CountryBoundary({ countryCode, rarity, countryName }: Pick<CardVisualProps, 'countryCode' | 'rarity' | 'countryName'>) {
  const numericCode = countryCode ? byIso(countryCode)?.isoNo : undefined;
  const topology = world as unknown as Topology;
  const countries = feature(topology, topology.objects.countries) as FeatureCollection;
  const country = countries.features.find((candidate) => candidate.id === numericCode);
  if (!country) {
    return (
      <div className="card-visual card-visual--country card-visual--country-fallback" aria-label={`Generic globe placeholder for ${countryName}`}>
        <svg viewBox="0 0 96 96" role="img" aria-label={`${countryName} map placeholder`}>
          <circle cx="48" cy="48" r="28" />
          <path d="M20 48h56M48 20c9 8 13 18 13 28s-4 20-13 28M48 20c-9 8-13 18-13 28s4 20 13 28M25 34c14 5 32 5 46 0M25 62c14-5 32-5 46 0" />
        </svg>
      </div>
    );
  }
  const projection = geoNaturalEarth1().fitSize([220, 96], country);
  const path = geoPath(projection)(country);
  return (
    <div className="card-visual card-visual--country" aria-label={`${countryName} country outline`}>
      <svg viewBox="0 0 220 96" role="img" aria-label={`${countryName} country outline`}>
        <path d={path ?? undefined} fill={rarityColors[rarity]} fillOpacity="0.8" stroke={rarityColors[rarity]} strokeWidth="1.5" />
      </svg>
    </div>
  );
}

export function CardVisual({ type, rarity, countryCode, continent, flagUrl, imageUrl, imageCredit, countryName }: CardVisualProps) {
  if (type === 'flag' && flagUrl) {
    return (
      <div className="card-visual card-visual--flag">
        <img src={flagUrl} alt={`${countryName} flag`} />
      </div>
    );
  }

  if (type === 'country') {
    return <CountryBoundary countryCode={countryCode} rarity={rarity} countryName={countryName} />;
  }

  if (type === 'capital' && imageUrl) {
    return (
      <div className="card-visual card-visual--photo">
        <img src={imageUrl} alt={`${countryName} ${type} view`} />
        {imageCredit && <small>{imageCredit}</small>}
      </div>
    );
  }

  if (type === 'capital') {
    return <div className={`card-visual card-visual--placeholder ${continentClass(continent)}`} aria-label={`No ${type} image available`}>Image unavailable</div>;
  }

  return null;
}
