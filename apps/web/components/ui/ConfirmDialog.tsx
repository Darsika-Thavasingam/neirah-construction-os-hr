'use client';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  loading = false,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        style={{ maxWidth: 440 }}
        role="alertdialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ height: 4, background: 'linear-gradient(90deg, #EF4444 0%, #F87171 100%)' }} />
        
        <div className="modal-body" style={{ padding: '32px 28px 24px', textAlign: 'center' }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: 'rgba(254, 226, 226, 0.7)',
            border: '1px solid rgba(252, 165, 165, 0.5)',
            color: '#EF4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={24} height={24}>
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.4px', marginBottom: 8 }}>
            {title}
          </h3>

          <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.5, margin: 0 }}>
            {message}
          </p>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'center', background: 'rgba(248, 250, 252, 0.5)', gap: 12, paddingBottom: 24 }}>
          <button type="button" className="btn-outline-pill" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="button" className="btn-danger-pill" onClick={onConfirm} disabled={loading}>
            {loading ? 'Processing…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
