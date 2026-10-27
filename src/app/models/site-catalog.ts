export interface PortfolioItem {
  id: string;
  title: string;
  category: 'eventos' | 'branding' | 'estampas' | 'artistas';
  categoryLabel: string;
  subtitle: string;
  year: string;
  tagColor: string;
  deliverables: string[];
  clientResult: string;
  challenge: string;
  solution: string;
  svgType: 'rave' | 'burger' | 'botanical' | 'pagode' | 'festival' | 'streetwear';
  priceReference: string;
}

export interface HitTrack {
  id: string;
  title: string;
  genre: 'Pagode' | 'Sertanejo';
  vibe: string;
  bpm: number;
  keySignature: string;
  status: 'Disponível p/ Gravação' | 'Exclusividade Sob Consulta';
  duration: string;
  chorusLyrics: string;
  chordProgression: number[];
  barHeights: number[];
}

export interface PrintDesign {
  id: string;
  name: string;
  collection: string;
  technique: string;
  exclusivity: '1/1 Exclusiva' | 'Private Label Pronta';
  accentHex: string;
  secondaryHex: string;
  bgHex: string;
  patternType: 'acid-flora' | 'cyber-tribal' | 'tropical-noir' | 'brutal-typo';
}
