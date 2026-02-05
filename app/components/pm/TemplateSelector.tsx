/**
 * Template Selector Component
 * Displays available templates for user to choose from with preview capability
 */

import { useState } from 'react';
import { templateList, categories, type TemplateId, templates } from '~/templates';
import { Layout, FileText, MousePointer2, Rocket, Briefcase, Store } from 'lucide-react';

interface TemplateSelectorProps {
  onSelect: (templateId: TemplateId) => void;
  onStartBlank?: () => void;
  selectedId?: TemplateId;
}

const templatePreviews: Record<string, string> = {
  'landing-page': '/templates/landing-page.png',
  'sales-page': '/templates/sales-page.png',
};

const templateIcons: Record<string, any> = {
  'landing-page': Layout,
  'sales-page': FileText,
  'lead-magnet': MousePointer2,
  'coming-soon': Rocket,
  'agency-portfolio': Briefcase,
  'local-business': Store,
};

export function TemplateSelector({ onSelect, onStartBlank, selectedId }: TemplateSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateId | null>(null);

  const filteredTemplates = activeCategory ? templateList.filter((t) => t.category === activeCategory) : templateList;

  const handlePreview = (e: React.MouseEvent, templateId: TemplateId) => {
    e.stopPropagation();
    setPreviewTemplate(templateId);
  };

  const closePreview = () => {
    setPreviewTemplate(null);
  };

  const handleSelectFromPreview = () => {
    if (previewTemplate) {
      onSelect(previewTemplate);
      closePreview();
    }
  };

  return (
    <div className="pm-template-selector">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Choose Your Template</h2>
        <p className="text-[#94a3b8]">Select a starting point for your website. We'll customize it with your brand.</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === null ? 'bg-[#3b82f6] text-white' : 'bg-[#132743] text-[#94a3b8] hover:text-white'
            }`}
        >
          All Templates
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === cat.id ? 'bg-[#3b82f6] text-white' : 'bg-[#132743] text-[#94a3b8] hover:text-white'
              }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Start Blank Option */}
      {onStartBlank && (
        <div className="mb-6">
          <button
            onClick={onStartBlank}
            className="w-full p-4 border-2 border-dashed border-[#1e3a5f] rounded-xl hover:border-[#3b82f6] transition-colors group"
          >
            <div className="flex items-center justify-center gap-3 text-[#94a3b8] group-hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-medium">Start from Scratch</span>
            </div>
            <p className="text-sm text-[#64748b] mt-1">Build your page from a blank canvas</p>
          </button>
        </div>
      )}

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            onClick={() => onSelect(template.id as TemplateId)}
            className={`pm-template-card relative cursor-pointer group ${selectedId === template.id ? 'ring-2 ring-[#3b82f6]' : ''}`}
          >
            {/* Preview Image */}
            <div className="preview bg-[#0d1f35] aspect-video relative overflow-hidden flex items-center justify-center">
              {templatePreviews[template.id] ? (
                <img
                  src={templatePreviews[template.id]}
                  alt={template.name}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                />
              ) : (
                <div className="absolute inset-0 p-4 bg-gradient-to-br from-[#132743] to-[#0a1628]">
                  <TemplatePreviewIllustration templateId={template.id as TemplateId} />
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-[#0a1628]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={(e) => handlePreview(e, template.id as TemplateId)}
                  className="px-4 py-2 bg-[#132743] text-white rounded-lg text-sm font-medium hover:bg-[#1e3a5f] transition-colors"
                >
                  Preview
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(template.id as TemplateId);
                  }}
                  className="px-4 py-2 bg-[#3b82f6] text-white rounded-lg text-sm font-medium hover:bg-[#2563eb] transition-colors"
                >
                  Use Template
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="text-white font-semibold mb-1">{template.name}</h3>
              <p className="text-[#94a3b8] text-sm line-clamp-2">{template.description}</p>

              {/* Section count and category */}
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
          </div>
        ))}
      </div>

      {/* Continue Button */}
      {selectedId && (
        <div className="mt-6 flex justify-end">
          <button onClick={() => onSelect(selectedId)} className="pm-button-primary flex items-center gap-2">
            Continue with {templates[selectedId]?.name}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Preview Modal */}
      {previewTemplate && (
        <TemplatePreviewModal templateId={previewTemplate} onClose={closePreview} onSelect={handleSelectFromPreview} />
      )}
    </div>
  );
}

/**
 * Template Preview Illustration
 * Shows a simple visual representation of the template structure
 */
function TemplatePreviewIllustration({ templateId }: { templateId: TemplateId }) {
  const template = templates[templateId];
  const Icon = templateIcons[templateId] || Layout;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
      <div className="absolute top-2 left-2 right-2 bottom-12 border border-[#1e3a5f]/50 border-dashed rounded flex flex-col gap-1 p-2">
        <div className="h-4 w-1/3 bg-[#3b82f6]/20 rounded-sm" />
        <div className="h-2 w-2/3 bg-[#1e3a5f] rounded-sm" />
        <div className="flex gap-1 flex-1">
          <div className="flex-[2] bg-[#132743] rounded-sm border border-[#1e3a5f]/30" />
          <div className="flex-1 bg-[#132743] rounded-sm border border-[#1e3a5f]/30" />
        </div>
      </div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[#3b82f6]/50">
        <Icon size={24} strokeWidth={1.5} />
        <span className="text-[10px] uppercase tracking-wider font-semibold opacity-50">Wireframe Preview</span>
      </div>
    </div>
  );
}

/**
 * Template Preview Modal
 * Shows detailed preview of a template before selection
 */
function TemplatePreviewModal({
  templateId,
  onClose,
  onSelect,
}: {
  templateId: TemplateId;
  onClose: () => void;
  onSelect: () => void;
}) {
  const template = templates[templateId];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={onClose}>
      <div
        className="bg-[#0a1628] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1e3a5f]">
          <div>
            <h3 className="text-xl font-bold text-white">{template.name}</h3>
            <p className="text-[#94a3b8] mt-1">{template.description}</p>
          </div>
          <button onClick={onClose} className="text-[#94a3b8] hover:text-white p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Preview Area */}
          <div className="bg-gradient-to-br from-[#132743] to-[#0d1f35] rounded-xl p-6 mb-6">
            <div className="aspect-video bg-[#0a1628] rounded-lg overflow-hidden">
              <div className="w-full h-full p-4">
                <TemplatePreviewIllustration templateId={templateId} />
              </div>
            </div>
          </div>

          {/* Sections List */}
          <div>
            <h4 className="text-white font-semibold mb-4">Included Sections ({template.sections.length})</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {template.sections.map((section) => (
                <div key={section.id} className="bg-[#132743] rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium text-sm">{section.name}</span>
                    {section.required && (
                      <span className="text-[10px] bg-[#3b82f6]/20 text-[#3b82f6] px-1.5 py-0.5 rounded">Required</span>
                    )}
                  </div>
                  <p className="text-[#64748b] text-xs">{section.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Category Badge */}
          <div className="mt-6 flex items-center gap-2">
            <span className="text-[#94a3b8] text-sm">Category:</span>
            <span className="bg-[#1e3a5f] text-white px-3 py-1 rounded-full text-sm capitalize">
              {template.category}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[#1e3a5f]">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-[#94a3b8] hover:text-white transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onSelect}
            className="px-6 py-2.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            Use This Template
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TemplateSelector;
