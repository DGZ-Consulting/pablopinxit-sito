import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
    buildGalleryGroups,
    filterImagesByGroup,
    formatDisplayTitle,
    shouldShowGalleryFilters,
    shouldUseSequentialGrid,
} from '../lib/galleryGroups';

export const PAGE_SIZE = 15;

function ImageWithSpinner({ src, alt, title, onClick, eager = false, sequential = false }) {
    const imgRef = useRef(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const img = imgRef.current;
        if (img?.complete && img.naturalHeight > 0) {
            setLoaded(true);
        }
    }, [src]);

    return (
        <div
            className={`relative mb-6 cursor-pointer group ${sequential ? '' : 'break-inside-avoid'}`}
            onClick={onClick}
        >
            {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center min-h-[120px]">
                    <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
                </div>
            )}
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                title={title || undefined}
                className={`w-full h-auto block transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                loading={eager ? 'eager' : 'lazy'}
                decoding="async"
                onLoad={() => setLoaded(true)}
            />

            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/85 transition-colors duration-500 ease-in-out pointer-events-none" />

            {title && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 p-4 pointer-events-none">
                    <h3 className="text-gray-900 text-xl md:text-2xl font-heading tracking-widest uppercase text-center">
                        {title}
                    </h3>
                </div>
            )}
        </div>
    );
}

function GalleryFilters({ groups, totalCount, activeGroup, onChange }) {
    const value = activeGroup ?? '';

    return (
        <div className="mb-8 flex flex-col items-center gap-2">
            <label
                htmlFor="gallery-location-filter"
                className="text-xs text-gray-400 tracking-widest uppercase"
            >
                Location
            </label>
            <select
                id="gallery-location-filter"
                value={value}
                onChange={(e) => onChange(e.target.value || null)}
                className="w-full max-w-md font-heading tracking-wider uppercase text-sm text-gray-800 bg-white border border-gray-300 px-4 py-2.5 pr-10 appearance-none cursor-pointer hover:border-black focus:outline-none focus:border-black transition-colors"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23333' d='M1 1l5 5 5-5'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                }}
            >
                <option value="">All ({totalCount})</option>
                {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                        {group.label} ({group.count})
                    </option>
                ))}
            </select>
        </div>
    );
}

export default function GalleryGrid({ images, categoryTitle = '' }) {
    const [lightboxIndex, setLightboxIndex] = useState(-1);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [loadingMore, setLoadingMore] = useState(false);
    const [activeGroup, setActiveGroup] = useState(null);
    const sentinelRef = useRef(null);

    const groups = useMemo(
        () => buildGalleryGroups(images, categoryTitle),
        [images, categoryTitle],
    );
    const showFilters = shouldShowGalleryFilters(groups);

    const filteredImages = useMemo(
        () => filterImagesByGroup(images, activeGroup, categoryTitle),
        [images, activeGroup, categoryTitle],
    );

    const sequentialGrid = useMemo(
        () => shouldUseSequentialGrid(filteredImages, activeGroup),
        [filteredImages, activeGroup],
    );

    const hasMore = visibleCount < filteredImages.length;
    const visibleImages = filteredImages.slice(0, visibleCount);

    const loadMore = useCallback(() => {
        setVisibleCount((prev) => {
            if (prev >= filteredImages.length) return prev;
            return Math.min(prev + PAGE_SIZE, filteredImages.length);
        });
    }, [filteredImages.length]);

    useEffect(() => {
        setVisibleCount(PAGE_SIZE);
        setLightboxIndex(-1);
    }, [images, activeGroup]);

    useEffect(() => {
        if (!hasMore) return;

        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    setLoadingMore(true);
                    loadMore();
                    setTimeout(() => setLoadingMore(false), 200);
                }
            },
            { rootMargin: '800px' },
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [hasMore, visibleCount, loadMore]);

    const nextImage = useCallback((e) => {
        e?.stopPropagation();
        setLightboxIndex((prev) => (prev + 1) % filteredImages.length);
    }, [filteredImages.length]);

    const prevImage = useCallback((e) => {
        e?.stopPropagation();
        setLightboxIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
    }, [filteredImages.length]);

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

    if (images.length === 0) {
        return <div className="text-center py-20 text-gray-400">No images found in this gallery yet.</div>;
    }

    const current = lightboxIndex !== -1 ? filteredImages[lightboxIndex] : null;
    const currentDisplayTitle = current ? formatDisplayTitle(current.title) : '';

    return (
        <>
            {showFilters && (
                <GalleryFilters
                    groups={groups}
                    totalCount={images.length}
                    activeGroup={activeGroup}
                    onChange={setActiveGroup}
                />
            )}

            {filteredImages.length === 0 ? (
                <div className="text-center py-16 text-gray-400 font-heading tracking-widest uppercase">
                    No works in this location.
                </div>
            ) : (
                <div
                    className={
                        sequentialGrid
                            ? 'grid grid-cols-1 md:grid-cols-2 gap-x-6'
                            : 'columns-1 md:columns-2 lg:columns-3 gap-x-6'
                    }
                >
                    {visibleImages.map((imgObj, idx) => (
                        <ImageWithSpinner
                            key={`${imgObj.src}-${idx}`}
                            src={imgObj.src}
                            alt={imgObj.alt || imgObj.title}
                            title={formatDisplayTitle(imgObj.title)}
                            onClick={() => setLightboxIndex(idx)}
                            eager={idx < 6}
                            sequential={sequentialGrid}
                        />
                    ))}
                </div>
            )}

            {filteredImages.length > 0 && (
                <div className="py-10 flex flex-col items-center gap-4">
                    <p className="text-xs text-gray-400 tracking-widest uppercase">
                        {Math.min(visibleCount, filteredImages.length)} / {filteredImages.length} works
                        {activeGroup && ` · ${groups.find((g) => g.id === activeGroup)?.label}`}
                    </p>

                    {hasMore && (
                        <>
                            <button
                                type="button"
                                onClick={() => {
                                    setLoadingMore(true);
                                    loadMore();
                                    setTimeout(() => setLoadingMore(false), 200);
                                }}
                                disabled={loadingMore}
                                className="font-heading tracking-widest uppercase text-sm border border-black px-8 py-2 hover:bg-black hover:text-white transition-colors disabled:opacity-50"
                            >
                                {loadingMore ? 'Loading…' : 'Load more'}
                            </button>
                            <div ref={sentinelRef} className="h-px w-full" aria-hidden="true" />
                        </>
                    )}
                </div>
            )}

            {current && (
                <div
                    className="fixed inset-0 z-[60] bg-white/95 backdrop-blur-md flex items-center justify-center p-4"
                    onClick={() => setLightboxIndex(-1)}
                    role="dialog"
                    aria-modal="true"
                    aria-label={currentDisplayTitle || current.alt}
                >
                    <button
                        className="absolute top-6 right-6 text-4xl font-heading hover:text-gray-500 z-50 p-2"
                        onClick={() => setLightboxIndex(-1)}
                        aria-label="Close lightbox"
                    >
                        &times;
                    </button>

                    <img
                        src={current.src}
                        alt={current.alt || current.title}
                        title={currentDisplayTitle || undefined}
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
                        {(currentDisplayTitle || current.alt) && (
                            <p className="font-heading tracking-widest text-lg text-gray-800 uppercase mb-1">
                                {currentDisplayTitle || current.alt}
                            </p>
                        )}
                        <p className="font-sans text-xs text-gray-500">
                            {lightboxIndex + 1} / {filteredImages.length}
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
