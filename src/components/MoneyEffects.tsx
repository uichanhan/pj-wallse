'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAnimationFrame } from 'framer-motion';

// [1] KRW SVG Asset
const KRW_SVG = `data:image/svg+xml;base64,${btoa(`
<svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="13" y="70" width="214" height="100" rx="4" fill="#EBF4D7"/>
<path d="M78 70H223C225.209 70 227 71.7909 227 74V166C227 168.209 225.209 170 223 170H78V70Z" fill="#94E89A"/>
<path d="M86.4305 162.166C82.0928 162.166 79.4395 159.063 79.4395 153.583C79.4395 148.103 82.0928 145 86.4305 145C90.7681 145 93.433 148.126 93.4214 153.583C93.433 159.074 90.7681 162.166 86.4305 162.166ZM83.4772 153.583C83.4656 157.286 84.6539 158.959 86.4305 158.959C88.207 158.959 89.3953 157.286 89.3837 153.583C89.3837 149.938 88.207 148.196 86.4305 148.184C84.6654 148.196 83.4887 149.938 83.4772 153.583Z" fill="#49875C"/>
<path d="M70.5613 162.166C66.2237 162.166 63.5703 159.063 63.5703 153.583C63.5703 148.103 66.2237 145 70.5613 145C74.899 145 77.5638 148.126 77.5523 153.583C77.5638 159.074 74.899 162.166 70.5613 162.166ZM67.608 153.583C67.5965 157.286 68.7847 158.959 70.5613 158.959C72.3379 158.959 73.5261 157.286 73.5146 153.583C73.5146 149.938 72.3379 148.196 70.5613 148.184C68.7963 148.196 67.6196 149.938 67.608 153.583Z" fill="#49875C"/>
<path d="M54.6922 162.166C50.3545 162.166 47.7012 159.063 47.7012 153.583C47.7012 148.103 50.3545 145 54.6922 145C59.0298 145 61.6947 148.126 61.6832 153.583C61.6947 159.074 59.0298 162.166 54.6922 162.166ZM51.7389 153.583C51.7273 157.286 52.9156 158.959 54.6922 158.959C56.4688 158.959 57.657 157.286 57.6455 153.583C57.6455 149.938 56.4688 148.196 54.6922 148.184C52.9271 148.196 51.7504 149.938 51.7389 153.583Z" fill="#49875C"/>
<path d="M38.825 162.166C34.4873 162.166 31.834 159.063 31.834 153.583C31.834 148.103 34.4873 145 38.825 145C43.1626 145 45.8275 148.126 45.816 153.583C45.8275 159.074 43.1626 162.166 38.825 162.166ZM35.8717 153.583C35.8602 157.286 37.0484 158.959 38.825 158.959C40.6016 158.959 41.7898 157.286 41.7783 153.583C41.7783 149.938 40.6016 148.196 38.825 148.184C37.0599 148.196 35.8832 149.938 35.8717 153.583Z" fill="#49875C"/>
<path d="M28.5622 145.231V161.935H24.6168V148.922H24.5245L20.7637 151.23V147.815L24.8937 145.231H28.5622Z" fill="#49875C"/>
<rect x="68" y="115" width="22" height="22" rx="2" fill="#98C2AB"/>
<path d="M126 170C126 156.193 137.193 145 151 145H180C193.807 145 205 156.193 205 170V170H126V170Z" fill="#49875C"/>
<path d="M145 146.49C145 137.935 151.935 131 160.49 131H170.51C179.065 131 186 137.935 186 146.49L161.5 157L145 146.49Z" fill="#EBF4D7"/>
<path d="M147 108H184V125.5C184 135.717 175.717 144 165.5 144C155.283 144 147 135.717 147 125.5V108Z" fill="#CAF2D7"/>
<path d="M182 114.5C182 112.567 183.567 111 185.5 111C187.433 111 189 112.567 189 114.5V119.5C189 121.433 187.433 123 185.5 123C183.567 123 182 121.433 182 119.5V114.5Z" fill="#CAF2D7"/>
<path d="M147 103.5C147 93.2827 155.283 85 165.5 85C175.717 85 184 93.2827 184 103.5V108H147V103.5Z" fill="#49875C"/>
<path d="M155 93.5C155 86.0442 161.044 80 168.5 80C175.956 80 182 86.0442 182 93.5V98H155V93.5Z" fill="#49875C"/>
<path d="M162 79.5C162 77.567 163.567 76 165.5 76C167.433 76 169 77.567 169 79.5V84H162V79.5Z" fill="#49875C"/>
<path d="M171 79.5C171 77.567 172.567 76 174.5 76C176.433 76 178 77.567 178 79.5V84H171V79.5Z" fill="#49875C"/>
<path d="M151 131C151 127.134 154.134 124 158 124H161C164.866 124 168 127.134 168 131H151Z" fill="#49875C"/>
<path d="M152 136H167V140.5C167 144.642 163.642 148 159.5 148C155.358 148 152 144.642 152 140.5V136Z" fill="#49875C"/>
</svg>
`)}`;

// [2] USD SVG Asset
const USD_SVG = `data:image/svg+xml;base64,${btoa(`
<svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="13" y="70" width="214" height="100" rx="4" fill="#E4DEC6"/>
<rect x="24.5" y="80.5" width="192" height="80" rx="4.5" stroke="#84907A" stroke-width="7"/>
<circle cx="59" cy="120" r="8" fill="#84907A"/>
<circle cx="36" cy="92" r="11" fill="#E4DEC6" stroke="#84907A" stroke-width="4"/>
<circle cx="205" cy="92" r="11" fill="#E4DEC6" stroke="#84907A" stroke-width="4"/>
<circle cx="31" cy="154" r="7" fill="#E4DEC6" stroke="#84907A" stroke-width="4"/>
<circle cx="210" cy="154" r="7" fill="#E4DEC6" stroke="#84907A" stroke-width="4"/>
<path d="M120.5 80C139.307 80 155 96.7556 155 118C155 139.244 139.307 156 120.5 156C101.693 156 86 139.244 86 118C86 96.7556 101.693 80 120.5 80Z" fill="#E4DEC6" stroke="#84907A" stroke-width="6"/>
<path d="M119.142 141.123V137.039C110.974 136.616 105.794 132.582 105.645 124.737H113.812C113.987 127.8 116.029 129.568 119.142 129.942V121.749L116.602 121.151C110.401 119.707 106.591 116.619 106.591 111.19C106.566 104.915 111.746 100.607 119.142 100.084V96H122.03V100.084C129.551 100.557 134.307 104.94 134.382 111.24H126.214C126.015 109.024 124.595 107.555 122.03 107.156V114.926L123.873 115.374C130.821 116.893 134.855 120.354 134.88 126.132C134.855 132.582 130.124 136.616 122.03 137.039V141.123H119.142ZM115.356 110.593C115.307 112.436 116.801 113.506 119.142 114.229V107.156C116.651 107.53 115.381 108.85 115.356 110.593ZM122.03 129.917C124.67 129.519 126.214 128.099 126.264 126.132C126.214 124.364 124.894 123.293 122.03 122.471V129.917Z" fill="#84907A"/>
<rect x="168" y="112" width="31" height="16" rx="4" fill="#84907A"/>
</svg>
`)}`;

// Default Placeholder (Generic Green Banknote)
const PLACEHOLDER_SVG = `data:image/svg+xml;base64,${btoa(`
<svg width="240" height="120" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="240" height="120" rx="8" fill="#22C55E" fill-opacity="0.2"/>
<rect x="10" y="10" width="220" height="100" rx="4" stroke="#22C55E" stroke-width="2" stroke-dasharray="8 8"/>
<circle cx="120" cy="60" r="30" stroke="#22C55E" stroke-width="2"/>
<path d="M110 60H130M120 50V70" stroke="#22C55E" stroke-width="2"/>
</svg>
`)}`;

// [3] 두쫀쿠
const DUZ_SVG = `data:image/svg+xml;base64,${btoa(`
<svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M119.5 71C148.268 71 168.011 79.7031 181.4 92.7285C194.93 105.891 202.75 124.23 206.086 144.759C207.635 154.289 200.285 163.585 189.145 164.883C136.613 171.005 99.7814 170.94 49.7363 164.966C38.661 163.644 31.3591 154.382 32.8965 144.87C36.2194 124.315 44.0311 105.947 57.5625 92.7637C70.9526 79.7179 90.7063 71 119.5 71Z" fill="#C6C130" stroke="#6A4B46" stroke-width="16"/><rect x="72" y="145.021" width="17" height="6" rx="3" transform="rotate(-45 72 145.021)" fill="#A89728"/><rect x="115.205" y="121.816" width="10.7653" height="6" rx="3" transform="rotate(-45 115.205 121.816)" fill="#A89728"/><rect x="112" y="147.021" width="17" height="6" rx="3" transform="rotate(-45 112 147.021)" fill="#86A828"/><rect x="156" y="139.021" width="17" height="6" rx="3" transform="rotate(-45 156 139.021)" fill="#86A828"/><rect x="144" y="112.021" width="17" height="6" rx="3" transform="rotate(-45 144 112.021)" fill="#86A828"/><rect x="117" y="100.021" width="17" height="6" rx="3" transform="rotate(-45 117 100.021)" fill="#DED27B"/><rect x="84" y="110.021" width="17" height="6" rx="3" transform="rotate(-45 84 110.021)" fill="#86A828"/><rect x="55.3516" y="128.669" width="10.3479" height="6" rx="3" transform="rotate(-45 55.3516 128.669)" fill="#86A828"/><rect x="180" y="144.317" width="10.3479" height="6" rx="3" transform="rotate(-45 180 144.317)" fill="#A89728"/><rect x="92.248" y="125.773" width="13.4708" height="6" rx="3" transform="rotate(-45 92.248 125.773)" fill="#DED27B"/><rect x="136.17" y="132.851" width="10.8624" height="6" rx="3" transform="rotate(-45 136.17 132.851)" fill="#DED27B"/></svg>
`)}`;

// [4] 국밥
const GUKBAP_SVG = `data:image/svg+xml;base64,${btoa(`
<svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="120" cy="120" r="73.5" fill="#EFE4DC" stroke="#6A4B46" stroke-width="11"/><path d="M73 120C73 94.0426 94.0426 73 120 73" stroke="white" stroke-width="21" stroke-linecap="round"/><rect x="85.9023" y="143.603" width="38" height="23" rx="11.5" transform="rotate(-64 85.9023 143.603)" fill="#89684D"/><rect x="110.361" y="106.197" width="38" height="23" rx="11.5" transform="rotate(-30 110.361 106.197)" fill="#89684D"/><rect x="88.0762" y="102.195" width="38" height="23" rx="11.5" transform="rotate(20 88.0762 102.195)" fill="#A68167"/><rect x="152.094" y="135.792" width="38" height="23" rx="11.5" transform="rotate(-164 152.094 135.792)" fill="#A68167"/><rect x="131" y="80" width="38" height="23" rx="11.5" transform="rotate(90 131 80)" fill="#A68167"/><rect x="108" y="157" width="38" height="23" rx="11.5" transform="rotate(-90 108 157)" fill="#A68167"/><rect x="140.254" y="109.858" width="38" height="23" rx="11.5" transform="rotate(71 140.254 109.858)" fill="#89684D"/><rect x="98.1445" y="83.3965" width="38" height="23" rx="11.5" transform="rotate(42 98.1445 83.3965)" fill="#89684D"/><circle cx="123.5" cy="129.5" r="6.5" stroke="#92D644" stroke-width="4"/><circle cx="107" cy="120" r="5" stroke="#3EB538" stroke-width="4"/><circle cx="115.5" cy="105.5" r="6.5" stroke="#92D644" stroke-width="4"/><circle cx="131" cy="115" r="5" stroke="#3EB538" stroke-width="4"/></svg>
`)}`;

// [5] 엽떡
const YEOB_SVG = `data:image/svg+xml;base64,${btoa(`
<svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="120" cy="120" r="73.5" fill="#FB4C3D" stroke="#F4DEDE" stroke-width="11"/>
<path d="M113 62C113 62 60.9998 97.5 67.9998 118.229C74.9998 138.957 130.333 62.8763 138.454 86.6857C146.576 110.495 90.9299 131.972 105.999 150.5C121.069 169.028 149.618 103.663 165.5 121.5C181.382 139.337 132.999 173 132.999 173" stroke="#FFE9B6" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="123.5" cy="129.5" r="6.5" stroke="#92D644" stroke-width="4"/>
<circle cx="107" cy="120" r="5" stroke="#3EB538" stroke-width="4"/>
<circle cx="115.5" cy="105.5" r="6.5" stroke="#92D644" stroke-width="4"/>
<circle cx="131" cy="115" r="5" stroke="#3EB538" stroke-width="4"/>
<path d="M80.9199 124C77.5882 128.139 76.711 138.133 78.5 141.865" stroke="#E82E2E" stroke-width="21" stroke-linecap="round"/>
<path d="M154 100C158.312 102.865 164.081 111.014 164 115" stroke="#E82E2E" stroke-width="21" stroke-linecap="round"/>
<path d="M119 155C121.02 157.939 125.615 164.519 127 167" stroke="#FF783F" stroke-width="21" stroke-linecap="round"/>
<path d="M133.287 73.7034C137.871 71.4178 147.835 73.4465 149.756 75.3699" stroke="#FF783F" stroke-width="21" stroke-linecap="round"/>
</svg>
`)}`;

// [6] 엄복동
const UBD_SVG = `data:image/svg+xml;base64,${btoa(`
<svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M78 77L63.5 54.5H47.5C40.0442 54.5 34 60.5442 34 68C34 75.4558 40.0442 81.5 47.5 81.5H48.5" stroke="#DED6A9" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/><circle cx="46" cy="153" r="38.5" stroke="#DED6A9" stroke-width="11"/><circle cx="194" cy="153" r="38.5" stroke="#DED6A9" stroke-width="11"/><path d="M45 150.5L74.5 73M74.5 73H140.5L194.5 150.5H124.5L74.5 73Z" stroke="#84907A" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/></svg>
`)}`;

// [7] 아이폰 17
const IPHONE_SVG = `data:image/svg+xml;base64,${btoa(`
<svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M67 45C67 33.799 67 28.1984 69.1799 23.9202C71.0973 20.1569 74.1569 17.0973 77.9202 15.1799C82.1984 13 87.7989 13 99 13H140C151.201 13 156.802 13 161.08 15.1799C164.843 17.0973 167.903 20.1569 169.82 23.9202C172 28.1984 172 33.7989 172 45V195C172 206.201 172 211.802 169.82 216.08C167.903 219.843 164.843 222.903 161.08 224.82C156.802 227 151.201 227 140 227H99C87.7989 227 82.1984 227 77.9202 224.82C74.1569 222.903 71.0973 219.843 69.1799 216.08C67 211.802 67 206.201 67 195V45Z" fill="#DCF4F5"/><rect x="74" y="19" width="32" height="58" rx="16" fill="#ADD6D6"/><rect x="78.5" y="50.5" width="23" height="23" rx="11.5" fill="#6CA1A1" stroke="#C9FAFA"/><rect x="78.5" y="23.5" width="23" height="23" rx="11.5" fill="#6CA1A1" stroke="#C9FAFA"/><rect x="110" y="44" width="7" height="7" rx="3.5" fill="white"/><path d="M132.534 133.498C131.05 135.73 129.477 137.908 127.082 137.944C124.687 137.998 123.919 136.522 121.202 136.522C118.468 136.522 117.627 137.908 115.358 137.998C113.016 138.088 111.247 135.622 109.745 133.444C106.689 128.998 104.348 120.809 107.493 115.301C109.048 112.565 111.837 110.837 114.857 110.783C117.145 110.747 119.325 112.349 120.737 112.349C122.131 112.349 124.777 110.423 127.547 110.711C128.709 110.765 131.962 111.179 134.053 114.275C133.892 114.383 130.174 116.579 130.21 121.133C130.264 126.568 134.946 128.386 135 128.404C134.946 128.53 134.249 130.996 132.534 133.498ZM122.328 104.7C123.633 103.206 125.795 102.072 127.583 102C127.815 104.106 126.975 106.23 125.724 107.742C124.491 109.272 122.453 110.459 120.451 110.297C120.183 108.228 121.184 106.068 122.328 104.7Z" fill="#6CA1A1"/></svg>
`)}`;

const UNIT_ASSET_MAP: Record<string, string> = {
    '원화': KRW_SVG,
    '달러': USD_SVG,
    '두쫀쿠': DUZ_SVG,
    '국밥': GUKBAP_SVG,
    '엽떡': YEOB_SVG,
    '엄복동': UBD_SVG,
    '아이폰 17': IPHONE_SVG,
};

interface Particle {
    id: number;
    x: number;
    y: number;
    rotate: number;
    speed: number;
    rotationSpeed: number;
    size: number;
}

interface MoneyEffectsProps {
    progress: number;
    unitName: string;
}

export const MoneyEffects: React.FC<MoneyEffectsProps> = ({ progress, unitName }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const particlesRef = useRef<Particle[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const imagesRef = useRef<Record<string, HTMLImageElement>>({});
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Preload assets
        const assetsToLoad = Object.keys(UNIT_ASSET_MAP).concat(['placeholder']);
        let loadedCount = 0;

        const handleLoad = () => {
            loadedCount++;
            if (loadedCount >= assetsToLoad.length) {
                setIsLoaded(true);
            }
        };

        // Load unit assets
        Object.entries(UNIT_ASSET_MAP).forEach(([name, src]) => {
            const img = new Image();
            img.src = src;
            img.onload = handleLoad;
            imagesRef.current[name] = img;
        });

        // Load generic placeholder
        const placeholderImg = new Image();
        placeholderImg.src = PLACEHOLDER_SVG;
        placeholderImg.onload = handleLoad;
        imagesRef.current['placeholder'] = placeholderImg;

        // Initialize particles
        const particleCount = 20;
        const initialParticles: Particle[] = Array.from({ length: particleCount }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * -100 - 100,
            rotate: Math.random() * 360,
            speed: 2 + Math.random() * 3,
            rotationSpeed: (Math.random() - 0.5) * 2,
            size: 60 + Math.random() * 40,
        }));
        particlesRef.current = initialParticles;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useAnimationFrame(() => {
        const canvas = canvasRef.current;
        if (!canvas || !isLoaded) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Get current image based on unitName
        const currentImg = imagesRef.current[unitName] || imagesRef.current['placeholder'];

        // Sync canvas size
        if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particlesRef.current.forEach((p) => {
            // Apply 20px padding as requested (x is percentage from 0 to 100)
            const px = 20 + (p.x / 100) * (canvas.width - 40);
            const py = (p.y / 100) * canvas.height;

            const dx = px - mouseRef.current.x;
            const dy = py - mouseRef.current.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Interaction logic (Pause within 120px)
            if (distance > 120) {
                p.y += (p.speed * 0.1);
                p.rotate += p.rotationSpeed;
            }

            // Reset particle
            if (p.y > 110) {
                p.y = -20;
                p.x = Math.random() * 100;
            }

            ctx.save();
            ctx.translate(px, py);
            ctx.rotate((p.rotate * Math.PI) / 180);
            ctx.globalAlpha = 0.5; // Slightly increased for visibility of new detailed assets

            ctx.drawImage(currentImg, -p.size / 2, -p.size / 2, p.size, p.size);

            ctx.restore();
        });
    });

    return (
        <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
            />

            {/* Money Pool (Rising Layer) */}
            <div
                className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#F22E30]/5 to-transparent transition-all duration-500 ease-out"
                style={{
                    height: `${progress * 100}%`,
                    zIndex: 0
                }}
            />
        </div>
    );
};
