import { Component, inject } from '@angular/core';
import { BriefingSection } from './features/briefing/briefing-section';
import { EcosystemSection } from './features/ecosystem/ecosystem-section';
import { HitmakerSection } from './features/hitmaker/hitmaker-section';
import { HeroSection } from './features/hero/hero-section';
import { PortfolioSection } from './features/portfolio/portfolio-section';
import { PrintStudioSection } from './features/print-studio/print-studio-section';
import { SiteFooter } from './features/footer/site-footer';
import { AudioPreviewService } from './services/audio-preview.service';
import { BriefingService } from './services/briefing.service';
import { HitmakerStateService } from './services/hitmaker-state.service';
import { PortfolioStateService } from './services/portfolio-state.service';
import { PrintStudioStateService } from './services/print-studio-state.service';
import { QuoteActionsService } from './services/quote-actions.service';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  imports: [
    BriefingSection,
    EcosystemSection,
    HitmakerSection,
    HeroSection,
    PortfolioSection,
    PrintStudioSection,
    SiteFooter,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers: [
    AudioPreviewService,
    BriefingService,
    HitmakerStateService,
    PortfolioStateService,
    PrintStudioStateService,
    QuoteActionsService,
    ToastService,
  ],
})
export class App {
  readonly toastMessage = inject(ToastService).message;
}
