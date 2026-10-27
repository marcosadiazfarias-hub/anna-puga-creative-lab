import { Component, ChangeDetectionStrategy, signal, computed, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnDestroy {
  private fb = inject(FormBuilder);

  // Navegação e filtros ativos
  activePortfolioFilter = signal<'todos' | 'eventos' | 'branding' | 'estampas' | 'artistas'>('todos');
  activeHitGenreFilter = signal<'Todos' | 'Pagode' | 'Sertanejo'>('Todos');
  selectedPortfolioModal = signal<PortfolioItem | null>(null);

  // Estado do Player de Áudio Web Audio API
  playingTrackId = signal<string | null>(null);
  trackProgress = signal<number>(0);
  expandedLyricsId = signal<string | null>(null);
  private audioCtx: AudioContext | null = null;
  private audioInterval: ReturnType<typeof setInterval> | null = null;

  // Estado do Provador de Estampas (Private Label Mockup Studio)
  selectedPrintId = signal<string>('print-01');
  selectedGarment = signal<'tshirt' | 'hoodie' | 'totebag' | 'dress'>('tshirt');
  garmentBaseColor = signal<'#121216' | '#F4F4F6' | '#CCFF00' | '#581C87'>('#121216');

  // Estado do Construtor de Orçamento / Sacola de Serviços
  selectedServicesCart = signal<string[]>([
    'Identidade Visual & Cardápio (Gastronomia / Empresas)',
  ]);
  toastMessage = signal<string | null>(null);

  // Reactive Form para Briefing
  briefingForm = this.fb.nonNullable.group({
    clientName: ['', [Validators.required, Validators.minLength(2)]],
    brandOrArtist: ['', [Validators.required]],
    urgency: ['Normal (15 a 25 dias)'],
    customNotes: [''],
  });

  // Dados do Portfólio 360°[cite: 1]
  readonly portfolioItems = signal<PortfolioItem[]>([
    {
      id: 'case-burger',
      title: 'BRASA & BASS BURGER CO.',
      category: 'branding',
      categoryLabel: 'Identidade Visual + Cardápio',
      subtitle: 'Branding completo, cardápio físico/digital, embalagens térmicas e fachada neon para hamburgueria artesanal.',
      year: '2024',
      tagColor: '#CCFF00',
      deliverables: ['Logo & Universo Visual', 'Design de Cardápio (Engenharia de Menu)', 'Embalagens & Sacolas Delivery', 'Artes para iFood e Social Media'],
      clientResult: '+42% no ticket médio após reformulação visual do cardápio e combos.',
      challenge: 'Criar uma identidade de hamburgueria artesanal que fugisse do clichê rústico de madeira e conversasse com o público jovem noturno.',
      solution: 'Desenvolvemos um sistema visual urbano com tipografia brutalista, ilustrações autorais dos burgers e engenharia de cardápio estratégica para destacar os itens de maior margem.',
      svgType: 'burger',
      priceReference: 'Branding Gastronômico Completo',
    },
    {
      id: 'case-rave',
      title: 'SOLARIS TECHNO FESTIVAL // 15K PEOPLE',
      category: 'eventos',
      categoryLabel: 'Música Eletrônica & Grandes Eventos',
      subtitle: 'Key Visual 360°, telões de palco LED, pulseiras, outdoors em rodovias e campanha de lançamento de lotes.',
      year: '2024',
      tagColor: '#7C3AED',
      deliverables: ['Key Visual Oficial do Festival', 'Mídia Exterior (Outdoor & Frontlight)', 'Motion Loop & Telão de Palco', 'Kit Social Media (Contagem + Lineup)'],
      clientResult: 'Sold Out do 3º lote em 48 horas com identidade visual viral nos stories.',
      challenge: 'Traduzir a energia hipnótica do Melodic Techno e Afro House em peças gráficas de alto impacto tanto no feed do celular quanto em outdoors de 9 metros.',
      solution: 'Direção de arte futurista com contrastes ácidos, tipografia customizada para leitura rápida de lineup e desdobramento de mais de 60 peças integradas.',
      svgType: 'rave',
      priceReference: 'Pacote Key Visual Evento / Festival',
    },
    {
      id: 'case-estampas',
      title: 'COLEÇÃO "TROPICAL ACID" // PRIVATE LABEL',
      category: 'estampas',
      categoryLabel: 'Estampas Autorais & Moda',
      subtitle: 'Pack de 12 estampas corridas e localizadas exclusivas para marca de streetwear e resortwear.',
      year: '2025',
      tagColor: '#FF2A85',
      deliverables: ['Rapport Contínuo em Alta Definição', 'Separação de Cores (Cilindro / Digital)', 'Estampas Localizadas Peito & Costas', 'Ficha Técnica + Mockups 3D Realistas'],
      clientResult: 'Coleção cápsula esgotada no lançamento com zero retrabalho na estamparia.',
      challenge: 'Entregar estampas exclusivas com estética internacional prontas para estamparia digital e serigrafia sem erro de encaixe.',
      solution: 'Desenho autoral com botânica distorcida e elementos gráficos neon, entregues com arquivos abertos, pantones definidos e simulação em peças reais.',
      svgType: 'botanical',
      priceReference: 'Pack Estampas Exclusivas Private Label',
    },
    {
      id: 'case-artista',
      title: 'GRUPO SAMBA NOSSO // IMAGEM + SINGLE HIT',
      category: 'artistas',
      categoryLabel: 'Assessoria de Imagem + Composição',
      subtitle: 'Composição de música inédita de trabalho, direção de estilo do grupo, capa de EP e estratégia de lançamento.',
      year: '2024',
      tagColor: '#00F0FF',
      deliverables: ['Composição Inédita (Pagode Romântico)', 'Direção de Imagem & Figurino', 'Logomarca do Grupo & Capa Spotify', 'Cronograma de Conteúdo & Reels'],
      clientResult: '+850 mil plays orgânicos no trimestre de estreia e agenda de shows triplicada.',
      challenge: 'Reposicionar um grupo de pagode regional para parecer uma grande potência nacional nas plataformas digitais e perante contratantes.',
      solution: 'Unimos a entrega de um single inédito com refrão chiclete à reformulação completa da imagem visual, fotos de imprensa, logotipo e identidade de palco.',
      svgType: 'pagode',
      priceReference: 'Posicionamento 360° para Artistas',
    },
    {
      id: 'case-festival-open',
      title: 'HYPERION OPEN AIR // ARTE & SINALIZAÇÃO',
      category: 'eventos',
      categoryLabel: 'Eventos & Mídia Externa',
      subtitle: 'Identidade de palco, totens fotográficos, cardápio de bar do evento, copos colecionáveis e mídia exterior.',
      year: '2023',
      tagColor: '#CCFF00',
      deliverables: ['Sinalização Completa de Arena', 'Copos & Merch Oficial do Evento', 'Cardápio de Bares & Camarotes', 'Campanha Tráfego Pago'],
      clientResult: 'Experiência visual elogiada pelo público e patrocinadores premium.',
      challenge: 'Unificar a comunicação visual desde o anúncio no Instagram até a lona do palco principal e o cardápio de drinks dos camarotes.',
      solution: 'Sistema de design modular de alta visibilidade noturna pensado para brilhar sob luz negra e iluminação de palco.',
      svgType: 'festival',
      priceReference: 'Identidade Completa para Eventos',
    },
    {
      id: 'case-streetwear',
      title: 'KULTURA CAPSULE // SURFACE DESIGN',
      category: 'estampas',
      categoryLabel: 'Estampas Criativas & Únicas',
      subtitle: 'Série de artes localizadas para camisetas oversized e moletons pesados para marca independente.',
      year: '2024',
      tagColor: '#FF2A85',
      deliverables: ['6 Artes Localizadas Exclusivas', 'Etiquetas Internas & Tags Personalizadas', 'Mockups de E-commerce Prontos', 'Cessão de Direitos Comerciais'],
      clientResult: 'Peças se tornaram o carro-chefe de vendas no e-commerce da marca.',
      challenge: 'Criar artes com apelo de arte de galeria e cultura de rua que justificassem um posicionamento de preço premium nas camisetas.',
      solution: 'Ilustrações autorais misturando tipografia experimental, texturas de halftone e estética brutalista.',
      svgType: 'streetwear',
      priceReference: 'Estampa Localizada Autoral',
    },
  ]);

  // Catálogo do Hitmaker Studio (Pagode & Sertanejo)[cite: 1]
  readonly hitTracks = signal<HitTrack[]>([
    {
      id: 'hit-01',
      title: 'Saudade no Modo Avião',
      genre: 'Pagode',
      vibe: 'Pagode Romântico / Refrão Forte de Arena',
      bpm: 94,
      keySignature: 'Fá Maior (F)',
      status: 'Disponível p/ Gravação',
      duration: '03:18',
      chorusLyrics: '"Coloquei a saudade no modo avião / Mas seu cheiro hackeou meu coração / Não adianta bloquear na sexta-feira / Se domingo eu tô na sua beira..."',
      chordProgression: [349.23, 293.66, 220.0, 261.63],
      barHeights: [45, 80, 60, 95, 70, 40, 88, 100, 65, 50, 85, 92, 55, 75, 90, 62],
    },
    {
      id: 'hit-02',
      title: 'Pix de Madrugada',
      genre: 'Sertanejo',
      vibe: 'Sertanejo Universitário / Upbeat Comercial',
      bpm: 126,
      keySignature: 'Sol Maior (G)',
      status: 'Disponível p/ Gravação',
      duration: '02:52',
      chorusLyrics: '"Mandou um Pix de um centavo às três da manhã / Só pra escrever na descrição: ainda sou sua fã / Ô recaída cara, ô coração sem freio / Já tô na portaria do seu prédio!"',
      chordProgression: [392.0, 293.66, 329.63, 261.63],
      barHeights: [90, 65, 98, 72, 84, 50, 95, 88, 60, 100, 78, 55, 82, 92, 68, 86],
    },
    {
      id: 'hit-03',
      title: 'Culpado Favorito',
      genre: 'Pagode',
      vibe: 'Pagode Swingado / Roda de Samba Moderna',
      bpm: 102,
      keySignature: 'Ré Menor (Dm)',
      status: 'Disponível p/ Gravação',
      duration: '03:05',
      chorusLyrics: '"Se amar errado desse cadeia / A gente tava cumprindo perpétua / Você mente olhando no meu olho / E eu peço bis desse seu jogo..."',
      chordProgression: [293.66, 220.0, 233.08, 349.23],
      barHeights: [55, 75, 92, 64, 88, 96, 48, 72, 85, 90, 58, 82, 94, 68, 76, 84],
    },
    {
      id: 'hit-04',
      title: 'Mesa 14 (Garçom Traz Dobrado)',
      genre: 'Sertanejo',
      vibe: 'Modão Sofrência / Refrão para Cantar no Grito',
      bpm: 84,
      keySignature: 'Lá Maior (A)',
      status: 'Exclusividade Sob Consulta',
      duration: '03:11',
      chorusLyrics: '"Garçom, fecha a conta da Mesa 14 / Ou traz mais duas doses que hoje ninguém dorme / Ela trocou meu chapéu por um cara da cidade / Mas deixei meu sobrenome na metade da saudade..."',
      chordProgression: [220.0, 277.18, 329.63, 293.66],
      barHeights: [62, 48, 86, 94, 70, 52, 80, 98, 76, 60, 88, 74, 50, 90, 84, 66],
    },
  ]);

  // Catálogo do Showroom de Estampas (Surface Design & Private Label)[cite: 1]
  readonly printCatalog = signal<PrintDesign[]>([
    {
      id: 'print-01',
      name: 'ELECTRIC BOTANICA #04',
      collection: 'Resort & Festival Capsule',
      technique: 'Rapport Contínuo + Localizada (PSD/TIFF 300dpi)',
      exclusivity: '1/1 Exclusiva',
      accentHex: '#CCFF00',
      secondaryHex: '#FF2A85',
      bgHex: '#111116',
      patternType: 'acid-flora',
    },
    {
      id: 'print-02',
      name: 'NEO-TRIBAL TECHNO #09',
      collection: 'Streetwear Heavyweight',
      technique: 'Cromia / Serigrafia & DTG Alta Definição',
      exclusivity: 'Private Label Pronta',
      accentHex: '#00F0FF',
      secondaryHex: '#7C3AED',
      bgHex: '#0D0B18',
      patternType: 'cyber-tribal',
    },
    {
      id: 'print-03',
      name: 'BRASILIDADE NOIR #12',
      collection: 'Verão Autoral / Camisaria',
      technique: 'Sublimação & Estamparia Digital Corrida',
      exclusivity: '1/1 Exclusiva',
      accentHex: '#FF2A85',
      secondaryHex: '#FACC15',
      bgHex: '#180D14',
      patternType: 'tropical-noir',
    },
    {
      id: 'print-04',
      name: 'SOUNDWAVE BRUTALISM #02',
      collection: 'Merch Oficial & Private Labels',
      technique: 'Silk Puff 3D + Alta Densidade',
      exclusivity: 'Private Label Pronta',
      accentHex: '#CCFF00',
      secondaryHex: '#00F0FF',
      bgHex: '#09090B',
      patternType: 'brutal-typo',
    },
  ]);

  // Opções de Serviços para o Construtor de Orçamento[cite: 1]
  readonly availableServices = [
    'Identidade Visual & Cardápio (Gastronomia / Empresas)',
    'Key Visual & Artes para Eventos / Música Eletrônica',
    'Estampas Exclusivas (Private Label / Autoral)',
    'Composição Musical / Liberação de Hit (Pagode / Sertanejo)',
    'Assessoria de Imagem, Social Media & Marketing',
  ];

  // Computed Signals
  filteredPortfolio = computed(() => {
    const filter = this.activePortfolioFilter();
    const items = this.portfolioItems();
    if (filter === 'todos') return items;
    return items.filter((item) => item.category === filter);
  });

  filteredHits = computed(() => {
    const genre = this.activeHitGenreFilter();
    const tracks = this.hitTracks();
    if (genre === 'Todos') return tracks;
    return tracks.filter((t) => t.genre === genre);
  });

  activePrint = computed(() => {
    const id = this.selectedPrintId();
    return this.printCatalog().find((p) => p.id === id) || this.printCatalog()[0];
  });

  whatsappPreviewText = computed(() => {
    const services = this.selectedServicesCart();
    const formVal = this.briefingForm.getRawValue();
    const namePart = formVal.clientName ? `Olá Anna! Me chamo *${formVal.clientName}*` : 'Olá Anna!';
    const brandPart = formVal.brandOrArtist ? ` (${formVal.brandOrArtist})` : '';
    const servicesPart =
      services.length > 0
        ? `\n\nTenho interesse em:\n${services.map((s) => `• ${s}`).join('\n')}`
        : '\n\nGostaria de conversar sobre um projeto criativo.';
    const notesPart = formVal.customNotes ? `\n\nDetalhes do projeto: ${formVal.customNotes}` : '';
    return `${namePart}${brandPart}.${servicesPart}\nPrazo desejado: ${formVal.urgency}${notesPart}`;
  });

  // Métodos de Interação
  setPortfolioFilter(filter: 'todos' | 'eventos' | 'branding' | 'estampas' | 'artistas'): void {
    this.activePortfolioFilter.set(filter);
  }

  openCaseModal(item: PortfolioItem): void {
    this.selectedPortfolioModal.set(item);
  }

  closeCaseModal(): void {
    this.selectedPortfolioModal.set(null);
  }

  // Player de Áudio Sintetizado (Web Audio API) para o Hitmaker Studio
  togglePlayTrack(track: HitTrack): void {
    if (this.playingTrackId() === track.id) {
      this.stopAudioPlayback();
      return;
    }

    this.stopAudioPlayback();
    this.playingTrackId.set(track.id);
    this.trackProgress.set(8);

    this.playChordPreview(track.chordProgression, track.bpm);

    let step = 0;
    this.audioInterval = setInterval(() => {
      step++;
      const nextProgress = Math.min(100, (step / 24) * 100);
      this.trackProgress.set(nextProgress);

      if (step % 6 === 0 && step < 24) {
        this.playChordPreview(track.chordProgression, track.bpm);
      }

      if (step >= 24) {
        this.stopAudioPlayback();
      }
    }, 500);
  }

  private playChordPreview(frequencies: number[], bpm: number): void {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!this.audioCtx) {
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;
      const beatDuration = 60 / bpm;

      frequencies.forEach((freq, idx) => {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * (beatDuration * 0.65));

        gain.gain.setValueAtTime(0.001, now + idx * (beatDuration * 0.65));
        gain.gain.exponentialRampToValueAtTime(0.09, now + idx * (beatDuration * 0.65) + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + (idx + 1) * (beatDuration * 0.65) + 0.25);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now + idx * (beatDuration * 0.65));
        osc.stop(now + (idx + 1) * (beatDuration * 0.65) + 0.3);
      });
    } catch {
      // Fallback silencioso se o navegador bloquear Web Audio
    }
  }

  stopAudioPlayback(): void {
    if (this.audioInterval) {
      clearInterval(this.audioInterval);
      this.audioInterval = null;
    }
    this.playingTrackId.set(null);
    this.trackProgress.set(0);
  }

  toggleLyrics(trackId: string): void {
    this.expandedLyricsId.set(this.expandedLyricsId() === trackId ? null : trackId);
  }

  // Adição rápida de itens (Hit, Estampa ou Case) ao orçamento
  addItemToQuote(itemLabel: string, scrollId = 'contato'): void {
    const current = this.selectedServicesCart();
    if (!current.includes(itemLabel)) {
      this.selectedServicesCart.set([...current, itemLabel]);
    }
    this.showToast(`"${itemLabel}" adicionado ao seu orçamento!`);
    this.closeCaseModal();
    const targetEl = document.getElementById(scrollId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  }

  toggleServiceInCart(serviceName: string): void {
    const current = this.selectedServicesCart();
    if (current.includes(serviceName)) {
      this.selectedServicesCart.set(current.filter((s) => s !== serviceName));
    } else {
      this.selectedServicesCart.set([...current, serviceName]);
    }
  }

  isServiceSelected(serviceName: string): boolean {
    return this.selectedServicesCart().includes(serviceName);
  }

  sendBriefingToWhatsApp(): void {
    if (this.briefingForm.invalid) {
      this.briefingForm.markAllAsTouched();
      this.showToast('Preencha seu nome e marca/projeto para enviar no WhatsApp.');
      return;
    }
    const text = encodeURIComponent(this.whatsappPreviewText());
    window.open(`https://wa.me/5511999999999?text=${text}`, '_blank', 'noopener,noreferrer');
  }

  showToast(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => {
      if (this.toastMessage() === msg) {
        this.toastMessage.set(null);
      }
    }, 3800);
  }

  ngOnDestroy(): void {
    this.stopAudioPlayback();
    if (this.audioCtx) {
      this.audioCtx.close();
    }
  }
}