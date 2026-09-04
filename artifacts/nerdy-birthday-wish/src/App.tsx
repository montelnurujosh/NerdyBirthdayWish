import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  ArrowDown,
  ArrowUpRight,
  Binary,
  BrainCircuit,
  Check,
  ChevronRight,
  Copy,
  Dna,
  Heart,
  Lightbulb,
  Orbit,
  Play,
  Send,
  SlidersHorizontal,
  Sparkles,
  Star,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react';
import { StarfieldCanvas } from '@/components/StarfieldCanvas';
import { PersonalizeModal, type PersonalizationConfig } from '@/components/PersonalizeModal';
import { playCelestialSound } from '@/lib/sound';
import { triggerStardust } from '@/lib/confetti';

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

const starNotes = [
  { id: 'one', title: 'constant: you', text: 'The one variable my little universe refuses to change.', position: 'note-one' },
  { id: 'two', title: 'observed', text: 'A very rare kind of brilliant: the kind that makes room for other people to shine.', position: 'note-two' },
  { id: 'three', title: 'field note', text: 'Your laugh has a suspiciously high impact on the local atmosphere.', position: 'note-three' },
  { id: 'four', title: 'north star', text: 'If I ever look lost, it is probably because I am looking for you.', position: 'note-four' },
];

const discoveries = [
  { icon: Dna, title: 'The way you think', detail: 'Sharp enough to cut through a problem, gentle enough to never make anyone feel small.', tag: 'rare signal / always wanted' },
  { icon: Lightbulb, title: 'Your tiny discoveries', detail: 'The songs, facts, side quests, and perfect little observations you collect like other people collect souvenirs.', tag: 'curiosity index: off the charts' },
  { icon: BrainCircuit, title: 'Your beautiful weirdness', detail: 'The specific, unrepeatable pattern of you. No duplicate found. No replacement algorithm exists.', tag: 'one of one / verified' },
  { icon: Heart, title: 'How you make things better', detail: 'Not loudly. Not for applause. Just by being there and making the room feel more possible.', tag: 'background process / always running' },
];

function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.14 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function App() {
  const [activeStar, setActiveStar] = useState<string | null>(null);
  const [openDiscovery, setOpenDiscovery] = useState<number | null>(null);
  const [signalSent, setSignalSent] = useState(false);
  const [shared, setShared] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [personalizeOpen, setPersonalizeOpen] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [showReplyConsole, setShowReplyConsole] = useState(false);
  const [replyText, setReplyText] = useState('Signal received loud and clear! Thank you for the sweetest birthday universe ever 🚀✨');

  const [config, setConfig] = useState<PersonalizationConfig>(() => {
    if (typeof window === 'undefined') {
      return { to: '', from: '', date: 'today', note: '', phone: '' };
    }
    const params = new URLSearchParams(window.location.search);
    return {
      to: params.get('to') || params.get('name') || '',
      from: params.get('from') || '',
      date: params.get('date') || 'today',
      note: params.get('note') || '',
      phone: params.get('phone') || '',
    };
  });

  const [isRecipientView] = useState(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    const hasName = Boolean(params.get('to') || params.get('name'));
    const isEditMode = params.get('edit') === 'true' || params.get('edit') === '1';
    return hasName && !isEditMode;
  });

  const recipient = config.to.trim() || 'you';
  const sender = config.from.trim() || 'someone very lucky';
  const earthDate = config.date.trim() || 'today';
  const signatureText = config.from.trim() ? `Always, ${config.from}.` : 'Always, me.';
  const psNote = config.note.trim() || 'P.S. I would choose you in every possible timeline.';

  useEffect(() => {
    const titlePrefix = config.to.trim() ? `${config.to} — ` : '';
    document.title = `${titlePrefix}A small universe, made for you — happy birthday`;
    const description = `A private little internet love letter for a brilliant, adored person: ${recipient}.`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', description);
    document.documentElement.style.backgroundColor = '#f6f0e6';
  }, [config.to, recipient]);

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    if (nextState) {
      playCelestialSound('star', true);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `A small universe, made for ${recipient}`,
      text: 'A birthday note from someone who thinks you are extraordinary.',
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
      }
      setShared(true);
      window.setTimeout(() => setShared(false), 2600);
    } catch {
      setShared(false);
    }
  };

  const handleStarClick = (e: React.MouseEvent, noteId: string) => {
    const nextActive = activeStar === noteId ? null : noteId;
    setActiveStar(nextActive);
    if (nextActive) {
      playCelestialSound('star', soundEnabled);
      triggerStardust(e.clientX, e.clientY, 25);
    }
  };

  const handleDiscoveryToggle = (index: number) => {
    const isOpening = openDiscovery !== index;
    setOpenDiscovery(isOpening ? index : null);
    if (isOpening) {
      playCelestialSound('discovery', soundEnabled);
    }
  };

  const handleRunModel = (e: React.MouseEvent) => {
    setCalculating(true);
    playCelestialSound('hypothesis', soundEnabled);
    triggerStardust(e.clientX, e.clientY, 40);
    setTimeout(() => setCalculating(false), 600);
  };

  const quickReactions = [
    "🪐 You're my favorite universe",
    "🥺 Loved every second of this",
    "🎂 Ready for celebration & cake!",
    "💖 I'd choose you in every timeline too",
  ];

  const handleTransmitWhatsApp = (e: React.MouseEvent) => {
    setSignalSent(true);
    playCelestialSound('signal', soundEnabled);
    triggerStardust(e.clientX, e.clientY, 70);

    const rawPhone = (config.phone || '').replace(/[^\d]/g, '');
    const message = encodeURIComponent(replyText.trim() || 'Signal received loud and clear! ✨');
    const waUrl = rawPhone
      ? `https://wa.me/${rawPhone}?text=${message}`
      : `https://api.whatsapp.com/send?text=${message}`;

    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const scrollToLetter = () => document.querySelector('#letter')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <main className="birthday-site page-enter">
      <StarfieldCanvas />

      <header className="topbar" aria-label="Main navigation">
        <a className="brand-lockup" href="#top" data-testid="link-home">
          <span className="brand-mark" aria-hidden="true"><Orbit size={17} strokeWidth={1.8} /></span>
          <span className="brand-copy">FOR {config.to.trim() ? config.to.toUpperCase() : 'YOU'} / 01</span>
        </a>

        <span className="topbar-note">private transmission · earth date: {earthDate}</span>

        <div className="topbar-actions">
          <button
            className={`icon-button ${soundEnabled ? 'is-active' : ''}`}
            type="button"
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
            title={soundEnabled ? 'Sound is on (click to mute)' : 'Sound is off (click to unmute)'}
          >
            {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
            <span>{soundEnabled ? 'Sound on' : 'Sound off'}</span>
          </button>

          {!isRecipientView && (
            <>
              <button
                className="icon-button"
                type="button"
                onClick={() => setPersonalizeOpen(true)}
                title="Personalize names & generate link"
                data-testid="button-personalize"
              >
                <SlidersHorizontal size={13} />
                <span>Personalize</span>
              </button>

              <button
                className="text-button"
                type="button"
                onClick={handleShare}
                data-testid="button-share-page"
              >
                {shared ? <><Check size={13} /> copied</> : <><Copy size={13} /> share this</>}
              </button>
            </>
          )}
        </div>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="hero-kicker eyebrow"><Sparkles size={14} /> a note from the observatory</div>
            <h1 className="hero-title display" id="hero-title">
              Happy<br />
              <em>birthday,</em><br />
              {recipient}.
            </h1>
            <p className="hero-lede">
              I made you a little corner of the internet because ordinary cards felt statistically incapable of holding how brilliant you are.
            </p>
            <div className="hero-actions">
              <button className="primary-button" type="button" onClick={scrollToLetter} data-testid="button-open-letter">
                Open your letter <ArrowDown size={16} />
              </button>
              <a className="text-button" href="#constellation" data-testid="link-explore-constellation">
                Explore the evidence <ArrowUpRight size={14} />
              </a>
            </div>
          </div>

          <div className="hero-visual" aria-label="A constellation of birthday wishes">
            <div className="orbit-scene" aria-hidden="true">
              <span className="hero-orbit-line" />
              <span className="hero-sun" />
              <span className="hero-planet" />
              <span className="orbit-label">{recipient} / in every known system</span>
            </div>
            {starNotes.map((note) => (
              <div key={note.id}>
                <button
                  className={`star-button star-${note.id}`}
                  type="button"
                  aria-label={`Reveal ${note.title}`}
                  aria-expanded={activeStar === note.id}
                  onClick={(e) => handleStarClick(e, note.id)}
                  data-testid={`button-star-${note.id}`}
                >
                  <Star size={20} strokeWidth={1.4} />
                </button>
                {activeStar === note.id && (
                  <div className={`star-note ${note.position}`} role="status" data-testid={`text-star-note-${note.id}`}>
                    <strong>{note.title}</strong>{note.text}
                  </div>
                )}
              </div>
            ))}
            <div className="hero-index"><b>04</b> small truths waiting to be found</div>
          </div>
        </div>
      </section>

      <section className="section" id="constellation" aria-labelledby="constellation-title">
        <div className="container">
          <div className="section-header">
            <Reveal>
              <span className="eyebrow">01 / the constellation</span>
              <h2 className="section-title display" id="constellation-title">
                Some things<br />are just <em>{recipient}-shaped.</em>
              </h2>
            </Reveal>
            <Reveal delay={150}>
              <p className="section-intro">
                Tap the stars above for the footnotes. Or keep reading. I have prepared an unreasonable amount of evidence.
              </p>
            </Reveal>
          </div>

          <div className="signal-layout">
            <Reveal className="signal-statement">
              <div className="mono eyebrow">field notes / 2024–∞</div>
              <p>There are people who enter a room. Then there are people who quietly change the room’s entire operating system.</p>
            </Reveal>
            <div className="signal-list">
              {[
                ['01', 'You make curiosity look cool.', 'a very attractive bug in the matrix'],
                ['02', 'You notice what everyone else misses.', 'high-resolution human'],
                ['03', 'You are soft without being small.', 'the rarest kind of strong'],
                ['04', 'You make ordinary days feel annotated.', 'notes in the margins, forever'],
              ].map(([number, title, copy, tag], index) => (
                <Reveal key={number} delay={index * 90}>
                  <article className="signal-row" data-testid={`card-signal-${number}`}>
                    <span className="signal-number">{number}</span>
                    <div>
                      <h3>{title}</h3>
                      <p>{copy}</p>
                      <span className="signal-tag">{tag}</span>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section lab-section" aria-labelledby="lab-title">
        <div className="container">
          <div className="section-header">
            <Reveal>
              <span className="eyebrow">02 / a completely peer-reviewed study</span>
              <h2 className="section-title display" id="lab-title">The numbers<br />do not lie.</h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="lab-intro">I ran the model twice. Then I asked three friends. The result was annoyingly obvious from the start.</p>
            </Reveal>
          </div>

          <div className="lab-grid">
            <Reveal>
              <div className="terminal" aria-label="A playful birthday probability calculation">
                <div className="terminal-bar">
                  <span className="terminal-dot" /><span className="terminal-dot" /><span className="terminal-dot" />
                  <span className="terminal-file">birthday_model.ts</span>
                </div>
                <div className="terminal-code">
                  <span className="code-line"><span className="code-num">01</span><span className="code-key">const</span> subject = <span className="code-string">&quot;{recipient}&quot;</span>;</span>
                  <span className="code-line"><span className="code-num">02</span><span className="code-key">const</span> variables = [<span className="code-string">&quot;kind&quot;</span>, <span className="code-string">&quot;clever&quot;</span>, <span className="code-string">&quot;unrepeatable&quot;</span>];</span>
                  <span className="code-line"><span className="code-num">03</span><span className="code-key">const</span> birthdayWish = measure({recipient});</span>
                  <span className="code-line"><span className="code-num">04</span><span className="code-key">return</span> birthdayWish <span className="code-accent">===</span> <span className="code-string">&quot;everything good&quot;</span>;</span>
                  <span className="terminal-output">
                    <span className="code-accent">✓</span> hypothesis confirmed: {recipient} {recipient === 'you' ? 'are' : 'is'} deeply, wildly loved.
                  </span>
                  <div>
                    <button
                      type="button"
                      className="terminal-rerun-btn"
                      onClick={handleRunModel}
                      aria-label="Re-run calculation"
                    >
                      <Play size={11} fill="currentColor" /> {calculating ? 'evaluating...' : 're-run calculation'}
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal className="lab-aside" delay={180}>
              <h3>Probability of {recipient} having a wonderful year?</h3>
              <p>Not a promise. Better: a very well-informed prediction based on your excellent track record of making things happen.</p>
              <div className="probability-meter">
                <div className="meter-label"><span>confidence interval</span><span>∞</span></div>
                <div className="meter-track"><div className="meter-fill" /></div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section keepsake" aria-labelledby="keepsake-title">
        <div className="container keepsake-grid">
          <Reveal className="keepsake-copy">
            <span className="eyebrow">03 / things worth saving</span>
            <h2 className="section-title display" id="keepsake-title">A few more<br /><em>observations.</em></h2>
            <p>These are the details I would put in a time capsule if I could trust the future to appreciate them properly.</p>
            <a className="text-button" href="#letter" data-testid="link-continue-letter">Continue to the letter <ArrowDown size={14} /></a>
          </Reveal>
          <div className="discovery-list">
            {discoveries.map((item, index) => {
              const Icon = item.icon;
              const isOpen = openDiscovery === index;
              return (
                <Reveal key={item.title} delay={index * 85}>
                  <button
                    className={`discovery ${isOpen ? 'is-open' : ''}`}
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => handleDiscoveryToggle(index)}
                    data-testid={`button-discovery-${index}`}
                  >
                    <span className="discovery-icon"><Icon size={19} strokeWidth={1.5} /></span>
                    <span className="discovery-copy"><strong>{item.title}</strong><span>{item.tag}</span></span>
                    <ChevronRight className="discovery-arrow" size={17} />
                    {isOpen && <span className="discovery-detail">{item.detail}</span>}
                  </button>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section letter-section" id="letter" aria-labelledby="letter-title">
        <div className="container letter-shell">
          <Reveal className="letter-meta">
            <span className="eyebrow">04 / the actual letter</span>
            <h2 className="display">For the one who makes the world more interesting.</h2>
            <p>Filed under: things I mean completely.<br />Access: just {recipient}.</p>
          </Reveal>
          <Reveal delay={140}>
            <article className="letter-paper">
              <div className="letter-date">To: {recipient} · from: {sender}</div>
              <h3 id="letter-title" className="display">You are my favorite plot twist.</h3>
              <p>Happy birthday, you wonderful person.</p>
              <p>I hope this next orbit around the sun brings you the kind of days that make you stop and think, yes, this is it. More mornings that feel like a clean page. More impossible ideas that turn out to be exactly right. More people who see the full constellation of you and stay long enough to learn its shape.</p>
              <p>Thank you for being curious, for being kind in all the ways that count, and for having a mind I could happily get lost in. I hope you know that being loved by you is one of the great, improbable gifts of my life.</p>
              <p>Today, the official recommendation is cake, excellent music, one tiny delight you did not plan for, and absolutely no pretending you are anything less than extraordinary.</p>
              <div className="letter-signature">
                <span className="signature">{signatureText}</span>
                <span className="signature-note">{psNote}</span>
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      <section className="final-section" aria-labelledby="final-title">
        <div className="container final-grid">
          <Reveal>
            <span className="eyebrow">05 / transmission complete</span>
            <h2 className="final-title display" id="final-title">Keep being<br /><em>{recipient}.</em></h2>
          </Reveal>
          <Reveal delay={160}>
            <div className="final-copy">
              <p>This page will not self-destruct. It will simply sit here, quietly rooting for you, whenever you need the reminder.</p>

              {!showReplyConsole ? (
                <button
                  className={`signal-button ${signalSent ? 'is-sent' : ''}`}
                  type="button"
                  onClick={() => {
                    setShowReplyConsole(true);
                    playCelestialSound('discovery', soundEnabled);
                  }}
                  data-testid="button-send-signal"
                >
                  {signalSent ? <><Check size={15} /> signal transmitted</> : <><Zap size={15} /> send a signal back to {sender}</>}
                </button>
              ) : (
                <div className="transmission-console" aria-label="Signal response console">
                  <div className="transmission-console-bar">
                    <span className="terminal-dot" /><span className="terminal-dot" /><span className="terminal-dot" />
                    <span className="terminal-file">transmission_to_{sender.toLowerCase().replace(/\s+/g, '_')}.msg</span>
                  </div>

                  <div className="transmission-tags">
                    <span className="transmission-tag-label">quick signals:</span>
                    {quickReactions.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        className="transmission-tag-chip"
                        onClick={() => setReplyText(tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  <textarea
                    className="transmission-input"
                    rows={3}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Write your reply to ${sender}...`}
                  />

                  <div className="transmit-action-row">
                    <button
                      className="primary-button transmit-btn"
                      type="button"
                      onClick={handleTransmitWhatsApp}
                    >
                      <Send size={15} /> Transmit via WhatsApp
                    </button>
                    <span className="transmit-destination-hint">
                      {config.phone ? `Direct transmission to ${sender}'s WhatsApp` : `Opens WhatsApp to send to ${sender}`}
                    </span>
                  </div>

                  {signalSent && (
                    <div className="signal-feedback" role="status" data-testid="text-signal-feedback">
                      ✓ Signal transmission launched! Delivering your response to {sender} via WhatsApp. ✨
                    </div>
                  )}
                </div>
              )}
            </div>
          </Reveal>
        </div>
        <div className="container footer-line">
          <span><Binary size={12} /> made with unreasonable fondness</span>
          <button className="text-button" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} data-testid="button-back-to-top">
            back to the beginning <ArrowUpRight size={13} />
          </button>
        </div>
      </section>

      <PersonalizeModal
        isOpen={personalizeOpen}
        onClose={() => setPersonalizeOpen(false)}
        config={config}
        onUpdate={(newConfig) => setConfig(newConfig)}
        onReset={() => setConfig({ to: '', from: '', date: 'today', note: '', phone: '' })}
      />
    </main>
  );
}

export default App;