/** Logos simplificados (SVG) de Mercado Pago y tarjetas, en gris para no competir con el botón. */
export default function PaymentLogos() {
  const box = "h-6 w-auto";
  return (
    <div
      className="flex flex-wrap items-center justify-center gap-3 opacity-70 grayscale"
      role="img"
      aria-label="Medios de pago: Mercado Pago, Visa, Mastercard y American Express"
    >
      <svg className={box} viewBox="0 0 100 24" aria-hidden="true">
        <ellipse cx="11" cy="12" rx="10" ry="7" fill="#00B1EA" />
        <path d="M4.5 12c2.5-2.6 4.5-2.6 6.5-.8s4 1.8 6.5-.9" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <text x="25" y="16" fontFamily="Arial" fontSize="10.5" fontWeight="700" fill="#0A0080">mercado pago</text>
      </svg>
      <svg className={box} viewBox="0 0 40 24" aria-hidden="true">
        <text x="20" y="17" textAnchor="middle" fontFamily="Arial" fontStyle="italic" fontWeight="900" fontSize="13" fill="#1A1F71">VISA</text>
      </svg>
      <svg className={box} viewBox="0 0 36 24" aria-hidden="true">
        <circle cx="14" cy="12" r="8" fill="#EB001B" />
        <circle cx="22" cy="12" r="8" fill="#F79E1B" fillOpacity="0.9" />
      </svg>
      <svg className={box} viewBox="0 0 40 24" aria-hidden="true">
        <rect x="2" y="3" width="36" height="18" rx="3" fill="#2E77BC" />
        <text x="20" y="16" textAnchor="middle" fontFamily="Arial" fontWeight="800" fontSize="9" fill="#fff">AMEX</text>
      </svg>
    </div>
  );
}
