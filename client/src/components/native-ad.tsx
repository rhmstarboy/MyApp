import { useEffect } from 'react';

interface NativeAdProps {
  className?: string;
  adUnitId?: string;
}

export function NativeAd({ 
  className,
  adUnitId = 'ca-app-pub-4420776878768276/4648669940' // Your ad unit ID
}: NativeAdProps) {
  useEffect(() => {
    // Initialize AdMob
    const initAdMob = async () => {
      try {
        // Wait for window.adsbygoogle
        if (!(window as any).adsbygoogle) {
          const script = document.createElement('script');
          script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4420776878768276`;
          script.async = true;
          script.crossOrigin = 'anonymous';
          document.head.appendChild(script);
        }

        // Push ad
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        console.log('Native ad initialization attempted');
      } catch (error) {
        console.error('AdMob error:', error);
      }
    };

    initAdMob();

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px'
        }}
        data-ad-client="ca-pub-4420776878768276"
        data-ad-slot={adUnitId}
        data-ad-format="fluid"
        data-ad-layout-key="-fb+5w+4e-db+86"
      />
    </div>
  );
}