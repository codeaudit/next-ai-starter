import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { LeftPanel } from '../components/LeftPanel';

const meta: Meta<typeof LeftPanel> = {
  title: 'Components/LeftPanel',
  component: LeftPanel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ height: '600px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof LeftPanel>;

export const WorkspaceAndDocs: Story = {
  args: {
    workspaces: ['Project A', 'Project B', 'Project C'],
    currentWorkspace: 'Project A',
    documents: [
      { id: 1, title: 'Doc 1', folder: 'Main' },
      { id: 2, title: 'Doc 2', folder: 'Main' },
      { id: 3, title: 'Archived Doc', folder: 'Archive' },
    ],
    viewMode: 'docs',
    onSelectWorkspace: action('workspaceSwitched'),
    onSelectDoc: action('docSelected'),
    onToggleViewMode: action('viewModeToggled'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Left panel with workspace dropdown and document hierarchy',
      },
    },
  },
};

export const PatternWebToggle: Story = {
  args: {
    workspaces: ['Project A', 'Project B', 'Project C'],
    currentWorkspace: 'Project A',
    documents: [
      { id: 1, title: 'Doc 1', folder: 'Main' },
      { id: 2, title: 'Doc 2', folder: 'Main' },
      { id: 3, title: 'Archived Doc', folder: 'Archive' },
    ],
    viewMode: 'patternWeb',
    onSelectWorkspace: action('workspaceSwitched'),
    onSelectDoc: action('docSelected'),
    onToggleViewMode: action('viewModeToggled'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Left panel with pattern web toggle enabled, showing the pattern web view',
      },
    },
  },
};

export const SnippetLibrary: Story = {
  args: {
    workspaces: ['Project A', 'Project B', 'Project C'],
    currentWorkspace: 'Project A',
    documents: [
      { id: 1, title: 'Doc 1', folder: 'Main' },
      { id: 2, title: 'Doc 2', folder: 'Main' },
    ],
    viewMode: 'docs',
    snippets: [
      { id: '1', title: 'Sample Intro Text', content: 'Hello, world!' },
      { id: '2', title: 'Brand Guidelines Snippet', content: 'Use color #003366...' },
    ],
    onSelectWorkspace: action('workspaceSwitched'),
    onSelectDoc: action('docSelected'),
    onToggleViewMode: action('viewModeToggled'),
    onSnippetSelect: action('snippetSelected'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Left panel with a collapsible snippets library at the bottom',
      },
    },
  },
}; 