import { useState, type FormEvent } from 'react';
import { Check, Copy, Sparkles, X, RotateCcw } from 'lucide-react';

export interface PersonalizationConfig {
  to: string;
  from: string;
  date: string;
  note: string;
  phone?: string;
}

interface PersonalizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: PersonalizationConfig;
  onUpdate: (newConfig: PersonalizationConfig) => void;
  onReset: () => void;
}

export function PersonalizeModal({
  isOpen,
  onClose,
  config,
  onUpdate,
  onReset,
}: PersonalizeModalProps) {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState<PersonalizationConfig>(config);

  if (!isOpen) return null;

  const handleChange = (field: keyof PersonalizationConfig, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdate(updated);
  };

  const generateShareUrl = () => {
    const url = new URL(window.location.href);
    if (formData.to && formData.to !== 'you') {
      url.searchParams.set('to', formData.to);
    } else {
      url.searchParams.delete('to');
    }

    if (formData.from && formData.from !== 'someone very lucky') {
      url.searchParams.set('from', formData.from);
    } else {
      url.searchParams.delete('from');
    }

    if (formData.date && formData.date !== 'today') {
      url.searchParams.set('date', formData.date);
    } else {
      url.searchParams.delete('date');
    }

    if (formData.note) {
      url.searchParams.set('note', formData.note);
    } else {
      url.searchParams.delete('note');
    }

    if (formData.phone) {
      const cleanPhone = formData.phone.replace(/[^\d+]/g, '');
      if (cleanPhone) {
        url.searchParams.set('phone', cleanPhone);
      } else {
        url.searchParams.delete('phone');
      }
    } else {
      url.searchParams.delete('phone');
    }

    return url.toString();
  };

  const handleCopyLink = async (e: FormEvent) => {
    e.preventDefault();
    const shareUrl = generateShareUrl();
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  const handleResetForm = () => {
    const defaultConfig: PersonalizationConfig = {
      to: '',
      from: '',
      date: 'today',
      note: '',
      phone: '',
    };
    setFormData(defaultConfig);
    onReset();
  };

  return (
    <div
      className="personalize-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="personalize-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="personalize-card">
        <div className="personalize-header">
          <div>
            <span className="eyebrow"><Sparkles size={13} /> customize transmission</span>
            <h2 id="personalize-title" className="display personalize-title">
              Personalize This Wish
            </h2>
          </div>
          <button
            type="button"
            className="personalize-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <p className="personalize-desc">
          Enter your names and optional WhatsApp number. When she opens your link, she will see a private, custom universe made just for her, with a button to send her reply directly to your WhatsApp!
        </p>

        <form onSubmit={handleCopyLink} className="personalize-form">
          <div className="personalize-field">
            <label htmlFor="input-to">
              Birthday Person Name (To):
            </label>
            <input
              id="input-to"
              type="text"
              placeholder="e.g. Maya or Sophia"
              value={formData.to}
              onChange={(e) => handleChange('to', e.target.value)}
              className="personalize-input"
            />
          </div>

          <div className="personalize-field">
            <label htmlFor="input-from">
              Your Name / Sign-off (From):
            </label>
            <input
              id="input-from"
              type="text"
              placeholder="e.g. Alex or Always, me"
              value={formData.from}
              onChange={(e) => handleChange('from', e.target.value)}
              className="personalize-input"
            />
          </div>

          <div className="personalize-field">
            <label htmlFor="input-phone">
              Your WhatsApp Number (Optional):
            </label>
            <input
              id="input-phone"
              type="tel"
              placeholder="e.g. +1234567890 (with country code)"
              value={formData.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="personalize-input"
            />
            <span style={{ fontSize: '11px', color: 'var(--ink-faint)', marginTop: '2px' }}>
              Her reply from the &ldquo;send a signal back&rdquo; console will open directly in your WhatsApp chat!
            </span>
          </div>

          <div className="personalize-field">
            <label htmlFor="input-date">
              Transmission Date:
            </label>
            <input
              id="input-date"
              type="text"
              placeholder="today, or e.g. September 4"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className="personalize-input"
            />
          </div>

          <div className="personalize-field">
            <label htmlFor="input-note">
              Special P.S. Note (Optional):
            </label>
            <textarea
              id="input-note"
              rows={2}
              placeholder="e.g. P.S. Can't wait for our celebratory dinner tonight!"
              value={formData.note}
              onChange={(e) => handleChange('note', e.target.value)}
              className="personalize-textarea"
            />
          </div>

          <div className="personalize-actions">
            <button
              type="button"
              onClick={handleResetForm}
              className="text-button personalize-reset-btn"
            >
              <RotateCcw size={13} /> Reset
            </button>
            <button
              type="submit"
              className="primary-button personalize-submit-btn"
            >
              {copied ? (
                <>
                  <Check size={16} /> Link Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy size={16} /> Copy Personalized Link
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

