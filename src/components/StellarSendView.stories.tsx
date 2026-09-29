import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { StellarSendView } from './StellarSendView';
import {
  SAMPLE_META_ADDRESS,
  SAMPLE_STEALTH_ADDRESS,
  SAMPLE_TX_HASH,
} from '../../.storybook/fixtures';

const meta = {
  title: 'Stellar/StellarSendView',
  component: StellarSendView,
  args: {
    isConnected: true,
    recipient: '',
    amount: '',
    assetKey: 'XLM',
    recipientError: '',
    showRecipientError: false,
    amountError: '',
    showAmountError: false,
    amountInvalid: false,
    balanceText: 'Enter amount',
    balanceIsError: false,
    trustlineError: '',
    simulationStatus: 'idle',
    simulationError: '',
    simulationFee: null,
    simulationReturnValue: null,
    simulationEvents: [],
    error: '',
    canSubmit: false,
    isPending: false,
    stealthResult: null,
    txHash: null,
    isSuccess: false,
    onRecipientChange: fn(),
    onRecipientBlur: fn(),
    onAssetChange: fn(),
    onAmountChange: fn(),
    onAmountBlur: fn(),
    onPaste: fn(),
    onSend: fn(),
    onReset: fn(),
  },
} satisfies Meta<typeof StellarSendView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Disconnected: Story = { args: { isConnected: false } };

export const Idle: Story = {};

export const Filled: Story = {
  args: {
    recipient: SAMPLE_META_ADDRESS,
    amount: '5',
    balanceText: '100 XLM',
    canSubmit: true,
  },
};

export const CheckingBalance: Story = {
  args: { recipient: SAMPLE_META_ADDRESS, amount: '5', balanceText: 'Checking...' },
};

export const InsufficientBalance: Story = {
  args: {
    recipient: SAMPLE_META_ADDRESS,
    amount: '5000',
    showAmountError: true,
    amountInvalid: true,
    balanceText: 'Insufficient XLM (you have 100, need 5001.00001)',
    balanceIsError: true,
  },
};

export const Pending: Story = {
  args: {
    recipient: SAMPLE_META_ADDRESS,
    amount: '5',
    balanceText: '100 XLM',
    canSubmit: false,
    isPending: true,
  },
};

export const RecipientError: Story = {
  args: {
    recipient: 'st:xlm:not-valid',
    showRecipientError: true,
    recipientError: 'Not a valid Stellar stealth meta-address',
  },
};

export const AmountError: Story = {
  args: {
    recipient: SAMPLE_META_ADDRESS,
    amount: '0',
    showAmountError: true,
    amountInvalid: true,
    amountError: 'Amount must be greater than 0.0000001 XLM',
  },
};

export const SubmitError: Story = {
  args: {
    recipient: SAMPLE_META_ADDRESS,
    amount: '5',
    balanceText: '100 XLM',
    error: 'Transaction failed',
  },
};

export const PendingResult: Story = {
  args: { stealthResult: { stealthAddress: SAMPLE_STEALTH_ADDRESS }, isSuccess: false },
};

export const Success: Story = {
  args: {
    stealthResult: { stealthAddress: SAMPLE_STEALTH_ADDRESS },
    txHash: SAMPLE_TX_HASH,
    isSuccess: true,
  },
};

/**
 * Interactive wrapper with simulated state transitions for accessibility testing.
 * This story provides controls to transition between idle, pending, success, and error states
 * so the aria-live regions broadcast live updates.
 */
export const Interactive: Story = {
  render: () => {
    const [submitState, setSubmitState] = useState<'idle' | 'pending' | 'success' | 'error'>(
      'idle',
    );
    const [error, setError] = useState('');

    return (
      <div className="min-h-screen bg-surface p-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-6 font-heading text-2xl font-bold uppercase tracking-tight text-on-surface">
            Stellar Send (A11y Test)
          </h1>

          {/* State controls for testing */}
          <div className="mb-6 flex gap-2 border border-outline-variant bg-surface-container p-4">
            <button
              type="button"
              onClick={() => {
                setSubmitState('idle');
                setError('');
              }}
              className="h-8 border border-outline-variant bg-surface-bright px-3 font-heading text-[10px] font-semibold uppercase tracking-widest text-primary"
            >
              Idle
            </button>
            <button
              type="button"
              onClick={() => {
                setSubmitState('pending');
                setError('');
              }}
              className="h-8 border border-outline-variant bg-surface-bright px-3 font-heading text-[10px] font-semibold uppercase tracking-widest text-primary"
            >
              Pending
            </button>
            <button
              type="button"
              onClick={() => {
                setSubmitState('success');
                setError('');
              }}
              className="h-8 border border-outline-variant bg-surface-bright px-3 font-heading text-[10px] font-semibold uppercase tracking-widest text-primary"
            >
              Success
            </button>
            <button
              type="button"
              onClick={() => {
                setSubmitState('error');
                setError('Transaction failed: insufficient balance');
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
                htmlFor="stellar-recipient"
                className="mb-2 block font-heading text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant"
              >
                Recipient Meta-Address
              </label>
              <input
                id="stellar-recipient"
                type="text"
                defaultValue={SAMPLE_META_ADDRESS}
                className="h-12 w-full border border-outline-variant bg-surface px-4 font-mono text-sm text-primary placeholder:text-outline focus:border-primary"
              />
              <p
                id="stellar-recipient-error"
                className="min-h-5 text-xs text-error"
                aria-live="polite"
              >
                {submitState === 'error' && error ? error : ' '}
              </p>
            </div>

            <div>
              <label
                htmlFor="stellar-amount"
                className="mb-2 block font-heading text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant"
              >
                Amount (XLM)
              </label>
              <div className="relative">
                <input
                  id="stellar-amount"
                  type="text"
                  defaultValue="5"
                  className="h-12 w-full border border-outline-variant bg-surface px-4 font-mono text-sm text-primary placeholder:text-outline focus:border-primary"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs text-outline">
                  XLM
                </span>
              </div>
              <p
                id="stellar-amount-error"
                className="min-h-5 text-xs text-error"
                aria-live="polite"
              >
                {submitState === 'error' && error ? error : ' '}
              </p>
            </div>

            {/* Balance region with aria-live */}
            <div
              role="status"
              aria-live="polite"
              className={`flex items-center justify-between border border-outline-variant bg-surface-container p-3 ${
                submitState === 'error' ? 'text-error' : 'text-on-surface-variant'
              }`}
            >
              <span className="font-body text-sm">Balance</span>
              <span className="font-mono text-sm">
                {submitState === 'pending' ? 'Checking...' : '100 XLM'}
              </span>
            </div>

            {/* Status region for pending/success states */}
            <div
              role="status"
              aria-live="polite"
              className="border border-outline-variant bg-surface-container p-4"
            >
              {submitState === 'pending' && (
                <p className="font-body text-sm text-on-surface-variant">
                  Submitting transaction...
                </p>
              )}
              {submitState === 'success' && (
                <p className="font-body text-sm text-tertiary">
                  Transaction completed successfully
                </p>
              )}
              {submitState === 'error' && <p className="font-body text-sm text-error">{error}</p>}
              {submitState === 'idle' && (
                <p className="font-body text-sm text-outline">Enter recipient and amount to send</p>
              )}
            </div>

            <button
              type="button"
              disabled={submitState === 'pending'}
              className="h-11 w-full border border-outline-variant bg-surface-bright font-heading text-[11px] font-semibold uppercase tracking-widest text-primary transition-colors hover:bg-surface-container disabled:opacity-50"
            >
              {submitState === 'pending' ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    );
  },
};
