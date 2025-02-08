'use client'
import { useState, ReactNode } from 'react';

interface PopoverProps {
  trigger: ReactNode;
  content: ReactNode;
}

export function Popover({ trigger, content }: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      {isOpen && (
        <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg z-50">
          {content}
        </div>
      )}
    </div>
  );
} 