import type { Meta, StoryObj } from '@storybook/react-vite';
import ThemeToggle from './ThemeToggle';

const meta = {
  title: 'Components/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onToggle: { action: 'theme toggled' },
  },
} satisfies Meta<typeof ThemeToggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Light: Story = {
  args: {
    theme: 'light',
    onToggle: () => undefined,
  },
};

export const Dark: Story = {
  args: {
    theme: 'dark',
    onToggle: () => undefined,
  },
};
