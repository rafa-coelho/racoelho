import React, { useEffect } from 'react';
import { ADS_CLIENT_ID, ADS_AD_SLOT } from '../lib/config/constants';

const Adsense = () => {
    useEffect(() => {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    }, []);

    return (
        <div>
            <ins className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client={ADS_CLIENT_ID}
                data-ad-slot={ADS_AD_SLOT}
                data-ad-format={"auto"}
                data-full-width-responsive="true"></ins>
        </div>
    );
};

export default Adsense;
