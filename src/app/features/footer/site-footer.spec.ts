import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SiteFooter } from './site-footer';

describe('SiteFooter', () => {
  let fixture: ComponentFixture<SiteFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteFooter],
    }).compileComponents();

    fixture = TestBed.createComponent(SiteFooter);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('renders the contact signature with direct email and WhatsApp links', () => {
    fixture.detectChanges();
    const footer = (fixture.nativeElement as HTMLElement).querySelector('footer');

    expect(footer?.textContent).toContain('Marcos Farias');
    expect(footer?.querySelector('a[href="mailto:m.diazfarias@gmail.com"]')?.textContent).toContain(
      'm.diazfarias@gmail.com',
    );

    const whatsappLink = footer?.querySelector<HTMLAnchorElement>(
      'a[href="https://wa.me/5548988621897"]',
    );
    expect(whatsappLink?.getAttribute('aria-label')).toBe('Chamar Marcos Farias no WhatsApp');
    expect(whatsappLink?.textContent).toContain('(48) 98862-1897');
    expect(whatsappLink?.getAttribute('rel')).toBe('noopener noreferrer');
  });
});

