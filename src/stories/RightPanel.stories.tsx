import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { RightPanel } from '../components/RightPanel';

const meta: Meta<typeof RightPanel> = {
  title: 'Components/RightPanel',
  component: RightPanel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '400px', height: '600px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof RightPanel>;

export const ChatInterface: Story = {
  args: {
    messages: [
      { role: 'user', text: 'Hello' },
      { role: 'ai', text: 'Hi! How can I help?' },
    ],
    onSendMessage: action('messageSent'),
  },
  parameters: {
    docs: {
      description: {
        story: 'A basic chat interface with a few messages',
      },
    },
  },
};

export const EmptyChatInterface: Story = {
  args: {
    messages: [],
    onSendMessage: action('messageSent'),
  },
  parameters: {
    docs: {
      description: {
        story: 'An empty chat interface with no messages',
      },
    },
  },
};

export const LongConversation: Story = {
  args: {
    messages: [
      { role: 'user', text: 'Hello' },
      { role: 'ai', text: 'Hi! How can I help you today?' },
      { role: 'user', text: 'I need help with a problem I\'m having with my code' },
      { role: 'ai', text: 'Sure, I\'d be happy to help. Can you describe the issue you\'re experiencing and share some of the relevant code?' },
      { role: 'user', text: 'I\'m trying to implement a feature where users can filter a list of items by various criteria, but I\'m not sure how to structure the filter state and logic.' },
      { role: 'ai', text: 'That\'s a common challenge. There are a few different approaches you might take:\n\n1. Use a single object for all your filter criteria\n2. Use individual state variables for each filter\n3. Use a reducer pattern for more complex filtering logic\n\nCould you tell me more about your specific use case? How many different filter criteria do you have, and do they interact with each other?' },
      { role: 'user', text: 'There are about 5 different filters. They include text search, category selection (multiple can be selected), date range, status, and price range.' },
      { role: 'ai', text: 'With that many filters and some of them potentially having multiple selected values, I\'d recommend using either an object approach or a reducer pattern. Here\'s a simple example of how you might structure it with a filter object:\n\n```jsx\nconst [filters, setFilters] = useState({\n  search: "",\n  categories: [],\n  dateRange: { start: null, end: null },\n  status: "all",\n  priceRange: { min: 0, max: 1000 }\n});\n\n// Example update function\nconst updateFilter = (key, value) => {\n  setFilters(prev => ({\n    ...prev,\n    [key]: value\n  }));\n};\n```\n\nThis approach makes it easy to update individual filters while keeping all your filter state in one place.' },
    ],
    onSendMessage: action('messageSent'),
  },
  parameters: {
    docs: {
      description: {
        story: 'A chat interface with a longer conversation to test scrolling',
      },
    },
  },
}; 