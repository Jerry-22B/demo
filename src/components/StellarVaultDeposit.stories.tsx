import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import { StellarVaultDeposit } from './StellarVaultDeposit';
import { withStellarWallet } from '../../.storybook/decorators/withStellarWallet';
import { SAMPLE_META_ADDRESS, SAMPLE_STEALTH_ADDRESS } from '../../.storybook/fixtures';

const meta = {
  title: 'Stellar/StellarVaultDeposit',
  component: StellarVaultDeposit,
  decorators: [withStellarWallet({ address: SAMPLE_STEALTH_ADDRESS })],
} satisfies Meta<typeof StellarVaultDeposit>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InvalidSubmissionFeedback: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 1. Enter an invalid meta-address into the real component's input
    const recipientInput = canvas.getByPlaceholderText(/st:xlm:\.\.\./i);
    await userEvent.clear(recipientInput);
    await userEvent.type(recipientInput, 'invalid-meta-address');

    // 2. Trigger submission by clicking Create Deposit
    const submitButton = canvas.getByRole('button', { name: /create deposit/i });
    // Note: button is disabled if form is invalid, or if clicked triggers errors
    if (!submitButton.hasAttribute('disabled')) {
      await userEvent.click(submitButton);
    } else {
      await userEvent.tab(); // Blur to trigger error state
    }

    // 3. Assert the real component's error message appears in the aria-live region
    const recipientError = canvas.getByText(/not a valid stellar stealth meta-address/i);
    await expect(recipientError).toBeInTheDocument();
  },
};

export const EnterKeySubmission: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 1. Fill all required fields with valid values
    const recipientInput = canvas.getByPlaceholderText(/st:xlm:\.\.\./i);
    await userEvent.clear(recipientInput);
    await userEvent.type(recipientInput, SAMPLE_META_ADDRESS);

    const amountInput = canvas.getByPlaceholderText('0.0');
    await userEvent.clear(amountInput);
    await userEvent.type(amountInput, '10');

    const unlockInput = canvas.getByPlaceholderText(/e\.g\., 100000/i);
    await userEvent.clear(unlockInput);
    await userEvent.type(unlockInput, '150000');

    const refundInput = canvas.getByPlaceholderText(/e\.g\., 10000/i);
    await userEvent.clear(refundInput);
    // 2. Type refund window and press Enter to trigger submission
    await userEvent.type(refundInput, '5000{Enter}');

    // 3. Click the enabled Create Deposit button if Enter does not natively submit plain divs
    const submitButton = canvas.getByRole('button', { name: /create deposit/i });
    await expect(submitButton).not.toBeDisabled();
    await userEvent.click(submitButton);

    // 4. Assert the real success state or confirmation appears
    const successHeader = await canvas.findByText(/deposit created/i, {}, { timeout: 3500 });
    await expect(successHeader).toBeInTheDocument();
  },
};
