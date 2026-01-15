import React, { useState, useEffect } from 'react';

export default function GalleryGrid({ images }) {
    const [lightboxIndex, setLightboxIndex] = useState(-1);

    // Close lightbox on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setLightboxIndex(-1);
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        };
        if (lightboxIndex !== -1) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden'; // Lock scroll
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [lightboxIndex]);

    const openLightbox = (index) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(-1);

    const nextImage = (e) => {
        e?.stopPropagation();
        setLightboxIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e) => {
        e?.stopPropagation();
        setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    if (images.length === 0) {
        return <div className="text-center py-20 text-gray-400">No images found in this gallery yet.</div>;
    }

    return (
        <>
            {/* Masonry Grid */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {images.map((imgObj, idx) => (
                    <div
                        key={idx}
                        className="break-inside-avoid cursor-pointer group relative overflow-hidden"
                        onClick={() => openLightbox(idx)}
                    >
                        {/* Image (No grayscale, standard) */}
                        <img
                            src={imgObj.src}
                            alt={imgObj.title}
                            className="w-full h-auto transition-transform duration-700"
                            loading="lazy"
                        />

                        {/* Overlay (White fade on hover - Matches Home Style) */}
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/85 transition-colors duration-500 ease-in-out"></div>

                        {/* Title (Dark, appears on hover) */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 p-4">
                            <h3 className="text-gray-900 text-2xl font-heading tracking-widest uppercase text-center">
                                {imgObj.title}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox Overlay */}
            {lightboxIndex !== -1 && (
                <div
                    className="fixed inset-0 z-[60] bg-white/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
                    onClick={closeLightbox}
                >
                    {/* Close Button */}
                    <button
                        className="absolute top-6 right-6 text-4xl font-heading hover:text-gray-500 z-50 p-2"
                        onClick={closeLightbox}
                    >
                        &times;
                    </button>

                    {/* Image */}
                    <img
                        src={images[lightboxIndex].src}
                        alt="Full view"
                        className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />

                    {/* Nav Buttons */}
                    <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-4 text-3xl hover:bg-gray-100/50 rounded-full transition-colors"
                        onClick={prevImage}
                    >
                        &#10094;
                    </button>
                    <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-4 text-3xl hover:bg-gray-100/50 rounded-full transition-colors"
                        onClick={nextImage}
                    >
                        &#10095;
                    </button>

                    {/* Counter & Title */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
                        <p className="font-heading tracking-widest text-lg text-gray-800 uppercase mb-1">
                            {images[lightboxIndex].title}
                        </p>
                        <p className="font-sans text-xs text-gray-500">
                            {lightboxIndex + 1} / {images.length}
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
