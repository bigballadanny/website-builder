/**
 * Template Selector Component
 * Displays available templates for user to choose from
 */

import { useState } from 'react';
import { templateList, categories, type TemplateId } from '~/templates';

interface TemplateSelectorProps {
  onSelect: (templateId: TemplateId) => void;
  selectedId?: TemplateId;
}

export function TemplateSelector({ onSelect, selectedId }: TemplateSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredTemplates = activeCategory ? templateList.filter((t) => t.category === activeCategory) : templateList;

  return (
    <div className="pm-template-selector">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Choose Your Template</h2>
        <p className="text-[#94a3b8]">Select a starting point for your website. We'll customize it with your brand.</p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeCategory === null ? 'bg-[#3b82f6] text-white' : 'bg-[#132743] text-[#94a3b8] hover:text-white'
          }`}
        >
          All Templates
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === cat.id ? 'bg-[#3b82f6] text-white' : 'bg-[#132743] text-[#94a3b8] hover:text-white'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template.id as TemplateId)}
            className={`pm-template-card text-left ${selectedId === template.id ? 'selected' : ''}`}
          >
            {/* Preview Image */}
            <div className="preview bg-[#0d1f35] aspect-video flex items-center justify-center">
              <div className="text-[#64748b] text-sm">
                {/* Placeholder - will be replaced with actual preview */}
                <svg
                  className="w-12 h-12 mx-auto mb-2 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                  />
                </svg>
                Preview
              </div>
            </div>

            {/* Info */}
            <div className="info p-4">
              <h3 className="text-white font-semibold mb-1">{template.name}</h3>
              <p className="text-[#94a3b8] text-sm">{template.description}</p>

              {/* Section count */}
              <div className="mt-3 flex items-center gap-2 text-xs text-[#64748b]">
                <span className="bg-[#1e3a5f] px-2 py-1 rounded">{template.sections.length} sections</span>
                <span className="bg-[#1e3a5f] px-2 py-1 rounded capitalize">{template.category}</span>
              </div>
            </div>

            {/* Selected indicator */}
            {selectedId === template.id && (
              <div className="absolute top-3 right-3 bg-[#3b82f6] text-white p-1 rounded-full">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Continue Button */}
      {selectedId && (
        <div className="mt-6 flex justify-end">
          <button className="pm-button-primary flex items-center gap-2">
            Continue with {templates[selectedId]?.name}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

// Need to import templates for the continue button
import { templates } from '~/templates';
