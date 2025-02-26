import { useEffect } from 'react';

interface AdBannerProps {
  className?: string;
}

export function AdBanner({ className }: AdBannerProps) {
  useEffect(() => {
    // Initialize AdMob
    (window as any).adsbygoogle = (window as any).adsbygoogle || [];
    try {
      ((window as any).adsbygoogle).push({});
    } catch (e) {
      console.error('AdMob error:', e);
    }
  }, []);

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-4420776878768276"
        data-ad-slot="ca-app-pub-4420776878768276/6687939104"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}