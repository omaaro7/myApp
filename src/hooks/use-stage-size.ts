
import * as React from 'react';

export function useStageSize(ref: React.RefObject<HTMLDivElement>) {
  const [size, setSize] = React.useState({ width: 0, height: 0 });

  React.useLayoutEffect(() => {
    function updateSize() {
      if (ref.current) {
        const newSize = {
          width: ref.current.offsetWidth,
          height: ref.current.offsetHeight,
        };
        console.log('New stage size:', newSize);
        setSize(newSize);
      }
    }

    const resizeObserver = new ResizeObserver(updateSize);
    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    updateSize();

    return () => {
      if (ref.current) {
        resizeObserver.unobserve(ref.current);
      }
    };
  }, [ref]);

  return size;
}
