
import { useEffect } from 'react';

interface AdBannerProps {
  className?: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  slot?: string;
}

export function AdBanner({ 
  className,
  format = 'auto',
  slot = '2649994893'
}: AdBannerProps) {
  useEffect(() => {
    // Wait for adsense to be ready
    const tryLoad = () => {
      if (!(window as any).adsbygoogle) {
        setTimeout(tryLoad, 50);
        return;
      }
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        console.log('Ad push attempted');
      } catch (e) {
        console.error('AdMob error:', e);
      }
    };
    tryLoad();
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
