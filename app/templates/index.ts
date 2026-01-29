/**
 * Template Registry
 * All available website templates for Pocket Marketer
 */

import landingPage from './landing-page/template';
import salesPage from './sales-page/template';
import leadMagnet from './lead-magnet/template';
import comingSoon from './coming-soon/template';
import agencyPortfolio from './agency-portfolio/template';
import localBusiness from './local-business/template';

export const templates = {
  'landing-page': landingPage,
  'sales-page': salesPage,
  'lead-magnet': leadMagnet,
  'coming-soon': comingSoon,
  'agency-portfolio': agencyPortfolio,
  'local-business': localBusiness,
} as const;

export type TemplateId = keyof typeof templates;

export const templateList = Object.values(templates);

/**
 * Get template by ID
 */
export function getTemplate(id: TemplateId) {
  return templates[id];
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: string) {
  return templateList.filter((t) => t.category === category);
}

/**
 * Categories for organizing templates
 */
export const categories = [
  { id: 'lead-gen', name: 'Lead Generation', description: 'Capture emails and leads' },
  { id: 'sales', name: 'Sales Pages', description: 'Sell products and services' },
  { id: 'launch', name: 'Launch', description: 'Pre-launch and announcements' },
  { id: 'portfolio', name: 'Portfolio', description: 'Showcase your work' },
  { id: 'local', name: 'Local Business', description: 'Attract nearby customers' },
] as const;

export type CategoryId = (typeof categories)[number]['id'];

export { landingPage, salesPage, leadMagnet, comingSoon, agencyPortfolio, localBusiness };
