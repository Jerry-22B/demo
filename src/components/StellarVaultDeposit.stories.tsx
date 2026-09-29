import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { StellarVaultDeposit } from './StellarVaultDeposit';
import { withStellarWallet } from '../../.storybook/decorators/withStellarWallet';
import { SAMPLE_STEALTH_ADDRESS } from '../../.storybook/fixtures';

const meta = {
  title: 'Stellar/StellarVaultDeposit',
  component: StellarVaultDeposit,
  decorators: [withStellarWallet({ address: SAMPLE_STEALTH_ADDRESS })],
} satisfies Meta<typeof StellarVaultDeposit>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/**
 * Interactive wrapper with simulated state transitions for accessibility testing.
 * This story provides mock handlers that transition between idle, pending, success, and error states
 * so the aria-live regions broadcast live updates.
 */
export const Interactive: Story = {
  render: () => {
    const [depositState, setDepositState] = useState<'idle' | 'pending' | 'success' | 'error'>(
      'idle',
    );
    const [error, setError] = useState('');

    // Mock the component with controlled state for testing
    return (
      <div className="min-h-screen bg-surface p-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-6 font-heading text-2xl font-bold uppercase tracking-tight text-on-surface">
            Vault Deposit (A11y Test)
          </h1>

          {/* State controls for testing */}
          <div className="mb-6 flex gap-2 border border-outline-variant bg-surface-container p-4">
            <button
              type="button"
              onClick={() => {
                setDepositState('idle');
                setError('');
              }}
              className="h-8 border border-outline-variant bg-surface-bright px-3 font-heading text-[10px] font-semibold uppercase tracking-widest text-primary"
            >
              Idle
            </button>
            <button
              type="button"
              onClick={() => {
                setDepositState('pending');
                setError('');
              }}
              className="h-8 border border-outline-variant bg-surface-bright px-3 font-heading text-[10px] font-semibold uppercase tracking-widest text-primary"
            >
              Pending
            </button>
            <button
              type="button"
              onClick={() => {
                setDepositState('success');
                setError('');
              }}
              className="h-8 border border-outline-variant bg-surface-bright px-3 font-heading text-[10px] font-semibold uppercase tracking-widest text-primary"
            >
              Success
            </button>
            <button
              type="button"
              onClick={() => {
                setDepositState('error');
                setError('Deposit failed: insufficient balance');
              }}
              className="h-8 border border-outline-variant bg-surface-bright px-3 font-heading text-[10px] font-semibold uppercase tracking-widest text-primary"
            >
              Error
            </button>
          </div>

          {/* Simulated form with aria-live regions */}
          <form className="space-y-4">
            <div>
              <label
                htmlFor="vault-recipient"
                className="mb-2 block font-heading text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant"
              >
                Recipient Meta-Address
              </label>
              <input
                id="vault-recipient"
                type="text"
                defaultValue="st:xlm:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                className="h-12 w-full border border-outline-variant bg-surface px-4 font-mono text-sm text-primary placeholder:text-outline focus:border-primary"
              />
              <p
                id="vault-recipient-error"
                className="min-h-5 text-xs text-error"
                aria-live="polite"
              >
                {depositState === 'error' && error ? error : ' '}
              </p>
            </div>

            <div>
              <label
                htmlFor="vault-amount"
                className="mb-2 block font-heading text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant"
              >
                Amount (XLM)
              </label>
              <input
                id="vault-amount"
                type="text"
                defaultValue="1.5"
                className="h-12 w-full border border-outline-variant bg-surface px-4 font-mono text-sm text-primary placeholder:text-outline focus:border-primary"
              />
              <p id="vault-amount-error" className="min-h-5 text-xs text-error" aria-live="polite">
                {depositState === 'error' && error ? error : ' '}
              </p>
            </div>

            {/* Status region for pending/success states */}
            <div
              role="status"
              aria-live="polite"
              className="border border-outline-variant bg-surface-container p-4"
            >
              {depositState === 'pending' && (
                <p className="font-body text-sm text-on-surface-variant">
                  Submitting deposit transaction...
                </p>
              )}
              {depositState === 'success' && (
                <p className="font-body text-sm text-tertiary">Deposit completed successfully</p>
              )}
              {depositState === 'error' && <p className="font-body text-sm text-error">{error}</p>}
              {depositState === 'idle' && (
                <p className="font-body text-sm text-outline">Enter deposit details to begin</p>
              )}
            </div>

            <button
              type="button"
              disabled={depositState === 'pending'}
              className="h-11 w-full border border-outline-variant bg-surface-bright font-heading text-[11px] font-semibold uppercase tracking-widest text-primary transition-colors hover:bg-surface-container disabled:opacity-50"
            >
              {depositState === 'pending' ? 'Processing...' : 'Deposit'}
            </button>
          </form>
        </div>
      </div>
    );
  },
};
