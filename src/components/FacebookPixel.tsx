import Script from 'next/script';
import Image from 'next/image';

export default function FacebookPixel() {
  return (
    <>
      <Script id="fb-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1203701254882500');
          fbq('init', '1949495485896177');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <Image
          src="https://www.facebook.com/tr?id=1203701254882500&ev=PageView&noscript=1"
          alt=""
          width={1}
          height={1}
          style={{ display: 'none' }}
          unoptimized
        />
        <Image
          src="https://www.facebook.com/tr?id=1949495485896177&ev=PageView&noscript=1"
          alt=""
          width={1}
          height={1}
          style={{ display: 'none' }}
          unoptimized
        />
      </noscript>
    </>
  );
} 