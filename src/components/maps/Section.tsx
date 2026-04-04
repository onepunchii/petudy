import React from 'react';

interface SectionProps {
    id?: string;
    className?: string;
    children: React.ReactNode;
}

export default function Section({ id, className = "", children }: SectionProps) {
    return (
        <section id={id} className={`py-24 px-6 md:px-8 max-w-7xl mx-auto relative ${className}`}>
            {children}
        </section>
    );
}
