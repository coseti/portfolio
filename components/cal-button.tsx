import type {ReactNode} from 'react';

const CAL_LINK = 'miguelcoseti/intro';
const CAL_ORIGIN = 'https://cal.eu';
const CAL_CONFIG = '{"layout":"month_view"}';

export function CalButton({
  children,
  className,
  ariaLabel
}: {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      data-cal-namespace="intro"
      data-cal-link={CAL_LINK}
      data-cal-origin={CAL_ORIGIN}
      data-cal-config={CAL_CONFIG}
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </button>
  );
}
