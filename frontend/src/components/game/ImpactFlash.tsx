import { useEffect, useState } from 'react';

interface ImpactFlashProps {
  trigger: number; // increment to trigger flash
}

export default function ImpactFlash({ trigger }: ImpactFlashProps) {
  const [visible, setVisible] = useState(false);
  const [intensity, setIntensity] = useState(0);

  useEffect(() => {
    if (trigger === 0) return;
    setVisible(true);
    setIntensity(1);

    const fadeOut = setTimeout(() => {
      setIntensity(0.5);
    }, 100);

    const hide = setTimeout(() => {
      setVisible(false);
      setIntensity(0);
    }, 350);

    return () => {
      clearTimeout(fadeOut);
      clearTimeout(hide);
    };
  }, [trigger]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50"
      style={{
        background: `radial-gradient(ellipse at center, rgba(255, 80, 0, ${intensity * 0.7}) 0%, rgba(255, 0, 0, ${intensity * 0.4}) 50%, transparent 100%)`,
        transition: 'opacity 0.15s ease-out',
      }}
    />
  );
}
