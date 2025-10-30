import React from "react";

export const MenuIconCircle: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="22" cy="22" r="20" fill="rgba(100,108,255,0.12)"/>
        <rect x="12" y="16" width="20" height="2.5" rx="1.25" fill="currentColor"/>
        <rect x="12" y="21" width="20" height="2.5" rx="1.25" fill="currentColor"/>
        <rect x="12" y="26" width="20" height="2.5" rx="1.25" fill="currentColor"/>
    </svg>
);