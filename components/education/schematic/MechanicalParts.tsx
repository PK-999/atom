import { useId } from "react";

/** Illustrative materials and cutaways. Coordinates are drawing units, not measurements. */
export function MaterialDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-steel`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#526777" />
        <stop offset=".22" stopColor="#b4c3ca" />
        <stop offset=".4" stopColor="#edf0ed" />
        <stop offset=".62" stopColor="#9eafb9" />
        <stop offset="1" stopColor="#415663" />
      </linearGradient>
      <linearGradient id={`${id}-copper`} x1="0" y1="0" x2="0" y2="1">
        <stop stopColor="#78462d" />
        <stop offset=".35" stopColor="#e9bb83" />
        <stop offset=".65" stopColor="#b67e4e" />
        <stop offset="1" stopColor="#69412f" />
      </linearGradient>
      <radialGradient id={`${id}-pellet`} cx=".3" cy=".25">
        <stop stopColor="#b1bac1" />
        <stop offset=".5" stopColor="#61707e" />
        <stop offset="1" stopColor="#283641" />
      </radialGradient>
    </defs>
  );
}

export function PressureVessel({ heat = true }: { heat?: boolean }) {
  const id = useId();
  return (
    <g>
      <MaterialDefs id={id} />
      <ellipse cx="50" cy="177" rx="47" ry="8" fill="#000" opacity=".16" />
      <path
        d="M12 40Q12 16 50 16T88 40V139Q88 167 50 170Q12 167 12 139Z"
        fill={`url(#${id}-steel)`}
        stroke="#4b606e"
        strokeWidth="2"
      />
      <path
        d="M26 53H74V138Q74 152 50 154Q26 152 26 138Z"
        fill="#233743"
        stroke="#738893"
        strokeWidth="2"
      />
      <path
        d="M33 70H67V137H33Z"
        fill={heat ? "#e8b557" : "#74838c"}
        opacity=".18"
      />
      {[34, 42, 50, 58, 66].map((x) => (
        <g key={x}>
          <rect
            x={x - 2}
            y="79"
            width="4"
            height="60"
            rx="2"
            fill={heat ? `url(#${id}-copper)` : `url(#${id}-steel)`}
          />
          <path
            d={`M${x} 83V135`}
            stroke={heat ? "#efc57c" : "#c5d1d5"}
            strokeWidth=".7"
          />
          <rect x={x - 1.2} y="0" width="2.4" height="76" fill="#97adb8" />
          <rect
            x={x - 3}
            y="5"
            width="6"
            height="17"
            rx="2"
            fill={`url(#${id}-steel)`}
            stroke="#536976"
            strokeWidth=".7"
          />
        </g>
      ))}
      <rect
        x="6"
        y="38"
        width="88"
        height="8"
        rx="2"
        fill={`url(#${id}-steel)`}
        stroke="#526570"
      />
      {[14, 26, 38, 50, 62, 74, 86].map((x) => (
        <circle key={x} cx={x} cy="42" r="1.7" fill="#354b59" />
      ))}
      <path d="M28 72H72M28 143H72" stroke="#a5b6bc" strokeWidth="3" />
      <path
        d="M6 67H26M74 67H94M6 132H26M74 132H94"
        stroke="#859ca7"
        strokeWidth="9"
      />
      <path d="M25 164V175M75 164V175" stroke="#526570" strokeWidth="8" />
    </g>
  );
}

export function SteamGenerator() {
  const id = useId();
  return (
    <g>
      <MaterialDefs id={id} />
      <path
        d="M15 45V27Q15 8 45 8T75 27V45L67 64V160Q67 176 45 176T23 160V64Z"
        fill={`url(#${id}-steel)`}
        stroke="#536c7a"
        strokeWidth="2"
      />
      <path d="M29 57H61V151H29Z" fill="#233a47" />
      <path d="M29 88H61V151H29Z" fill="#65bccb" opacity=".16" />
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M${33 + i * 4} 164V${88 - i * 9}Q45 ${65 - i * 9} ${57 - i * 4} ${88 - i * 9}V164`}
          fill="none"
          stroke="#e7ae6a"
          strokeWidth="2"
        />
      ))}
      <path d="M24 152H66M45 154V175" stroke="#a3b0b5" strokeWidth="3" />
      <path
        d="M26 35L34 29L42 35L50 29L58 35L66 29M26 44H64"
        fill="none"
        stroke="#526d7b"
        strokeWidth="2"
      />
      <path d="M45 8V0M67 113H80" stroke="#99b7bf" strokeWidth="9" />
      <path d="M23 164H12M67 164H78" stroke="#be9e7b" strokeWidth="8" />
      <path d="M29 76H61" stroke="#8cbdc4" strokeDasharray="3 3" />
    </g>
  );
}

/** Side section through an axial steam turbine; the stationary casing never rotates. */
export function TurbineCutaway({ selected = false }: { selected?: boolean }) {
  const id = useId();
  return (
    <g>
      <MaterialDefs id={id} />
      <path
        d="M8 36L130 10Q146 9 146 23V91Q146 103 130 102L8 78Z"
        fill={`url(#${id}-steel)`}
        stroke={selected ? "var(--atom-accent)" : "#506778"}
        strokeWidth="2"
      />
      <path d="M16 42L132 20V92L16 73Z" fill="#243846" />
      <path d="M0 57H161" stroke="#aebcc2" strokeWidth="7" />
      {Array.from({ length: 11 }, (_, i) => {
        const x = 24 + i * 10,
          h = 12 + i * 2.2;
        return (
          <g key={i}>
            <path
              d={`M${x - 2} ${57 - h}L${x + 3} ${59 - h}V${57 + h}L${x - 2} ${55 + h}Z`}
              fill={`url(#${id}-steel)`}
            />
            <path
              d={`M${x + 5} ${53 - h}V${53 - h / 3}M${x + 5} ${61 + h / 3}V${61 + h}`}
              stroke="#bd9a72"
              strokeWidth="1.5"
            />
          </g>
        );
      })}
      <path d="M8 79L132 103M8 33L132 8" stroke="#b5c4c9" strokeWidth="3" />
      {[20, 45, 70, 95, 120].map((x) => (
        <circle
          key={x}
          cx={x}
          cy={80 + (x - 8) * 0.19}
          r="1.8"
          fill="#4b626c"
        />
      ))}
      <path d="M23 83V108M117 100V108" stroke="#657f8a" strokeWidth="8" />
      <path d="M16 109H137" stroke="#9fafb6" strokeWidth="4" />
    </g>
  );
}

export function GeneratorCutaway({ selected = false }: { selected?: boolean }) {
  const id = useId();
  return (
    <g>
      <MaterialDefs id={id} />
      <rect
        x="6"
        y="12"
        width="88"
        height="70"
        rx="23"
        fill={`url(#${id}-steel)`}
        stroke={selected ? "var(--atom-accent)" : "#4c6875"}
        strokeWidth="2"
      />
      <path d="M23 25H78V69H23Z" fill="#243946" />
      {Array.from({ length: 9 }, (_, i) => (
        <g key={i}>
          <rect
            x={25 + i * 5.6}
            y="27"
            width="3.6"
            height="13"
            rx="1.5"
            fill={`url(#${id}-copper)`}
          />
          <rect
            x={25 + i * 5.6}
            y="54"
            width="3.6"
            height="13"
            rx="1.5"
            fill={`url(#${id}-copper)`}
          />
        </g>
      ))}
      <path d="M0 47H100" stroke="#b6c6cd" strokeWidth="5" />
      <rect
        x="23"
        y="42"
        width="55"
        height="10"
        rx="4"
        fill={`url(#${id}-steel)`}
      />
      <path d="M18 21V74M83 21V74" stroke="#8ba3ac" strokeWidth="3" />
      <path d="M25 83V90M75 83V90" stroke="#69838c" strokeWidth="8" />
      <path d="M17 91H85" stroke="#9aacb4" strokeWidth="4" />
    </g>
  );
}

export function CoolantPump() {
  const id = useId();
  return (
    <g>
      <MaterialDefs id={id} />
      <rect
        x="14"
        y="0"
        width="24"
        height="22"
        rx="4"
        fill={`url(#${id}-steel)`}
        stroke="#526878"
      />
      <circle
        cx="26"
        cy="37"
        r="21"
        fill={`url(#${id}-steel)`}
        stroke="#526878"
        strokeWidth="2"
      />
      <circle cx="26" cy="37" r="13" fill="#2c4451" />
      {[0, 72, 144, 216, 288].map((a) => (
        <path
          key={a}
          transform={`rotate(${a} 26 37)`}
          d="M26 37Q21 27 29 25"
          fill="none"
          stroke="#b0c6cb"
          strokeWidth="2"
        />
      ))}
      <circle cx="26" cy="37" r="4" fill="#adbfca" />
    </g>
  );
}

export function CondenserCutaway({ selected = false }: { selected?: boolean }) {
  const id = useId();
  return (
    <g>
      <MaterialDefs id={id} />
      <rect
        x="0"
        y="0"
        width="120"
        height="58"
        rx="10"
        fill={`url(#${id}-steel)`}
        stroke={selected ? "var(--atom-accent)" : "#526878"}
        strokeWidth="2"
      />
      <rect x="12" y="9" width="96" height="39" rx="3" fill="#243c49" />
      {[17, 25, 33, 41].map((y) => (
        <path key={y} d={`M12 ${y}H108`} stroke="#85bcb0" strokeWidth="2.5" />
      ))}
      <path d="M12 48H108" stroke="#83c2d6" strokeWidth="4" />
      <path d="M7 8V49M113 8V49" stroke="#809b9f" strokeWidth="3" />
    </g>
  );
}
