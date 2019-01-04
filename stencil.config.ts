import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'wbr-youtube-player',
  outputTargets: [
    { type: 'dist' },
    { type: 'docs' },
    {
      type: 'www',
      serviceWorker: null // disable service workers
    }
  ],
  bundles: [{ components: ['youtube-player'] }]
};
