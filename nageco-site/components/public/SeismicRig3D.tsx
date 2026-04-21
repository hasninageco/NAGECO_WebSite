"use client";

import { useState } from "react";

type SeismicRig3DProps = {
  className?: string;
};

export function SeismicRig3D({ className = "" }: SeismicRig3DProps) {
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({
    ["--nageco-rig-rotate-x" as string]: "0deg",
    ["--nageco-rig-rotate-y" as string]: "0deg",
    ["--nageco-rig-lift" as string]: "0px"
  });

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5;

    setTiltStyle({
      ["--nageco-rig-rotate-x" as string]: `${offsetY * -5}deg`,
      ["--nageco-rig-rotate-y" as string]: `${offsetX * 8}deg`,
      ["--nageco-rig-lift" as string]: "-3px"
    });
  }

  function handlePointerLeave() {
    setTiltStyle({
      ["--nageco-rig-rotate-x" as string]: "0deg",
      ["--nageco-rig-rotate-y" as string]: "0deg",
      ["--nageco-rig-lift" as string]: "0px"
    });
  }

  return (
    <div className={`nageco-rig3d ${className}`.trim()} aria-hidden="true">
      <div className="nageco-rig3d__track">
        <div
          className="nageco-rig3d__interactive"
          style={tiltStyle}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <svg
            className="nageco-rig3d__svg"
            viewBox="0 0 980 420"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse cx="490" cy="364" rx="320" ry="24" fill="rgba(8,17,31,0.12)" />

            <g className="nageco-rig3d__ground-waves">
              <ellipse className="nageco-rig3d__ground-wave nageco-rig3d__ground-wave--1" cx="505" cy="360" rx="24" ry="8" />
              <ellipse className="nageco-rig3d__ground-wave nageco-rig3d__ground-wave--2" cx="505" cy="360" rx="42" ry="13" />
              <ellipse className="nageco-rig3d__ground-wave nageco-rig3d__ground-wave--3" cx="505" cy="360" rx="60" ry="18" />
              <ellipse className="nageco-rig3d__ground-wave nageco-rig3d__ground-wave--4" cx="505" cy="360" rx="82" ry="24" />
            </g>

            <g className="nageco-rig3d__vehicle-svg">
              <rect x="105" y="186" width="565" height="30" rx="4" fill="#EEF3F8" stroke="#C8D4E0" strokeWidth="3" />
              <rect x="110" y="216" width="245" height="44" fill="#5D6772" opacity="0.55" />
              <path d="M355 216H645L600 260H355V216Z" fill="#DDE6EF" stroke="#C8D4E0" strokeWidth="3" />

              <path d="M120 110L230 110L245 185H140L120 110Z" fill="#F3F7FB" stroke="#C9D5E1" strokeWidth="3" />
              <rect x="195" y="116" width="70" height="60" rx="4" fill="#636C77" opacity="0.28" />
              <rect x="252" y="120" width="68" height="58" rx="4" fill="#AAB6C2" stroke="#C8D4E0" strokeWidth="2" />
              <circle cx="315" cy="104" r="11" fill="#B7C2CD" stroke="#7D8792" strokeWidth="2" />
              <rect x="300" y="75" width="18" height="46" rx="4" fill="#99A4AF" stroke="#6B7682" strokeWidth="2" />
              <rect x="338" y="132" width="54" height="26" rx="5" fill="#5C6671" />
              <rect x="334" y="108" width="82" height="48" rx="4" fill="#7E8893" stroke="#66717D" strokeWidth="2" />
              <rect x="348" y="94" width="12" height="20" rx="3" fill="#6D7782" />
              <rect x="378" y="95" width="10" height="18" rx="3" fill="#6D7782" />
              <path d="M388 110L438 110" stroke="#7B858F" strokeWidth="10" strokeLinecap="round" />
              <path d="M372 102L414 88" stroke="#7B858F" strokeWidth="7" strokeLinecap="round" />
              <circle cx="430" cy="106" r="14" fill="#D7E0E8" stroke="#7B858F" strokeWidth="3" />
              <path d="M433 104L480 86" stroke="#88929D" strokeWidth="7" strokeLinecap="round" />

              <rect x="520" y="112" width="18" height="54" rx="4" fill="#99A4AF" stroke="#6B7682" strokeWidth="2" />
              <rect x="500" y="130" width="58" height="56" rx="5" fill="#DCE5EE" stroke="#C8D4E0" strokeWidth="3" />
              <rect x="602" y="132" width="20" height="54" rx="5" fill="#B7C2CD" stroke="#7B858F" strokeWidth="2" />
              <path d="M618 132C636 94 673 98 687 140" stroke="#76818C" strokeWidth="8" strokeLinecap="round" />
              <path d="M686 140L718 171" stroke="#76818C" strokeWidth="8" strokeLinecap="round" />
              <rect x="660" y="115" width="28" height="71" rx="7" fill="#DDE6EF" stroke="#C8D4E0" strokeWidth="3" />

              <rect x="645" y="191" width="105" height="24" fill="#58616C" />
              <rect x="722" y="178" width="60" height="15" rx="3" fill="#4D5661" />
              <rect x="720" y="196" width="24" height="56" fill="#4C5560" />
              <rect x="757" y="196" width="24" height="56" fill="#4C5560" />

              <path d="M740 215L835 215L792 260H712L740 215Z" fill="#A8B4C0" stroke="#C8D4E0" strokeWidth="3" />

              <g>
                <path d="M785 98L905 98L922 110L922 225L808 225L785 198V98Z" fill="#F4F8FC" stroke="#C8D4E0" strokeWidth="3" />
                <path d="M792 106L895 106L905 110L905 119L790 119L792 106Z" fill="#D8DEE5" />
                <path d="M801 122L885 122C892 122 898 128 898 135V202C898 210 892 216 885 216H814C806 216 800 210 800 202L801 122Z" fill="url(#cabGlassSide)" stroke="#3A4350" strokeWidth="4" />
                <path d="M905 122L922 132V210L905 216V122Z" fill="#E1E8EF" stroke="#C8D4E0" strokeWidth="2" />
                <path d="M772 206L798 206L818 238L785 238L772 206Z" fill="#E6EEF6" stroke="#C8D4E0" strokeWidth="2" />
                <path d="M765 238H848L826 276H744L765 238Z" fill="#3B4551" opacity="0.42" />
                <path className="nageco-rig3d__front-lamp-beam" d="M905 100L970 78L970 122L905 100Z" fill="#FF6B6B" />
                <circle className="nageco-rig3d__front-lamp-glow" cx="904" cy="100" r="18" fill="#EF4444" />
                <circle className="nageco-rig3d__front-lamp" cx="904" cy="100" r="7" fill="#FF3B30" />
                <path d="M830 214L845 214" stroke="#FF3B30" strokeWidth="4" strokeLinecap="round" />
                <path d="M848 214L863 214" stroke="#FF3B30" strokeWidth="4" strokeLinecap="round" />
                <rect x="790" y="141" width="16" height="48" rx="5" fill="#9BA6B1" opacity="0.65" />
              </g>

              <g stroke="#E9F1F8" strokeWidth="4" strokeLinecap="round">
                <path d="M130 115V185" />
                <path d="M160 115V185" />
                <path d="M102 125V215" />
                <path d="M466 115V215" />
                <path d="M488 115V215" />
                <path d="M593 115V215" />
                <path d="M618 115V215" />
                <path d="M735 142V214" />
                <path d="M770 142V214" />
                <path d="M820 134V214" />
                <path d="M108 145H463" />
                <path d="M108 175H463" />
                <path d="M488 145H690" />
                <path d="M488 175H690" />
                <path d="M735 150H835" />
                <path d="M735 176H835" />
                <path d="M835 176L865 210" />
              </g>

              <g className="nageco-rig3d__operation-unit">
                <circle className="nageco-rig3d__beacon-glow" cx="508" cy="210" r="15" fill="#EF4444" />
                <circle className="nageco-rig3d__beacon" cx="508" cy="210" r="6" fill="#FF3B30" />
                <rect x="500" y="215" width="16" height="58" rx="5" fill="#CBD6E0" />
                <rect x="462" y="260" width="88" height="26" rx="4" fill="#D3DDE7" stroke="#C0CCD8" strokeWidth="3" />
                <rect x="446" y="286" width="118" height="27" rx="4" fill="#B9C6D2" stroke="#AAB8C5" strokeWidth="3" />
                <rect x="455" y="313" width="28" height="22" rx="4" fill="#12171D" />
                <rect x="491" y="313" width="28" height="22" rx="4" fill="#12171D" />
                <rect x="527" y="313" width="28" height="22" rx="4" fill="#12171D" />
                <rect className="nageco-rig3d__operation-plate" x="477" y="336" width="56" height="10" rx="4" fill="#1A222C" />

                <path className="nageco-rig3d__wave nageco-rig3d__wave--1" d="M501 340Q505 344 509 340" stroke="#58B3FF" strokeWidth="3" />
                <path className="nageco-rig3d__wave nageco-rig3d__wave--2" d="M497 341Q505 347 513 341" stroke="#7FD0FF" strokeWidth="2.8" />
                <path className="nageco-rig3d__wave nageco-rig3d__wave--3" d="M492 342Q505 351 518 342" stroke="#7FD0FF" strokeWidth="2.8" />
                <path className="nageco-rig3d__wave nageco-rig3d__wave--4" d="M486 343Q505 357 524 343" stroke="#9FDEFF" strokeWidth="2.6" />
                <path className="nageco-rig3d__wave nageco-rig3d__wave--5" d="M479 344Q505 364 531 344" stroke="#9FDEFF" strokeWidth="2.6" />
                <path className="nageco-rig3d__wave nageco-rig3d__wave--6" d="M471 345Q505 372 539 345" stroke="#B6EAFF" strokeWidth="2.4" />
                <path className="nageco-rig3d__wave nageco-rig3d__wave--7" d="M462 346Q505 381 548 346" stroke="#B6EAFF" strokeWidth="2.4" />
                <path className="nageco-rig3d__wave nageco-rig3d__wave--8" d="M452 347Q505 391 558 347" stroke="#CBEFFF" strokeWidth="2.2" />
                <path className="nageco-rig3d__wave nageco-rig3d__wave--9" d="M441 348Q505 402 569 348" stroke="#CBEFFF" strokeWidth="2.2" />
                <path className="nageco-rig3d__wave nageco-rig3d__wave--10" d="M429 349Q505 414 581 349" stroke="#D8F3FF" strokeWidth="2" />
                <path className="nageco-rig3d__wave nageco-rig3d__wave--11" d="M416 350Q505 427 594 350" stroke="#D8F3FF" strokeWidth="2" />
                <path className="nageco-rig3d__wave nageco-rig3d__wave--12" d="M402 351Q505 441 608 351" stroke="#A9E5FF" strokeWidth="2.3" />
                <path className="nageco-rig3d__wave nageco-rig3d__wave--13" d="M387 352Q505 456 623 352" stroke="#A9E5FF" strokeWidth="2.3" />
                <path className="nageco-rig3d__wave nageco-rig3d__wave--14" d="M371 353Q505 472 639 353" stroke="#D1F1FF" strokeWidth="2.1" />
                <path className="nageco-rig3d__wave nageco-rig3d__wave--15" d="M354 354Q505 489 656 354" stroke="#D1F1FF" strokeWidth="2.1" />
                <path className="nageco-rig3d__wave nageco-rig3d__wave--16" d="M336 355Q505 507 674 355" stroke="#DDF5FF" strokeWidth="2" />
                <path className="nageco-rig3d__wave nageco-rig3d__wave--17" d="M317 356Q505 526 693 356" stroke="#E8F8FF" strokeWidth="1.9" />
                <path className="nageco-rig3d__wave nageco-rig3d__wave--18" d="M297 357Q505 546 713 357" stroke="#F1FBFF" strokeWidth="1.8" />
                <path className="nageco-rig3d__wave nageco-rig3d__wave--19" d="M276 358Q505 567 734 358" stroke="#F7FDFF" strokeWidth="1.7" />
                <path className="nageco-rig3d__wave nageco-rig3d__wave--20" d="M254 359Q505 589 756 359" stroke="#FFFFFF" strokeWidth="1.6" />
              </g>

              <g className="nageco-rig3d__wheel-group" transform="translate(280 302)">
                <g className="nageco-rig3d__wheel-spin">
                  <circle r="62" fill="url(#tireFill)" />
                  <g className="nageco-rig3d__wheel-tread">
                    <line x1="0" y1="-62" x2="0" y2="-48" stroke="#404A56" strokeWidth="5" strokeLinecap="round" />
                    <line x1="44" y1="-44" x2="34" y2="-34" stroke="#404A56" strokeWidth="5" strokeLinecap="round" />
                    <line x1="62" y1="0" x2="48" y2="0" stroke="#404A56" strokeWidth="5" strokeLinecap="round" />
                    <line x1="44" y1="44" x2="34" y2="34" stroke="#404A56" strokeWidth="5" strokeLinecap="round" />
                    <line x1="0" y1="62" x2="0" y2="48" stroke="#404A56" strokeWidth="5" strokeLinecap="round" />
                    <line x1="-44" y1="44" x2="-34" y2="34" stroke="#404A56" strokeWidth="5" strokeLinecap="round" />
                    <line x1="-62" y1="0" x2="-48" y2="0" stroke="#404A56" strokeWidth="5" strokeLinecap="round" />
                    <line x1="-44" y1="-44" x2="-34" y2="-34" stroke="#404A56" strokeWidth="5" strokeLinecap="round" />
                  </g>
                  <circle r="46" fill="#0B1016" />
                  <circle r="22" className="nageco-rig3d__wheel-hub" fill="#EDF4FA" />
                  <circle r="11" fill="#D0D9E1" />
                </g>
              </g>

              <g className="nageco-rig3d__wheel-group" transform="translate(335 310)">
                <g className="nageco-rig3d__wheel-spin" opacity="0.65">
                  <circle r="47" fill="url(#tireFill)" />
                  <circle r="35" fill="#0B1016" />
                  <circle r="16" fill="#EAF2F9" />
                </g>
              </g>

              <g className="nageco-rig3d__wheel-group" transform="translate(795 302)">
                <g className="nageco-rig3d__wheel-spin">
                  <circle r="62" fill="url(#tireFill)" />
                  <g className="nageco-rig3d__wheel-tread">
                    <line x1="0" y1="-62" x2="0" y2="-48" stroke="#404A56" strokeWidth="5" strokeLinecap="round" />
                    <line x1="44" y1="-44" x2="34" y2="-34" stroke="#404A56" strokeWidth="5" strokeLinecap="round" />
                    <line x1="62" y1="0" x2="48" y2="0" stroke="#404A56" strokeWidth="5" strokeLinecap="round" />
                    <line x1="44" y1="44" x2="34" y2="34" stroke="#404A56" strokeWidth="5" strokeLinecap="round" />
                    <line x1="0" y1="62" x2="0" y2="48" stroke="#404A56" strokeWidth="5" strokeLinecap="round" />
                    <line x1="-44" y1="44" x2="-34" y2="34" stroke="#404A56" strokeWidth="5" strokeLinecap="round" />
                    <line x1="-62" y1="0" x2="-48" y2="0" stroke="#404A56" strokeWidth="5" strokeLinecap="round" />
                    <line x1="-44" y1="-44" x2="-34" y2="-34" stroke="#404A56" strokeWidth="5" strokeLinecap="round" />
                  </g>
                  <circle r="46" fill="#0B1016" />
                  <circle r="22" className="nageco-rig3d__wheel-hub" fill="#EDF4FA" />
                  <circle r="11" fill="#D0D9E1" />
                </g>
              </g>

              <path d="M900 224H940V250H870L900 224Z" fill="#DDE6EF" stroke="#C8D4E0" strokeWidth="3" />
              <path d="M835 240L870 240L895 280H860L835 240Z" fill="#F1F6FB" stroke="#C8D4E0" strokeWidth="2" />
              <path d="M840 242L878 242L896 276H886L864 250L850 276H840L840 242Z" fill="#3C4652" />
            </g>

            <defs>
              <linearGradient id="cabGlassSide" x1="800" y1="122" x2="915" y2="210" gradientUnits="userSpaceOnUse">
                <stop stopColor="#D8E1EA" />
                <stop offset="1" stopColor="#96A8B8" />
              </linearGradient>

              <radialGradient
                id="tireFill"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(-10 -16) rotate(53) scale(95)"
              >
                <stop stopColor="#303844" />
                <stop offset="0.56" stopColor="#141A21" />
                <stop offset="1" stopColor="#06090D" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}