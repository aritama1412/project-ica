// components/ImageWithFallback.jsx
'use client';
import Image from "next/image";
import { useState } from "react";

export default function ImageWithFallback({ src, fallback, alt, ...props }) {
    const [imgSrc, setImgSrc] = useState(src);

    return (
    <Image
        {...props}
        src={imgSrc}
        alt={alt}
        onError={() => setImgSrc(fallback)}
    />
    );
}
