import React from 'react';
import { Home, Database} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();
  
  const navItems = [
    { icon: Home, label: 'Home', href: '/', active: pathname === '/' },
    { icon: Database, label: 'Historical Data', href: '/historical', active: pathname.startsWith('/historical') },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#F0F7F5] border-r border-[#2C645B]/10 flex flex-col py-6 px-4">
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="w-10 h-10 bg-[#2C645B] rounded-lg flex items-center justify-center">
          <span className="text-white font-mono font-semibold">DP</span>
        </div>
        <div>
          <h2 className="font-mono font-semibold text-[#2C645B]">DJANGO POWERS</h2>
          <p className="text-xs text-[#2C645B]/70">GO GREEN</p>
        </div>
      </div>
      
      <nav className="space-y-1">
        {navItems.map(({ icon: Icon, label, href, active }) => (
          <Link 
            key={label}
            href={href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-mono ${
              active 
                ? 'bg-[#2C645B]/10 text-[#2C645B] font-medium' 
                : 'text-[#2C645B]/70 hover:bg-[#2C645B]/5'
            }`}
          >
            <Icon size={20} />
            <span className="text-sm">{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;