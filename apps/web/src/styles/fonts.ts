import localFont from 'next/font/local';

const gilroy = localFont({
  src: [
    {
      path: '../fonts/gilroy/thin.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../fonts/gilroy/ultralight.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../fonts/gilroy/light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../fonts/gilroy/regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/gilroy/medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/gilroy/semibold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../fonts/gilroy/bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../fonts/gilroy/extrabold.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../fonts/gilroy/black.woff2',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../fonts/gilroy/thin-italic.woff2',
      weight: '100',
      style: 'italic',
    },
    {
      path: '../fonts/gilroy/ultralight-italic.woff2',
      weight: '200',
      style: 'italic',
    },
    {
      path: '../fonts/gilroy/light-italic.woff2',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../fonts/gilroy/regular-italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../fonts/gilroy/medium-italic.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../fonts/gilroy/semibold-italic.woff2',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../fonts/gilroy/bold-italic.woff2',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../fonts/gilroy/extrabold-italic.woff2',
      weight: '800',
      style: 'italic',
    },
    {
      path: '../fonts/gilroy/black-italic.woff2',
      weight: '900',
      style: 'italic',
    },
  ],
  variable: '--font-gilroy',
});

export { gilroy };
