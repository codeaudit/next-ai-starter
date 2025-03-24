import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { RightPanel, Message } from '../components/RightPanel';

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

// Common sample messages
const sampleMessages: Message[] = [
  { role: 'user', text: 'Hello' },
  { role: 'ai', text: 'Hi! How can I help?' },
];

const longConversation: Message[] = [
  { role: 'user', text: 'Hello' },
  { role: 'ai', text: 'Hi! How can I help you today?' },
  { role: 'user', text: 'I need help with a problem I\'m having with my code' },
  { role: 'ai', text: 'Sure, I\'d be happy to help. Can you describe the issue you\'re experiencing and share some of the relevant code?' },
  { role: 'user', text: 'I\'m trying to implement a feature where users can filter a list of items by various criteria, but I\'m not sure how to structure the filter state and logic.' },
  { role: 'ai', text: 'That\'s a common challenge. There are a few different approaches you might take:\n\n1. Use a single object for all your filter criteria\n2. Use individual state variables for each filter\n3. Use a reducer pattern for more complex filtering logic\n\nCould you tell me more about your specific use case? How many different filter criteria do you have, and do they interact with each other?' },
  { role: 'user', text: 'There are about 5 different filters. They include text search, category selection (multiple can be selected), date range, status, and price range.' },
  { role: 'ai', text: 'With that many filters and some of them potentially having multiple selected values, I\'d recommend using either an object approach or a reducer pattern. Here\'s a simple example of how you might structure it with a filter object:\n\n```jsx\nconst [filters, setFilters] = useState({\n  search: "",\n  categories: [],\n  dateRange: { start: null, end: null },\n  status: "all",\n  priceRange: { min: 0, max: 1000 }\n});\n\n// Example update function\nconst updateFilter = (key, value) => {\n  setFilters(prev => ({\n    ...prev,\n    [key]: value\n  }));\n};\n```\n\nThis approach makes it easy to update individual filters while keeping all your filter state in one place.' },
];

export const ChatInterface: Story = {
  args: {
    messages: sampleMessages,
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
    messages: longConversation,
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

// Sample tabs for tabbed conversations
const sampleTabs = [
  {
    id: 'brainstorm',
    label: 'Brainstorm',
    messages: [
      { role: 'user' as const, text: 'Let\'s brainstorm some new feature ideas' },
      { role: 'ai' as const, text: 'Great! What kind of features are you thinking about?' },
      { role: 'user' as const, text: 'Something to help users organize their content better' },
      { role: 'ai' as const, text: 'Here are some ideas:\n\n1. Hierarchical tags\n2. Smart collections based on content similarity\n3. Custom metadata fields\n4. Visual board view for content organization\n\nDo any of these sound interesting?' },
    ],
  },
  {
    id: 'validation',
    label: 'Validation',
    messages: [
      { role: 'user' as const, text: 'I need to validate this approach for the new authentication flow' },
      { role: 'ai' as const, text: 'I\'d be happy to help with that. Can you describe your planned authentication flow?' },
      { role: 'user' as const, text: 'We\'re thinking of using OAuth with JWT tokens stored in HTTP-only cookies' },
      { role: 'ai' as const, text: 'That\'s a solid approach. Using HTTP-only cookies for JWT tokens provides good security against XSS attacks. Just make sure to:\n\n- Set the Secure flag to ensure cookies are sent only over HTTPS\n- Implement CSRF protection since HTTP-only cookies are still vulnerable to CSRF\n- Consider token rotation and proper expiration handling\n\nDo you have any specific concerns about this approach?' },
    ],
  },
];

export const TabbedConversations: Story = {
  args: {
    useTabs: true,
    tabs: sampleTabs,
    activeTabId: 'brainstorm',
    onTabSendMessage: action('tabMessageSent'),
    onSwitchTab: action('tabSwitched'),
    onAddTab: action('addTabClicked'),
    onCloseTab: action('closeTabClicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'A tabbed conversation interface with multiple conversation threads',
      },
    },
  },
};

export const AddTabDemo: Story = {
  args: {
    useTabs: true,
    tabs: [
      {
        id: 'first',
        label: 'First Chat',
        messages: sampleMessages,
      },
    ],
    activeTabId: 'first',
    onTabSendMessage: action('tabMessageSent'),
    onSwitchTab: action('tabSwitched'),
    onAddTab: action('addTabClicked'),
    onCloseTab: action('closeTabClicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstration of adding a new conversation tab',
      },
    },
  },
}; 