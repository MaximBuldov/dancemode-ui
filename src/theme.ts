import { ThemeConfig } from 'antd';

// Palette taken from the brand logo (public/logo305.png)
export const colors = {
  primary: '#6b1f1f', // burgundy of the "DANCE MODE" lettering
  text: '#3d1c1c', // deep burgundy-brown for body text
  textSecondary: '#8a7272', // muted tone of the line-art figure / "MODE"
  background: '#f8f2f2', // logo background blush
  surface: '#ffffff',
  border: '#eadede'
};

// Pastel status palette used by Tag / Badge / Ribbon presets.
// bg + border give the soft fill; text is dark enough to read on bg (>= 5:1)
// and doubles as the fill for `variant="solid"` tags and ribbons.
const pastel = {
  green: { bg: '#e8f3ea', border: '#c8e2ce', text: '#3e6b4b' },
  red: { bg: '#fbecee', border: '#f1cdd2', text: '#9a3f4a' },
  volcano: { bg: '#fcefe9', border: '#f3d3c4', text: '#93492f' },
  orange: { bg: '#fdf2e7', border: '#f3dabf', text: '#8a5523' },
  gold: { bg: '#fbf5e3', border: '#efe0b5', text: '#7a5f1c' },
  cyan: { bg: '#e6f4f3', border: '#c3e3e0', text: '#2f6b67' },
  blue: { bg: '#eaf1f9', border: '#cbdcef', text: '#3c5f8c' },
  geekblue: { bg: '#eeeefa', border: '#d3d4f0', text: '#4b4d8f' },
  purple: { bg: '#f3eef9', border: '#ddd0ec', text: '#634a87' },
  magenta: { bg: '#f9edf4', border: '#ecd0e1', text: '#8a3f6b' }
};

// antd derives preset tags from the 1 / 3 / 6 / 7 shades of each color
const presetTokens = Object.fromEntries(
  Object.entries(pastel).flatMap(([name, { bg, border, text }]) => [
    [`${name}1`, bg],
    [`${name}3`, border],
    [`${name}6`, text],
    [`${name}7`, text]
  ])
);

export const statusColors = {
  success: pastel.green.text,
  error: pastel.red.text,
  warning: pastel.orange.text
};

export const theme: ThemeConfig = {
  token: {
    colorPrimary: colors.primary,
    colorInfo: colors.primary,
    colorLink: colors.primary,
    colorTextBase: colors.text,
    colorBgLayout: colors.background,
    colorBorder: colors.border,
    colorBorderSecondary: '#f1e7e7',
    borderRadius: 8,

    ...presetTokens,
    colorSuccess: statusColors.success,
    colorSuccessBg: pastel.green.bg,
    colorSuccessBorder: pastel.green.border,
    colorError: statusColors.error,
    colorErrorBg: pastel.red.bg,
    colorErrorBorder: pastel.red.border,
    colorWarning: statusColors.warning,
    colorWarningBg: pastel.orange.bg,
    colorWarningBorder: pastel.orange.border,
    colorInfoBg: '#f6eaea',
    colorInfoBorder: '#e8cfcf'
  },
  components: {
    Button: {
      // antd's default 2px drop shadow reads as a stray bottom border on burgundy
      primaryShadow: 'none',
      defaultShadow: 'none',
      dangerShadow: 'none'
    },
    Layout: {
      headerBg: colors.background,
      headerColor: colors.primary,
      bodyBg: colors.background
    }
  }
};
