// Identificador único de posição: "página:posição"
export type AdPosition = `${string}:${string}`;

export interface Ad {
  id: string;
  position: AdPosition;
  image: string;
  link: string;
  title: string;
  altText: string;
  trackingLabel?: string;
}

export interface AdConfig {
  type: 'custom' | 'google';
  data?: Ad;
  googleAdSlot?: string;
}

export interface IAdProvider {
  getAds(position: AdPosition): Promise<Ad[]>;
}

