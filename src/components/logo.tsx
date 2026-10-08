import { Link } from 'react-router-dom';

type LogoProps = {
  isLink?: boolean;
};

export function Logo({ isLink = true }: LogoProps) {
  const logoSvg = (
    <svg width="134" height="52" aria-hidden="true">
      <use xlinkHref="#logo"></use>
    </svg>
  );

  if (isLink) {
    return (
      <Link className="logo header__logo" to="/" aria-label="Перейти на Главную">
        {logoSvg}
      </Link>
    );
  }

  return (
    <span className="logo header__logo">
      {logoSvg}
    </span>
  );
}
