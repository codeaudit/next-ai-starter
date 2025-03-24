import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { CenterPanel } from '../components/CenterPanel';

const meta: Meta<typeof CenterPanel> = {
  title: 'Components/CenterPanel',
  component: CenterPanel,
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
type Story = StoryObj<typeof CenterPanel>;

const sampleMarkdown = `# Sample Document Title

This is a **markdown** document that supports formatting like:

## Features

- **Bold** text
- *Italicized* text
- Lists like this one
- [Links](https://example.com)

## Code Blocks

\`\`\`jsx
function HelloWorld() {
  return <div>Hello, World!</div>;
}
\`\`\`

## And More

> Blockquotes are also supported
`;

export const DocumentEditor: Story = {
  args: {
    documentContent: sampleMarkdown,
    editMode: true,
    onToggleEditMode: action('editModeToggled'),
    onContentChange: action('contentChanged'),
  },
  parameters: {
    docs: {
      description: {
        story: 'A markdown editor with edit and preview modes',
      },
    },
  },
};

export const PreviewMode: Story = {
  args: {
    documentContent: sampleMarkdown,
    editMode: false,
    onToggleEditMode: action('editModeToggled'),
    onContentChange: action('contentChanged'),
  },
  parameters: {
    docs: {
      description: {
        story: 'A markdown editor in preview mode, showing rendered content',
      },
    },
  },
}; 