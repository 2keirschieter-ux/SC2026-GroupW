import type { CardType, Rarity } from '@/types/domain';

type CardVisualProps = {
  type: CardType;
  rarity: Rarity;
  countryCode?: string;
  continent?: string;
  flagUrl?: string;
  imageUrl?: string | null;
  countryName: string;
};

function continentClass(continent?: string) {
  return `card-visual--${(continent ?? 'default').toLowerCase().replace(/\s+/g, '-')}`;
}

function RarityBadge({ rarity }: { rarity: Rarity }) {
  return <span className={`rarity-badge rarity-badge--${rarity}`}>{rarity}</span>;
}

export function CardVisual({ type, rarity, continent, flagUrl, imageUrl, countryName }: CardVisualProps) {
  if (type === 'flag' && flagUrl) {
    return (
      <div className="card-visual card-visual--flag">
        <RarityBadge rarity={rarity} />
        <img src={flagUrl} alt={`${countryName} flag`} />
      </div>
    );
  }

  if ((type === 'country' || type === 'capital') && imageUrl) {
    return (
      <div className="card-visual card-visual--photo">
        <RarityBadge rarity={rarity} />
        <img src={imageUrl} alt={`${countryName} ${type} view`} />
      </div>
    );
  }

  if (type === 'special' && imageUrl) {
    return (
      <div className="card-visual card-visual--photo card-visual--special">
        <RarityBadge rarity={rarity} />
        <img src={imageUrl} alt={`${countryName} special card`} />
      </div>
    );
  }

  if (type === 'country' || type === 'capital') {
    return (
      <div className={`card-visual card-visual--placeholder ${continentClass(continent)}`} aria-label={`No ${type} image available`}>
        <RarityBadge rarity={rarity} />
        Image unavailable
      </div>
    );
  }

  return <div className="card-visual card-visual--placeholder" aria-label="Special card visual"><RarityBadge rarity={rarity} />Special card</div>;
}
