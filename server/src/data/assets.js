// Bump this whenever images in client/public/assets are replaced. The query string
// changes every image URL, so browsers and the CDN fetch the new files instead of
// serving stale cached copies.
export const ASSET_VERSION = "4";

export const assetUrl = (path) => `/assets/${path}?v=${ASSET_VERSION}`;
