import type { CardType } from '@/types/domain';

type CardVisualProps = {
  type: CardType;
  continent?: string;
  flagUrl?: string;
  imageUrl?: string | null;
  imageCredit?: string | null;
  countryName: string;
};

function continentClass(continent?: string) {
  return `card-visual--${(continent ?? 'default').toLowerCase().replace(/\s+/g, '-')}`;
}

export function CardVisual({ type, continent, flagUrl, imageUrl, imageCredit, countryName }: CardVisualProps) {
  if (type === 'flag' && flagUrl) {
    return (
      <div className="card-visual card-visual--flag">
        <img src={flagUrl} alt={`${countryName} flag`} />
      </div>
    );
  }

  if ((type === 'country' || type === 'capital') && imageUrl) {
    return (
      <div className="card-visual card-visual--photo">
        <img src={imageUrl} alt={`${countryName} ${type} view`} />
        {imageCredit && <small>{imageCredit}</small>}
      </div>
    );
  }

  if (type === 'country' || type === 'capital') {
    return <div className={`card-visual card-visual--placeholder ${continentClass(continent)}`} aria-label={`No ${type} image available`}>Image unavailable</div>;
  }

  return null;
}
