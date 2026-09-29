import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import StellarSplit from './StellarSplit';
import { withStellarWallet } from '../../.storybook/decorators/withStellarWallet';
import { SAMPLE_STEALTH_ADDRESS } from '../../.storybook/fixtures';

const meta = {
  title: 'Pages/StellarSplit',
  component: StellarSplit,
  decorators: [withStellarWallet({ address: SAMPLE_STEALTH_ADDRESS })],
} satisfies Meta<typeof StellarSplit>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ValidatedBatch: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 1. Locate the actual CSV textarea in the real StellarSplit component
    const textarea = canvas.getByRole('textbox', { name: /batch recipients csv/i });

    // 2. Type valid CSV data into the real input
    const sampleCsv = `${SAMPLE_STEALTH_ADDRESS},10\n${SAMPLE_STEALTH_ADDRESS},5.5`;
    await userEvent.clear(textarea);
    await userEvent.type(textarea, sampleCsv);

    // 3. Find and click the real "Validate" button
    const validateButton = canvas.getByRole('button', { name: /validate/i });
    await userEvent.click(validateButton);

    // 4. Assert that the real component parsed the rows and rendered the table
    const table = await canvas.findByRole('table', { name: /batch recipients preview/i });
    await expect(table).toBeInTheDocument();

    // 5. Assert the real "Send batch" submission button is now displayed
    const sendButton = await canvas.findByRole('button', { name: /send batch/i });
    await expect(sendButton).toBeInTheDocument();
  },
};

export const InvalidBatchError: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const textarea = canvas.getByRole('textbox', { name: /batch recipients csv/i });
    await userEvent.clear(textarea);
    await userEvent.type(textarea, 'invalid_address,not_a_number');

    const validateButton = canvas.getByRole('button', { name: /validate/i });
    await userEvent.click(validateButton);

    // Assert that the real component's validation alert triggers
    const alert = await canvas.findByRole('alert');
    await expect(alert).toBeInTheDocument();
  },
};
