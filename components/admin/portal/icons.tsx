/* Admin portal iconography — stroked SVG on a 24px grid, sized by the caller
   through currentColor + width/height. Deliberately SVG rather than the text
   glyphs the legacy console used, so weight and alignment stay consistent. */

import type { ReactNode } from "react";

type P = { size?: number };

function S({ size = 18, children }: P & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const IconDashboard = (p: P) => (
  <S {...p}>
    <rect x="3" y="3" width="7.5" height="8.5" rx="1.5" />
    <rect x="13.5" y="3" width="7.5" height="5.5" rx="1.5" />
    <rect x="13.5" y="11.5" width="7.5" height="9.5" rx="1.5" />
    <rect x="3" y="14.5" width="7.5" height="6.5" rx="1.5" />
  </S>
);

export const IconBox = (p: P) => (
  <S {...p}>
    <path d="M3 7.5l9-4.5 9 4.5v9L12 21l-9-4.5v-9z" />
    <path d="M3 7.5l9 4.5 9-4.5M12 12v9" />
  </S>
);

export const IconTag = (p: P) => (
  <S {...p}>
    <path d="M3 12.5V4.5A1.5 1.5 0 0 1 4.5 3h8l8.5 8.5a1.6 1.6 0 0 1 0 2.2l-6.8 6.8a1.6 1.6 0 0 1-2.2 0z" />
    <circle cx="7.8" cy="7.8" r="1.4" />
  </S>
);

export const IconPlus = (p: P) => (
  <S {...p}>
    <path d="M12 5v14M5 12h14" />
  </S>
);

export const IconSearch = (p: P) => (
  <S {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20 20l-4.2-4.2" />
  </S>
);

export const IconEdit = (p: P) => (
  <S {...p}>
    <path d="M4 20h4l10-10a2.1 2.1 0 0 0-3-3L5 17v3z" />
    <path d="M14.5 6.5l3 3" />
  </S>
);

export const IconTrash = (p: P) => (
  <S {...p}>
    <path d="M4 7h16M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
    <path d="M6.5 7l.8 12a1.6 1.6 0 0 0 1.6 1.5h6.2a1.6 1.6 0 0 0 1.6-1.5l.8-12" />
    <path d="M10.5 11v6M13.5 11v6" />
  </S>
);

export const IconStar = (p: P) => (
  <S {...p}>
    <path d="M12 3.6l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.8l5.9-.8z" />
  </S>
);

export const IconEye = (p: P) => (
  <S {...p}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
    <circle cx="12" cy="12" r="2.8" />
  </S>
);

export const IconEyeOff = (p: P) => (
  <S {...p}>
    <path d="M4 4l16 16" />
    <path d="M9.9 5.8A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-3.3 4.1" />
    <path d="M6.6 7.6A16.7 16.7 0 0 0 2.5 12S6 18.5 12 18.5a9.9 9.9 0 0 0 4-.83" />
    <path d="M10 10.1a2.8 2.8 0 0 0 3.9 3.9" />
  </S>
);

export const IconLayout = (p: P) => (
  <S {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M3 9.5h18M9 9.5V20" />
  </S>
);

export const IconSettings = (p: P) => (
  <S {...p}>
    <circle cx="12" cy="12" r="2.9" />
    <path d="M19.2 14.4a1.5 1.5 0 0 0 .3 1.65l.05.06a1.8 1.8 0 1 1-2.55 2.55l-.06-.06a1.5 1.5 0 0 0-1.65-.3 1.5 1.5 0 0 0-.91 1.37v.17a1.8 1.8 0 0 1-3.6 0v-.09a1.5 1.5 0 0 0-.98-1.37 1.5 1.5 0 0 0-1.65.3l-.06.06a1.8 1.8 0 1 1-2.55-2.55l.06-.06a1.5 1.5 0 0 0 .3-1.65 1.5 1.5 0 0 0-1.37-.91h-.17a1.8 1.8 0 0 1 0-3.6h.09a1.5 1.5 0 0 0 1.37-.98 1.5 1.5 0 0 0-.3-1.65l-.06-.06a1.8 1.8 0 1 1 2.55-2.55l.06.06a1.5 1.5 0 0 0 1.65.3h.07a1.5 1.5 0 0 0 .91-1.37v-.17a1.8 1.8 0 0 1 3.6 0v.09a1.5 1.5 0 0 0 .91 1.37 1.5 1.5 0 0 0 1.65-.3l.06-.06a1.8 1.8 0 1 1 2.55 2.55l-.06.06a1.5 1.5 0 0 0-.3 1.65v.07a1.5 1.5 0 0 0 1.37.91h.17a1.8 1.8 0 0 1 0 3.6h-.09a1.5 1.5 0 0 0-1.37.91z" />
  </S>
);

export const IconSort = (p: P) => (
  <S {...p}>
    <path d="M7.5 4.5v15M7.5 4.5L4.5 8M7.5 4.5L10.5 8" />
    <path d="M16.5 19.5v-15M16.5 19.5L13.5 16M16.5 19.5L19.5 16" />
  </S>
);

export const IconImage = (p: P) => (
  <S {...p}>
    <rect x="3" y="4.5" width="18" height="15" rx="2" />
    <circle cx="8.5" cy="9.5" r="1.6" />
    <path d="M3.5 17l4.8-4.6a1.8 1.8 0 0 1 2.5 0l3.4 3.3M14 14.6l1.6-1.5a1.8 1.8 0 0 1 2.5 0l2.4 2.3" />
  </S>
);

export const IconDownload = (p: P) => (
  <S {...p}>
    <path d="M12 4v11M12 15l-4-4M12 15l4-4" />
    <path d="M4.5 17.5V19A1.5 1.5 0 0 0 6 20.5h12a1.5 1.5 0 0 0 1.5-1.5v-1.5" />
  </S>
);

export const IconRefresh = (p: P) => (
  <S {...p}>
    <path d="M20 11.5A8 8 0 0 0 6.3 6.3L3.5 9" />
    <path d="M4 12.5a8 8 0 0 0 13.7 5.2L20.5 15" />
    <path d="M3.5 4.5V9H8M20.5 19.5V15H16" />
  </S>
);

export const IconLogout = (p: P) => (
  <S {...p}>
    <path d="M9 4.5H6A1.5 1.5 0 0 0 4.5 6v12A1.5 1.5 0 0 0 6 19.5h3" />
    <path d="M15.5 15.5L19 12l-3.5-3.5M19 12H9.5" />
  </S>
);

export const IconMenu = (p: P) => (
  <S {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </S>
);

export const IconClose = (p: P) => (
  <S {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </S>
);

export const IconExternal = (p: P) => (
  <S {...p}>
    <path d="M14 4h6v6" />
    <path d="M20 4l-8.5 8.5" />
    <path d="M19 14.5V19a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19V6.5A1.5 1.5 0 0 1 5 5h4.5" />
  </S>
);

export const IconAlert = (p: P) => (
  <S {...p}>
    <path d="M12 4l9 15H3L12 4z" />
    <path d="M12 10v4M12 16.6v.1" />
  </S>
);
