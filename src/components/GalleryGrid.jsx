import React, { useState, useEffect, useRef, useCallback } from 'react';

const PAGE_SIZE = 15;
const PRELOAD_TIMEOUT_MS = 12000;

function useInitialBatchPreload(images, batchSize) {
    const [ready, setReady] = useState(false);
    const [progress, setProgress] = useState({ loaded: 0, total: 0 });

    useEffect(() => {
        if (images.length === 0) {
            setReady(true);
            setProgress({ loaded: 0, total: 0 });
            return;
        }

        const batch = images.slice(0, Math.min(batchSize, images.length));
        setReady(false);
        setProgress({ loaded: 0, total: batch.length });

        let loaded = 0;
        let cancelled = false;

        const markLoaded = () => {
            loaded += 1;
            if (!cancelled) {
                setProgress({ loaded, total: batch.length });
                if (loaded >= batch.length) setReady(true);
            }
        };

        batch.forEach((img) => {
            const el = new Image();
            el.onload = markLoaded;
            el.onerror = markLoaded;
            el.src = img.src;
        });

        const timeout = setTimeout(() => {
            if (!cancelled) setReady(true);
        }, PRELOAD_TIMEOUT_MS);

        return () => {
            cancelled = true;
            clearTimeout(timeout);
        };
    }, [images, batchSize]);

    return { ready, progress };
}

function GalleryLoading({ loaded, total }) {
    const pct = total > 0 ? Math.round((loaded / total) * 100) : 0;

    return (
        <div className="flex flex-col items-center justify-center py-32 gap-8 animate-fade-in">
            <div className="w-10 h-10 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
            <div className="text-center space-y-2">
                <p className="font-heading tracking-[0.3em] uppercase text-gray-600 text-lg">
                    Loading gallery
                </p>
                {total > 0 && (
                    <p className="text-xs text-gray-400 tracking-widest">
                        {loaded} / {total} · {pct}%
                    </p>
                )}
            </div>
        </div>
    );
}

function ImageWithSpinner({ src, alt, title, onClick, eager = false }) {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className="relative min-h-[100px]" onClick={onClick}>
            {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin"></div>
                </div>
            )}
            <img
                src={src}
                alt={alt}
                title={title || undefined}
                className={`w-full h-auto transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                loading={eager ? 'eager' : 'lazy'}
                decoding="async"
                onLoad={() => setLoaded(true)}
            />
        </div>
    );
}

export default function GalleryGrid({ images }) {
    const [lightboxIndex, setLightboxIndex] = useState(-1);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const sentinelRef = useRef(null);

    const { ready: initialReady, progress } = useInitialBatchPreload(images, PAGE_SIZE);

    const hasMore = visibleCount < images.length;
    const visibleImages = images.slice(0, visibleCount);

    useEffect(() => {
        setVisibleCount(PAGE_SIZE);
        setLightboxIndex(-1);
    }, [images]);

    useEffect(() => {
        if (!initialReady || !hasMore) return;

        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, images.length));
                }
            },
            { rootMargin: '400px' },
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [initialReady, hasMore, images.length, visibleCount]);

    const nextImage = useCallback((e) => {
        e?.stopPropagation();
        setLightboxIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const prevImage = useCallback((e) => {
        e?.stopPropagation();
        setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setLightboxIndex(-1);
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        };
        if (lightboxIndex !== -1) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [lightboxIndex, nextImage, prevImage]);

    const openLightbox = (index) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(-1);

    if (images.length === 0) {
        return <div className="text-center py-20 text-gray-400">No images found in this gallery yet.</div>;
    }

    if (!initialReady) {
        return <GalleryLoading loaded={progress.loaded} total={progress.total} />;
    }

    const current = lightboxIndex !== -1 ? images[lightboxIndex] : null;

    return (
        <>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 animate-fade-in">
                {visibleImages.map((imgObj, idx) => (
                    <div
                        key={imgObj.src}
                        className="break-inside-avoid cursor-pointer group relative overflow-hidden"
                    >
                        <ImageWithSpinner
                            src={imgObj.src}
                            alt={imgObj.alt || imgObj.title}
                            title={imgObj.title}
                            onClick={() => openLightbox(idx)}
                            eager={idx < PAGE_SIZE}
                        />

                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/85 transition-colors duration-500 ease-in-out pointer-events-none"></div>

                        {imgObj.title && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 p-4 pointer-events-none">
                                <h3 className="text-gray-900 text-2xl font-heading tracking-widest uppercase text-center">
                                    {imgObj.title}
                                </h3>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {hasMore && (
                <div ref={sentinelRef} className="flex justify-center py-12">
                    <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
                </div>
            )}

            {current && (
                <div
                    className="fixed inset-0 z-[60] bg-white/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
                    onClick={closeLightbox}
                    role="dialog"
                    aria-modal="true"
                    aria-label={current.title || current.alt}
                >
                    <button
                        className="absolute top-6 right-6 text-4xl font-heading hover:text-gray-500 z-50 p-2"
                        onClick={closeLightbox}
                        aria-label="Close lightbox"
                    >
                        &times;
                    </button>

                    <img
                        src={current.src}
                        alt={current.alt || current.title}
                        title={current.title || undefined}
                        className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />

                    <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-4 text-3xl hover:bg-gray-100/50 rounded-full transition-colors"
                        onClick={prevImage}
                        aria-label="Previous image"
                    >
                        &#10094;
                    </button>
                    <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-4 text-3xl hover:bg-gray-100/50 rounded-full transition-colors"
                        onClick={nextImage}
                        aria-label="Next image"
                    >
                        &#10095;
                    </button>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
                        {(current.title || current.alt) && (
                            <p className="font-heading tracking-widest text-lg text-gray-800 uppercase mb-1">
                                {current.title || current.alt}
                            </p>
                        )}
                        <p className="font-sans text-xs text-gray-500">
                            {lightboxIndex + 1} / {images.length}
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
