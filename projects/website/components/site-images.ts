/**
 * The large photos under `public/assets/`, with their intrinsic size and a
 * 16 px WebP preview. `next/image` builds a blur preview by itself only for a
 * statically imported file. These images stay plain `/assets/` paths, so that
 * every served image lives in one folder, and their previews are kept here.
 * Regenerate a preview whenever the file it belongs to changes.
 */
type SiteImage = {
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
};

export const SKYYURT_PAINTING: SiteImage = {
  src: '/assets/Skyyurt-right.webp',
  width: 1024,
  height: 683,
  blurDataURL:
    'data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAADwAQCdASoQAAsAAsBMJbACdAEM2aXAJYAA/eJz/AEDrSKsPCIrUtNUNo0oZxIYclqX3EL+F87e7cr+fYfBOtsTfb3T3mxBaXuw7C00LfAAAA==',
};

export const BOOK_COVER: SiteImage = {
  src: '/assets/De Anda - Kaft.webp',
  width: 1024,
  height: 1024,
  blurDataURL:
    'data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAAAwAgCdASoQABAAAsBMJbACdEf/gbdit6zeQAD+GJggw8JLCbHN/orNXfjKod5vjd+FSc9G4bqcxQsBwFuQeJscBZ7N0JH8tnroG4XNS3G4OCjiv+Ah6tNoPeNRIDCAAAA=',
};

export const SKYYURT_CONCEPT: SiteImage = {
  src: '/assets/Skyyurt-concept.webp',
  width: 1200,
  height: 800,
  blurDataURL:
    'data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAADwAQCdASoQAAsAAsBMJbACdAEOyyHZgAAA/t8iKBAgqVNteyOgGVGoC2tr/fRTePT8O7S4q91psvvq2ZKLhkCiH/HLoM/gAAA=',
};

export const SKYSTONE_CONCEPT: SiteImage = {
  src: '/assets/Skystone-concept.webp',
  width: 683,
  height: 1024,
  blurDataURL:
    'data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADQAQCdASoLABAAAsBMJbACdADQ5hPNYAD+kS4qeXFB2FJWdvoUm9QAO9w13N2iy8VgKSGVnNcdov4AyKkK8bxT4sBUeW87O4AAAA==',
};

export const NOMADS_HEART_CONCEPT: SiteImage = {
  src: '/assets/Nomads-heart-concept.webp',
  width: 1200,
  height: 800,
  blurDataURL:
    'data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAADQAQCdASoQAAsAAsBMJaACdAEJy0/CMAD+6ueWS1sKu9wMun3cDPGrsdswhcRWtKsKy4J9tY0JP+G3dA2vAyH7tW6QL2F4j2Rohgjxty7p2d5YIAoTXhVUAAA=',
};

/** The transparent yurt mark (the logo, 1024x1024), drawn in the header, the About and mission sections and the Diepte infobox. */
export const LOGO_MARK_SRC = '/assets/anda-yurt-mark.webp';
