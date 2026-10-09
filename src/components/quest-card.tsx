import { Link } from 'react-router-dom';
import { Quest } from '../types/quest';

type QuestCardProps = {
  quest: Quest;
};

export function QuestCard({ quest }: QuestCardProps) {
  return (
    <article className="quest-card">
      <div className="quest-card__img">
        <picture>
          <source
            type="image/webp"
            srcSet={`${quest.previewImgWebp ?? ''}, ${quest.previewImgWebp2x ?? ''} 2x`}
          />
          <img
            src={quest.previewImg}
            srcSet={`${quest.previewImg2x ?? ''} 2x`}
            width="344"
            height="232"
            alt={quest.previewImgAlt}
          />
        </picture>
      </div>
      <div className="quest-card__content">
        <div className="quest-card__info-wrapper">
          <Link className="quest-card__link" to={`/quest/${quest.id}`}>
            {quest.title}
          </Link>
        </div>
        <ul className="tags quest-card__tags">
          <li className="tags__item">
            <svg width="11" height="14" aria-hidden="true">
              <use xlinkHref="#icon-person"></use>
            </svg>
            {String(quest.peopleMinCount)}&ndash;{String(quest.peopleMaxCount)} чел
          </li>
          <li className="tags__item">
            <svg width="14" height="14" aria-hidden="true">
              <use xlinkHref="#icon-level"></use>
            </svg>
            {quest.levelLabel}
          </li>
        </ul>
      </div>
    </article>
  );
}
