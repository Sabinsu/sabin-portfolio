/** CSS/SVG avatar used when WebGL is unavailable or reduced motion is requested. */
export default function RobotAvatarFallback({ speaking }) {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="rb" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e8eef8" />
          <stop offset="1" stopColor="#a9b9d4" />
        </linearGradient>
      </defs>
      <line x1="50" y1="12" x2="50" y2="22" stroke="#a9b9d4" strokeWidth="2" />
      <circle cx="50" cy="10" r="4" fill="#8b7cf6" />
      <rect x="22" y="22" width="56" height="48" rx="22" fill="url(#rb)" />
      <rect x="29" y="33" width="42" height="24" rx="12" fill="#0f1623" />
      <ellipse cx="41" cy="45" rx="4.5" ry="6" fill="#22d3ee">
        <animate attributeName="ry" values="6;6;0.6;6" keyTimes="0;0.9;0.95;1" dur="4s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="59" cy="45" rx="4.5" ry="6" fill="#22d3ee">
        <animate attributeName="ry" values="6;6;0.6;6" keyTimes="0;0.9;0.95;1" dur="4s" repeatCount="indefinite" />
      </ellipse>
      <rect x="44" y="62" width="12" height="2.5" rx="1.2" fill="#22d3ee">
        {speaking && <animate attributeName="height" values="2.5;6;2.5" dur="0.35s" repeatCount="indefinite" />}
      </rect>
      <rect x="32" y="74" width="36" height="20" rx="10" fill="url(#rb)" />
      <circle cx="50" cy="84" r="3.5" fill="#22d3ee" />
    </svg>
  );
}
