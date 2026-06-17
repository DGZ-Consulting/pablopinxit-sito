import React, { useState } from 'react';

export default function Navigation({ categories = [] }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    };

    return (
        <>
            <button
                onClick={toggleMenu}
                className="z-50 p-2 focus:outline-none cursor-pointer group"
                aria-label="Toggle Menu"
            >
                <div className="w-8 h-6 flex flex-col justify-between items-end">
                    <span className={`h-[2px] w-full bg-black transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
                    <span className={`h-[2px] w-2/3 bg-black transition-all duration-300 group-hover:w-full ${isOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`h-[2px] w-full bg-black transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
                </div>
            </button>

            <div
                className={`fixed inset-0 bg-white z-40 flex flex-col items-center overflow-y-auto pt-32 pb-16 transition-opacity duration-500 ease-in-out ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                    }`}
            >
                <nav className="flex flex-col gap-6 text-center">
                    <a href="/" onClick={toggleMenu} className="text-4xl font-heading hover:text-gray-500 transition-colors">
                        Home
                    </a>

                    {categories.map((cat) => (
                        <a
                            key={cat.slug}
                            href={`/${cat.slug}`}
                            onClick={toggleMenu}
                            className="text-3xl font-heading hover:text-gray-500 transition-colors uppercase tracking-wider block"
                        >
                            {cat.name}
                        </a>
                    ))}

                    <div className="mt-8 border-t pt-8 w-24 mx-auto border-gray-300"></div>

                    <a href="/about" onClick={toggleMenu} className="text-xl font-heading text-gray-500 hover:text-black transition-colors">
                        About Me
                    </a>
                    <a href="/contact" onClick={toggleMenu} className="text-xl font-heading text-gray-500 hover:text-black transition-colors">
                        Contact
                    </a>
                </nav>
            </div>
        </>
    );
}
