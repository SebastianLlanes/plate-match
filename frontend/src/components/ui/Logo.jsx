export default function Logo({ size = "md", variant = "full" }) {
  const scales = {
    sm: 0.6,
    md: 1,
    lg: 1.4,
  };
  const s = scales[size] ?? 1;

  // Solo ícono (para favicon, BottomNav, app icon)
  if (variant === "icon") {
    return (
      <svg
        width={56 * s}
        height={36 * s}
        viewBox="0 0 56 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="56" height="36" rx="5" fill="#111827" />
        <text
          x="28"
          y="13"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="'Courier New', monospace"
          fontSize="9"
          fontWeight="700"
          fill="#ffffff"
          letterSpacing="2"
        >
          ABC
        </text>
        <text
          x="28"
          y="27"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="'Courier New', monospace"
          fontSize="9"
          fontWeight="700"
          fill="#10b981"
          letterSpacing="2"
        >
          123
        </text>
        <circle cx="46" cy="6" r="5" fill="#10b981" />
        <path
          d="M43 6 L46 9 L50 3"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // Wordmark solo (Chapa + Match)
  if (variant === "wordmark") {
    return (
      <svg
        width={160 * s}
        height={28 * s}
        viewBox="0 0 160 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <text
          x="0"
          y="22"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="22"
          fontWeight="700"
          fill="#111827"
          letterSpacing="-0.5"
        >
          Chapa
        </text>
        <text
          x="82"
          y="22"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="22"
          fontWeight="700"
          fill="#10b981"
          letterSpacing="-0.5"
        >
          Match
        </text>
      </svg>
    );
  }

  // Full: ícono + wordmark (default)
  return (
    <svg
      width={220 * s}
      height={40 * s}
      viewBox="0 0 220 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Placa */}
      <rect width="62" height="40" rx="5" fill="#111827" />
      <text
        x="31"
        y="15"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="'Courier New', monospace"
        fontSize="10"
        fontWeight="700"
        fill="#ffffff"
        letterSpacing="2"
      >
        ABC
      </text>
      <text
        x="31"
        y="29"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="'Courier New', monospace"
        fontSize="10"
        fontWeight="700"
        fill="#10b981"
        letterSpacing="2"
      >
        123
      </text>
      {/* Checkmark verde */}
      <circle cx="52" cy="7" r="6" fill="#10b981" />
      <path
        d="M49 7 L52 10 L56 4"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Wordmark */}
      <text
        x="74"
        y="27"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="26"
        fontWeight="700"
        fill="#111827"
        letterSpacing="-1"
      >
        Chapa
      </text>
      <text
        x="148"
        y="27"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="26"
        fontWeight="700"
        fill="#10b981"
        letterSpacing="-1"
      >
        Match
      </text>
    </svg>
  );
}