import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { PatternWeb } from '../components/PatternWeb';

const meta: Meta<typeof PatternWeb> = {
  title: 'Components/PatternWeb',
  component: PatternWeb,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '800px', height: '600px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PatternWeb>;

export const BasicGraph: Story = {
  args: {
    patterns: [
      { id: "ScenarioExpansion", label: "Scenario Expansion", connectedTo: ["ConstraintEmphasis"] },
      { id: "ConstraintEmphasis", label: "Constraint Emphasis", connectedTo: ["ConflictMediation"] },
      { id: "ConflictMediation", label: "Conflict Mediation", connectedTo: [] }
    ],
    onNodeClick: action('nodeClicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'A simple graph of pattern nodes with minimal styling and basic interactions',
      },
    },
  },
}; 