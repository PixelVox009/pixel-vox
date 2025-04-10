// components/PixelVoxLogo.tsx

type PixelVoxLogoProps = {
  width?: number;
  height?: number;
  className?: string;
};

export function PixelVoxLogo({ width = 200, height = 80, className = "" }: PixelVoxLogoProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 200" width={width} height={height} className={className}>
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6CAB" />
          <stop offset="100%" stopColor="#7C4DFF" />
        </linearGradient>
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6CAB" />
          <stop offset="100%" stopColor="#7C4DFF" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Icon - dịch sang trái để text sát hơn */}
      <g transform="translate(90, 100) scale(0.9)">
        <g>
          <polygon points="-30,-30 0,-50 30,-30 0,-10" fill="#9C64FF" />
          <polygon points="30,-30 40,-10 10,10 0,-10" fill="#7C4DFF" />
          <polygon points="-30,-30 -40,-10 -10,10 0,-10" fill="#B76EFF" />

          <rect x="-25" y="-5" width="10" height="10" fill="#FFFFFF" opacity="0.3" />
          <rect x="-10" y="-5" width="10" height="10" fill="#FFFFFF" opacity="0.5" />
          <rect x="5" y="-5" width="10" height="10" fill="#FFFFFF" opacity="0.3" />
          <rect x="-25" y="10" width="10" height="10" fill="#FFFFFF" opacity="0.5" />
          <rect x="-10" y="10" width="10" height="10" fill="#FFFFFF" opacity="0.3" />
          <rect x="5" y="10" width="10" height="10" fill="#FFFFFF" opacity="0.5" />
        </g>
      </g>

      {/* Text */}
      <g>
        <text
          x="150"
          y="105"
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
          fontSize="70"
          letterSpacing="1"
          fill="#333333"
        >
          PIXEL
        </text>
        <text
          x="380" // tách ra xa để không dính
          y="105"
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
          fontSize="70"
          letterSpacing="1"
          fill="url(#textGradient)"
        >
          VOX
        </text>
      </g>
    </svg>
  );
}
export default PixelVoxLogo;
