import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation = () => {
  const pathname = usePathname();
  
  const tabs = [
    { label: 'Overview', href: '/', active: pathname === '/' },
    { label: 'Power Forecasting', href: '/forecasting', active: pathname === '/forecasting' }
  ];

  return (
    <nav className="mb-4 md:mb-6">
      <div className="text-xs md:text-sm text-gray-500 mb-2 hidden md:block">
        <Link href="/" className="hover:text-gray-700">Home</Link>
        <span className="mx-2">&gt;</span>
        <span className="text-gray-700">{tabs.find(tab => tab.active)?.label || 'Historical Data'}</span>
      </div>

      <div className="flex gap-2 md:gap-4 border-b">
        {tabs.map(({ label, href, active }) => (
          <Link
            key={label}
            href={href}
            className={`px-3 md:px-4 py-2 -mb-px transition-colors text-sm md:text-base ${
              active 
                ? 'border-b-2 border-[#2C645B] text-[#2C645B] font-mono font-medium' 
                : 'text-gray-400 hover:text-gray-600 font-mono'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;