import React from 'react';

interface PricingCardProps {
    title: string;
    price: string;
    features: string[];
    isPopular?: boolean;
    ctaText?: string;
}

export default function PricingCard({ title, price, features, isPopular = false, ctaText = "Get Started" }: PricingCardProps) {
    return (
        <div className={`
            relative p-8 rounded-3xl border flex flex-col h-full transition-all duration-300
            ${isPopular
                ? 'bg-[#141414] border-[#FF5500]/50 shadow-[0_0_30px_rgba(255,85,0,0.15)] scale-105 z-10'
                : 'bg-[#0F0F0F] border-white/5 hover:border-white/10'
            }
        `}>
            {isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#FF5500] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                    Most Popular
                </div>
            )}

            <h3 className={`text-xl font-bold mb-2 ${isPopular ? 'text-white' : 'text-[#B0B0B0]'}`}>{title}</h3>
            <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-bold text-white">${price}</span>
                <span className="text-[#666666] text-sm">/month</span>
            </div>

            <ul className="flex-1 space-y-4 mb-8">
                {features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-[#B0B0B0]">
                        <svg className={`w-5 h-5 flex-shrink-0 ${isPopular ? 'text-[#FF5500]' : 'text-[#666666]'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                    </li>
                ))}
            </ul>

            <button className={`
                w-full py-4 rounded-full font-bold text-sm transition-all duration-300
                ${isPopular
                    ? 'bg-[#FF5500] text-white hover:bg-[#FF6600] shadow-lg hover:shadow-[#FF5500]/30'
                    : 'bg-white/5 text-white hover:bg-white/10 border border-white/5'
                }
            `}>
                {ctaText}
            </button>
        </div>
    );
}
