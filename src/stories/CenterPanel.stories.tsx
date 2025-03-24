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

const simpleVersions = [
  { id: 'v1', label: 'Draft 1', date: '2025-01-01' },
  { id: 'v2', label: 'Draft 2', date: '2025-02-10' }
];

export const VersionTimeline: Story = {
  args: {
    documentContent: sampleMarkdown,
    editMode: false,
    versions: simpleVersions,
    selectedVersion: 'v2',
    onToggleEditMode: action('editModeToggled'),
    onContentChange: action('contentChanged'),
    onSelectVersion: action('versionSelected'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Document editor with a simple version timeline below',
      },
    },
  },
};

const versionWithBranching = [
  { id: 'v1', label: 'Draft 1', date: '2025-01-01' },
  { id: 'v2', label: 'Draft 2', date: '2025-02-10' },
  { id: 'v2b', label: 'Alternative', date: '2025-02-15', parentId: 'v1' },
  { id: 'v3', label: 'Final', date: '2025-03-01', parentId: 'v2' },
  { id: 'v2c', label: 'Experiment', date: '2025-02-20', parentId: 'v1' },
  { id: 'v3b', label: 'Alt Final', date: '2025-03-05', parentId: 'v2b' }
];

export const VersionTimelineWithBranching: Story = {
  args: {
    documentContent: sampleMarkdown,
    editMode: false,
    versions: versionWithBranching,
    selectedVersion: 'v3',
    onToggleEditMode: action('editModeToggled'),
    onContentChange: action('contentChanged'),
    onSelectVersion: action('versionSelected'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Document editor with a complex version timeline showing branching',
      },
    },
  },
}; 