import { useRef, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface ScrollableFilterRowProps {
  children: ReactNode;
  /** filter-wrapper에 추가할 className (e.g. "tag-chips") */
  className?: string;
}

const SCROLL_AMOUNT = 200;

export default function ScrollableFilterRow({ children, className }: ScrollableFilterRowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function update() {
      if (!el) return;
      setAtStart(el.scrollLeft <= 0);
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
    }

    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, []);

  function handleLeft() {
    ref.current?.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' });
  }

  function handleRight() {
    ref.current?.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' });
  }

  return (
    <div className="scroll-row-outer">
      <button
        type="button"
        className="scroll-btn scroll-btn--left"
        onClick={handleLeft}
        aria-label="왼쪽으로 스크롤"
        disabled={atStart}
      >
        ‹
      </button>
      <div
        ref={ref}
        className={`filter-wrapper${className ? ` ${className}` : ''}`}
      >
        {children}
      </div>
      <button
        type="button"
        className="scroll-btn scroll-btn--right"
        onClick={handleRight}
        aria-label="오른쪽으로 스크롤"
        disabled={atEnd}
      >
        ›
      </button>
    </div>
  );
}
