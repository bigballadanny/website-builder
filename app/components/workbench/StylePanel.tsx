import { memo, useState, useCallback } from 'react';
import { classNames } from '~/utils/classNames';

interface StylePanelProps {
  onStyleChange: (css: string) => void;
  selectedElement?: string;
}

const FONT_FAMILIES = [
  { name: 'System', value: 'system-ui, -apple-system, sans-serif' },
  { name: 'Inter', value: "'Inter', sans-serif" },
  { name: 'Roboto', value: "'Roboto', sans-serif" },
  { name: 'Open Sans', value: "'Open Sans', sans-serif" },
  { name: 'Lato', value: "'Lato', sans-serif" },
  { name: 'Poppins', value: "'Poppins', sans-serif" },
  { name: 'Montserrat', value: "'Montserrat', sans-serif" },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Playfair', value: "'Playfair Display', serif" },
  { name: 'Mono', value: "'JetBrains Mono', monospace" },
];

const FONT_SIZES = [
  { name: 'XS', value: '12px' },
  { name: 'SM', value: '14px' },
  { name: 'Base', value: '16px' },
  { name: 'LG', value: '18px' },
  { name: 'XL', value: '20px' },
  { name: '2XL', value: '24px' },
  { name: '3XL', value: '30px' },
  { name: '4XL', value: '36px' },
  { name: '5XL', value: '48px' },
];

const SPACING_VALUES = [
  { name: '0', value: '0' },
  { name: '1', value: '4px' },
  { name: '2', value: '8px' },
  { name: '3', value: '12px' },
  { name: '4', value: '16px' },
  { name: '6', value: '24px' },
  { name: '8', value: '32px' },
  { name: '12', value: '48px' },
  { name: '16', value: '64px' },
];

const PRESET_COLORS = [
  '#000000',
  '#374151',
  '#6B7280',
  '#9CA3AF',
  '#D1D5DB',
  '#FFFFFF',
  '#EF4444',
  '#F97316',
  '#F59E0B',
  '#84CC16',
  '#22C55E',
  '#14B8A6',
  '#06B6D4',
  '#0EA5E9',
  '#3B82F6',
  '#6366F1',
  '#8B5CF6',
  '#A855F7',
  '#D946EF',
  '#EC4899',
  '#F43F5E',
];

export const StylePanel = memo(({ onStyleChange, selectedElement }: StylePanelProps) => {
  const [textColor, setTextColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [fontFamily, setFontFamily] = useState(FONT_FAMILIES[0].value);
  const [fontSize, setFontSize] = useState('16px');
  const [padding, setPadding] = useState('16px');
  const [margin, setMargin] = useState('0');
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'spacing'>('colors');

  const generateCss = useCallback(() => {
    const styles = {
      color: textColor,
      backgroundColor: bgColor,
      fontFamily,
      fontSize,
      padding,
      margin,
    };

    const cssString = Object.entries(styles)
      .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
      .join('; ');

    return cssString;
  }, [textColor, bgColor, fontFamily, fontSize, padding, margin]);

  const handleApplyStyles = () => {
    const css = generateCss();
    onStyleChange(css);
  };

  const ColorPicker = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: string;
    onChange: (color: string) => void;
  }) => (
    <div className="mb-4">
      <label className="block text-xs font-medium text-bolt-elements-textSecondary mb-2">{label}</label>
      <div className="flex items-center gap-2 mb-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg cursor-pointer border border-bolt-elements-borderColor"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-2 py-1.5 text-sm rounded-lg bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor focus:outline-none focus:ring-2 focus:ring-accent-500/50 font-mono"
        />
      </div>
      <div className="grid grid-cols-7 gap-1">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className={classNames(
              'w-6 h-6 rounded-md border transition-transform hover:scale-110',
              value === color ? 'ring-2 ring-accent-500' : 'border-bolt-elements-borderColor',
            )}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-bolt-elements-background-depth-1">
      <div className="p-3 border-b border-bolt-elements-borderColor">
        <h3 className="font-semibold text-sm text-bolt-elements-textPrimary">Style Controls</h3>
        {selectedElement && (
          <p className="text-xs text-bolt-elements-textTertiary mt-1 truncate">Editing: {selectedElement}</p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-bolt-elements-borderColor">
        {(['colors', 'typography', 'spacing'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={classNames(
              'flex-1 px-3 py-2 text-xs font-medium transition-colors',
              activeTab === tab
                ? 'text-accent-500 border-b-2 border-accent-500'
                : 'text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary',
            )}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === 'colors' && (
          <>
            <ColorPicker label="Text Color" value={textColor} onChange={setTextColor} />
            <ColorPicker label="Background Color" value={bgColor} onChange={setBgColor} />
          </>
        )}

        {activeTab === 'typography' && (
          <>
            <div className="mb-4">
              <label className="block text-xs font-medium text-bolt-elements-textSecondary mb-2">Font Family</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor focus:outline-none focus:ring-2 focus:ring-accent-500/50"
              >
                {FONT_FAMILIES.map((font) => (
                  <option key={font.name} value={font.value}>
                    {font.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-bolt-elements-textSecondary mb-2">Font Size</label>
              <div className="grid grid-cols-3 gap-1">
                {FONT_SIZES.map((size) => (
                  <button
                    key={size.name}
                    onClick={() => setFontSize(size.value)}
                    className={classNames(
                      'px-2 py-1.5 text-xs rounded-md transition-colors',
                      fontSize === size.value
                        ? 'bg-accent-500 text-white'
                        : 'bg-bolt-elements-background-depth-2 text-bolt-elements-textSecondary hover:bg-bolt-elements-background-depth-3',
                    )}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'spacing' && (
          <>
            <div className="mb-4">
              <label className="block text-xs font-medium text-bolt-elements-textSecondary mb-2">Padding</label>
              <div className="grid grid-cols-3 gap-1">
                {SPACING_VALUES.map((space) => (
                  <button
                    key={`pad-${space.name}`}
                    onClick={() => setPadding(space.value)}
                    className={classNames(
                      'px-2 py-1.5 text-xs rounded-md transition-colors',
                      padding === space.value
                        ? 'bg-accent-500 text-white'
                        : 'bg-bolt-elements-background-depth-2 text-bolt-elements-textSecondary hover:bg-bolt-elements-background-depth-3',
                    )}
                  >
                    {space.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-bolt-elements-textSecondary mb-2">Margin</label>
              <div className="grid grid-cols-3 gap-1">
                {SPACING_VALUES.map((space) => (
                  <button
                    key={`mar-${space.name}`}
                    onClick={() => setMargin(space.value)}
                    className={classNames(
                      'px-2 py-1.5 text-xs rounded-md transition-colors',
                      margin === space.value
                        ? 'bg-accent-500 text-white'
                        : 'bg-bolt-elements-background-depth-2 text-bolt-elements-textSecondary hover:bg-bolt-elements-background-depth-3',
                    )}
                  >
                    {space.name}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Preview & Apply */}
      <div className="p-3 border-t border-bolt-elements-borderColor">
        <div
          className="mb-3 p-3 rounded-lg text-sm"
          style={{
            color: textColor,
            backgroundColor: bgColor,
            fontFamily,
            fontSize,
          }}
        >
          Preview Text
        </div>
        <button
          onClick={handleApplyStyles}
          className="w-full bg-accent-500 text-white py-2 rounded-lg font-medium text-sm hover:bg-accent-600 transition-colors"
        >
          Apply Styles
        </button>
        <p className="text-xs text-bolt-elements-textTertiary text-center mt-2">Copy generated CSS to clipboard</p>
      </div>
    </div>
  );
});

StylePanel.displayName = 'StylePanel';
