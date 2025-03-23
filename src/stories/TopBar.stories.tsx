import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { TopBar } from '../components/TopBar';

const meta: Meta<typeof TopBar> = {
  title: 'Components/TopBar',
  component: TopBar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TopBar>;

export const BasicLayout: Story = {
  args: {
    title: 'PatternLanguageO1 Toolbox',
    showVibeControl: false,
    user: { name: 'Test User', avatarUrl: '' },
  },
};

export const WithVibeControl: Story = {
  args: {
    title: 'PatternLanguageO1 Toolbox',
    showVibeControl: true,
    vibeLevel: 50,
    onVibeChange: action('vibeChanged'),
    user: { name: 'Test User', avatarUrl: '' },
  },
}; 