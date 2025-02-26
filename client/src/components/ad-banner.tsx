
import { useEffect } from 'react';

interface AdBannerProps {
  className?: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  slot?: string;
}

export function AdBanner({ 
  className,
  format = 'auto',
  slot = '6687939104'
}: AdBannerProps) {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdMob error:', e);
    }
  }, []);

  const adStyle = {
    display: 'block',
    textAlign: 'center' as const,
    minHeight: format === 'vertical' ? '600px' : '250px'
  };

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={adStyle}
        data-ad-client="ca-pub-4420776878768276"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
