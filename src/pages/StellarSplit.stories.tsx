import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { withStellarWallet } from '../../.storybook/decorators/withStellarWallet';
import { SAMPLE_STEALTH_ADDRESS } from '../../.storybook/fixtures';

// Simulated status badge component for testing
function StatusBadge({
  status,
}: {
  status: 'valid' | 'invalid' | 'pending' | 'success' | 'failed' | 'unvalidated';
}) {
  switch (status) {
    case 'valid':
      return (
        <span
          aria-live="polite"
          aria-atomic="true"
          className="inline-block h-1.5 w-1.5 bg-tertiary"
          title="Valid"
          aria-label="valid"
        />
      );
    case 'invalid':
      return (
        <span
          aria-live="polite"
          aria-atomic="true"
          className="inline-block h-1.5 w-1.5 bg-error"
          title="Invalid"
          aria-label="invalid"
        />
      );
    case 'pending':
      return (
        <span
          aria-live="polite"
          aria-atomic="true"
          className="inline-block h-1.5 w-1.5 animate-pulse bg-primary"
          title="Pending"
          aria-label="pending"
        />
      );
    case 'success':
      return (
        <span
          aria-live="polite"
          aria-atomic="true"
          className="inline-block h-1.5 w-1.5 bg-tertiary"
          title="Sent"
          aria-label="sent"
        />
      );
    case 'failed':
      return (
        <span
          aria-live="polite"
          aria-atomic="true"
          className="inline-block h-1.5 w-1.5 bg-error"
          title="Failed"
          aria-label="failed"
        />
      );
    default:
      return (
        <span
          aria-live="polite"
          aria-atomic="true"
          className="inline-block h-1.5 w-1.5 bg-outline"
          title="Unvalidated"
          aria-label="unvalidated"
        />
      );
  }
}

const meta = {
  title: 'Stellar/StellarSplit',
  component: StatusBadge,
  decorators: [withStellarWallet({ address: SAMPLE_STEALTH_ADDRESS })],
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    status: 'unvalidated', // or 'valid' / whichever is the initial default
  },
};

/**
 * Interactive wrapper with simulated state transitions for accessibility testing.
 * This story provides controls to transition between different status states
 * so the aria-live regions broadcast live updates.
 */
export const Interactive: Story = {
  args: {
    status: 'unvalidated',
  },
  render: () => {
    const [status, setStatus] = useState<
      'valid' | 'invalid' | 'pending' | 'success' | 'failed' | 'unvalidated'
    >('unvalidated');
    const [error, setError] = useState('');

    return (
      <div className="min-h-screen bg-surface p-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-6 font-heading text-2xl font-bold uppercase tracking-tight text-on-surface">
            Stellar Split (A11y Test)
          </h1>

          {/* State controls for testing */}
          <div className="mb-6 flex gap-2 border border-outline-variant bg-surface-container p-4">
            <button
              type="button"
              onClick={() => {
                setStatus('unvalidated');
                setError('');
              }}
              className="h-8 border border-outline-variant bg-surface-bright px-3 font-heading text-[10px] font-semibold uppercase tracking-widest text-primary"
            >
              Unvalidated
            </button>
            <button
              type="button"
              onClick={() => {
                setStatus('valid');
                setError('');
              }}
              className="h-8 border border-outline-variant bg-surface-bright px-3 font-heading text-[10px] font-semibold uppercase tracking-widest text-primary"
            >
              Valid
            </button>
            <button
              type="button"
              onClick={() => {
                setStatus('invalid');
                setError('Invalid meta-address format');
              }}
              className="h-8 border border-outline-variant bg-surface-bright px-3 font-heading text-[10px] font-semibold uppercase tracking-widest text-primary"
            >
              Invalid
            </button>
            <button
              type="button"
              onClick={() => {
                setStatus('pending');
                setError('');
              }}
              className="h-8 border border-outline-variant bg-surface-bright px-3 font-heading text-[10px] font-semibold uppercase tracking-widest text-primary"
            >
              Pending
            </button>
            <button
              type="button"
              onClick={() => {
                setStatus('success');
                setError('');
              }}
              className="h-8 border border-outline-variant bg-surface-bright px-3 font-heading text-[10px] font-semibold uppercase tracking-widest text-primary"
            >
              Success
            </button>
            <button
              type="button"
              onClick={() => {
                setStatus('failed');
                setError('Transaction failed: insufficient balance');
              }}
              className="h-8 border border-outline-variant bg-surface-bright px-3 font-heading text-[10px] font-semibold uppercase tracking-widest text-primary"
            >
              Failed
            </button>
          </div>

          {/* Simulated batch row with status badge */}
          <div className="space-y-4">
            <div className="border border-outline-variant bg-surface-container p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-mono text-sm text-primary">
                    st:xlm:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
                  </p>
                  <p className="font-mono text-sm text-on-surface-variant">5.5 XLM</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={status} />
                  <span className="font-body text-xs text-outline">{status}</span>
                </div>
              </div>
            </div>

            {/* Status region for error state */}
            {status === 'invalid' || status === 'failed' ? (
              <div
                role="alert"
                aria-live="assertive"
                className="border border-error/30 bg-error/10 p-4"
              >
                <p className="font-body text-sm text-error">{error}</p>
              </div>
            ) : null}

            {/* Status region for pending state */}
            {status === 'pending' ? (
              <div
                role="status"
                aria-live="polite"
                className="border border-outline-variant bg-surface-container p-4"
              >
                <p className="font-body text-sm text-on-surface-variant">
                  Processing batch transactions...
                </p>
              </div>
            ) : null}

            {/* Status region for success state */}
            {status === 'success' ? (
              <div
                role="status"
                aria-live="polite"
                className="border border-tertiary/30 bg-tertiary/10 p-4"
              >
                <p className="font-body text-sm text-tertiary">Batch completed successfully</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  },
};
