import React, { useState, useEffect } from 'react';
import styles from './style.module.css';

interface Product {
    id: string;
    image: string;
    title: string;
    price: number;
    code: string;
    category: string;
}

interface AdData {
    ad: {
        orientation: 'horizontal' | 'vertical';
        productsCount: number;
    };
    products: Product[];
}

interface AffiliateAdProps {
    code: string;
    fontColor?: string;
}

const AffiliateAd = (props: AffiliateAdProps) => {
    const [adData, set_adData] = useState<AdData>();

    const fontColor = props.fontColor || undefined;

    const getAdInfo = (code: string) => {
        fetch(
            `http://localhost:3000/products/ad-products/${code}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            }
        )
            .then((response) => response.json())
            .then((result: Product[]) => {
                set_adData(result);
            })
            .catch((error) => console.error(error));
    }

    useEffect(() => {
        getAdInfo(props.code);
    }, []);

    if (!adData) {
        return <p>Loading...</p>;
    }

    return (
        <div className={`${styles.productDisplay} ${styles[adData.ad.orientation]}`}>
            {adData.products.map((product) => (
                <a href={`http://localhost:3000/products/product-redirect/${product.id}/${props.code}`} target="_blank" rel="noopener noreferrer" style={{ color: fontColor }}>
                    <div key={product.code} className={styles.productItem}>
                        <img src={product.image} alt={product.title} className={styles.productImage} />
                        <span className={styles.productPrice} style={{ color: fontColor }}>{`R$ ${product.price}`}</span>
                        <span className={styles.productTitle}>
                            {product.title}
                        </span>
                    </div>
                </a>
            ))}
        </div>
    );
};

export default AffiliateAd;
