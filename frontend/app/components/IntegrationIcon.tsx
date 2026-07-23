import React from 'react';

interface IntegrationIconProps {
  name: string;
  className?: string;
}

export default function IntegrationIcon({ name, className = "w-6 h-6" }: IntegrationIconProps) {
  const n = name.toLowerCase();

  if (n.includes('google play')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 20.5V3.5C3 2.6 4 2.1 4.7 2.6L20.3 11.2C21.1 11.6 21.1 12.4 20.3 12.8L4.7 21.4C4 21.9 3 21.4 3 20.5Z" fill="url(#play-grad)" />
        <defs>
          <linearGradient id="play-grad" x1="3" y1="12" x2="21" y2="12" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00F0FF" />
            <stop offset="0.5" stopColor="#00FF85" />
            <stop offset="1" stopColor="#FFB800" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (n.includes('apple app store') || n.includes('app store')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="5" fill="#007AFF" />
        <path d="M12 4.5L6.5 14H17.5L12 4.5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.5 14H17.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 14V19.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (n.includes('gmail')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="4" width="20" height="16" rx="3" fill="#E5E7EB" />
        <path d="M2 7L12 13L22 7" stroke="#EA4335" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 19.5V7" stroke="#4285F4" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M22 19.5V7" stroke="#FBBC05" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M2 19.5H22" stroke="#34A853" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (n.includes('jira')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.5 3L3.5 11L11.5 19H19.5L11.5 3Z" fill="#0052CC" />
        <path d="M20.5 3L12.5 11L20.5 19H21.5L20.5 3Z" fill="#2684FF" opacity="0.8" />
        <path d="M3.5 11L11.5 19H3.5V11Z" fill="#0052CC" opacity="0.6" />
      </svg>
    );
  }

  if (n.includes('github')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
      </svg>
    );
  }

  if (n.includes('linear')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2050/svg">
        <path d="M12 2L2 22H22L12 2ZM12 6L18.5 19H5.5L12 6Z" fill="#5E6AD2" />
        <circle cx="12" cy="14" r="2.5" fill="#5E6AD2" />
      </svg>
    );
  }

  if (n.includes('slack')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="4" fill="#4A154B" />
        <path d="M8 8.5C8 9.3 7.3 10 6.5 10H5C4.2 10 3.5 9.3 3.5 8.5C3.5 7.7 4.2 7 5 7H6.5C7.3 7 8 7.7 8 8.5Z" fill="#E01E5A" />
        <path d="M9.5 8.5C9.5 9.3 8.8 10 8 10C7.2 10 6.5 9.3 6.5 8.5V5C6.5 4.2 7.2 3.5 8 3.5C8.8 3.5 9.5 4.2 9.5 5V8.5Z" fill="#E01E5A" />
        <path d="M15.5 8.5C15.5 7.7 16.2 7 17 7H18.5C19.3 7 20 7.7 20 8.5C20 9.3 19.3 10 18.5 10H17C16.2 10 15.5 9.3 15.5 8.5Z" fill="#36C5F0" />
        <path d="M14.5 8.5C14.5 7.7 15.2 7 16 7C16.8 7 17.5 7.7 17.5 8.5V5C17.5 4.2 16.8 3.5 16 3.5C15.2 3.5 14.5 4.2 14.5 5V8.5Z" fill="#36C5F0" />
        <path d="M16 15.5C16 14.7 16.7 14 17.5 14H19C19.8 14 20.5 14.7 20.5 15.5C20.5 16.3 19.8 17 19 17H17.5C16.7 17 16 16.3 16 15.5Z" fill="#2EB67D" />
        <path d="M14.5 15.5C14.5 14.7 15.2 14 16 14C16.8 14 17.5 14.7 17.5 15.5V19C17.5 19.8 16.8 20.5 16 20.5C15.2 20.5 14.5 19.8 14.5 19V15.5Z" fill="#2EB67D" />
        <path d="M8.5 15.5C8.5 16.3 7.8 17 7 17H5.5C4.7 17 4 16.3 4 15.5C4 14.7 4.7 14 5.5 14H7C7.8 14 8.5 14.7 8.5 15.5Z" fill="#ECB22E" />
        <path d="M9.5 15.5C9.5 16.3 8.8 17 8 17C7.2 17 6.5 16.3 6.5 15.5V19C6.5 19.8 7.2 20.5 8 20.5C8.8 20.5 9.5 19.8 9.5 19V15.5Z" fill="#ECB22E" />
      </svg>
    );
  }

  if (n.includes('trello')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="4" fill="#0079BF" />
        <rect x="4" y="4" width="6" height="12" rx="2" fill="white" />
        <rect x="14" y="4" width="6" height="7" rx="2" fill="white" />
      </svg>
    );
  }

  if (n.includes('trustpilot')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L15 9H22L16.5 13.5L18.5 20.5L12 16L5.5 20.5L7.5 13.5L2 9H9L12 2Z" fill="#00B67A" />
      </svg>
    );
  }

  if (n.includes('teams') || n.includes('microsoft teams')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="4" fill="#4B53BC" />
        <circle cx="9" cy="9" r="3.5" fill="white" />
        <path d="M4 18C4 14.5 6.5 13.5 9 13.5C11.5 13.5 14 14.5 14 18H4Z" fill="white" />
        <circle cx="16" cy="11.5" r="2.5" fill="#A6B0FA" />
        <path d="M12 18C12 15.5 13.8 14.8 15.5 14.8C17.2 14.8 19 15.5 19 18H12Z" fill="#A6B0FA" />
      </svg>
    );
  }

  if (n.includes('csv')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="18" height="18" rx="3" fill="#10B981" />
        <text x="5" y="14" fill="white" fontSize="8" fontWeight="bold" fontFamily="monospace">CSV</text>
      </svg>
    );
  }

  // Fallback default setting widget
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
