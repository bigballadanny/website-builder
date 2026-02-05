import { memo, useState } from 'react';
import { classNames } from '~/utils/classNames';

interface ComponentItem {
  id: string;
  name: string;
  icon: string;
  category: string;
  html: string;
  description?: string;
}

const COMPONENT_LIBRARY: ComponentItem[] = [
  // Layout
  {
    id: 'hero-centered',
    name: 'Hero - Centered',
    icon: '🎯',
    category: 'Layout',
    description: 'Centered hero with headline and CTA',
    html: `<section class="py-20 px-4 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
  <div class="max-w-4xl mx-auto text-center">
    <h1 class="text-5xl font-bold mb-6">Your Headline Here</h1>
    <p class="text-xl mb-8 opacity-90">A compelling subheadline that explains your value proposition.</p>
    <button class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition">Get Started</button>
  </div>
</section>`,
  },
  {
    id: 'hero-split',
    name: 'Hero - Split',
    icon: '◧',
    category: 'Layout',
    description: 'Two-column hero with image',
    html: `<section class="py-20 px-4">
  <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
    <div>
      <h1 class="text-4xl font-bold mb-4">Transform Your Business</h1>
      <p class="text-lg text-gray-600 mb-6">Streamline operations and boost productivity with our solution.</p>
      <div class="flex gap-4">
        <button class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">Start Free</button>
        <button class="border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50">Learn More</button>
      </div>
    </div>
    <div class="bg-gray-200 rounded-xl h-80 flex items-center justify-center">
      <span class="text-gray-400">Image Placeholder</span>
    </div>
  </div>
</section>`,
  },

  // Features
  {
    id: 'features-grid',
    name: 'Features Grid',
    icon: '⊞',
    category: 'Features',
    description: '3-column feature cards',
    html: `<section class="py-16 px-4 bg-gray-50">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
    <div class="grid md:grid-cols-3 gap-8">
      <div class="bg-white p-6 rounded-xl shadow-sm">
        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
          <span class="text-2xl">⚡</span>
        </div>
        <h3 class="text-xl font-semibold mb-2">Lightning Fast</h3>
        <p class="text-gray-600">Built for speed and performance from the ground up.</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm">
        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
          <span class="text-2xl">🔒</span>
        </div>
        <h3 class="text-xl font-semibold mb-2">Secure</h3>
        <p class="text-gray-600">Enterprise-grade security you can trust.</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm">
        <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
          <span class="text-2xl">🎨</span>
        </div>
        <h3 class="text-xl font-semibold mb-2">Beautiful</h3>
        <p class="text-gray-600">Stunning designs that convert visitors to customers.</p>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: 'features-list',
    name: 'Features List',
    icon: '☰',
    category: 'Features',
    description: 'Alternating feature rows',
    html: `<section class="py-16 px-4">
  <div class="max-w-5xl mx-auto space-y-16">
    <div class="flex flex-col md:flex-row gap-8 items-center">
      <div class="flex-1">
        <h3 class="text-2xl font-bold mb-4">Powerful Analytics</h3>
        <p class="text-gray-600 mb-4">Track every metric that matters with our comprehensive dashboard.</p>
        <ul class="space-y-2 text-gray-600">
          <li class="flex items-center gap-2"><span class="text-green-500">✓</span> Real-time data</li>
          <li class="flex items-center gap-2"><span class="text-green-500">✓</span> Custom reports</li>
          <li class="flex items-center gap-2"><span class="text-green-500">✓</span> Export options</li>
        </ul>
      </div>
      <div class="flex-1 bg-gray-200 rounded-xl h-64 flex items-center justify-center">
        <span class="text-gray-400">Screenshot</span>
      </div>
    </div>
  </div>
</section>`,
  },

  // Social Proof
  {
    id: 'testimonials',
    name: 'Testimonials',
    icon: '💬',
    category: 'Social Proof',
    description: 'Customer testimonial cards',
    html: `<section class="py-16 px-4 bg-gray-50">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div class="bg-white p-6 rounded-xl shadow-sm">
        <div class="flex items-center gap-1 text-yellow-400 mb-4">★★★★★</div>
        <p class="text-gray-600 mb-4">"This product changed our business completely. Highly recommend!"</p>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gray-300 rounded-full"></div>
          <div>
            <p class="font-semibold">Sarah Johnson</p>
            <p class="text-sm text-gray-500">CEO, TechCorp</p>
          </div>
        </div>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm">
        <div class="flex items-center gap-1 text-yellow-400 mb-4">★★★★★</div>
        <p class="text-gray-600 mb-4">"The best investment we've made this year. Amazing support team."</p>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gray-300 rounded-full"></div>
          <div>
            <p class="font-semibold">Mike Chen</p>
            <p class="text-sm text-gray-500">Founder, StartupXYZ</p>
          </div>
        </div>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm">
        <div class="flex items-center gap-1 text-yellow-400 mb-4">★★★★★</div>
        <p class="text-gray-600 mb-4">"Simple to use, powerful features. Exactly what we needed."</p>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gray-300 rounded-full"></div>
          <div>
            <p class="font-semibold">Emily Davis</p>
            <p class="text-sm text-gray-500">Marketing Director</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: 'logos',
    name: 'Logo Cloud',
    icon: '🏢',
    category: 'Social Proof',
    description: 'Trusted by logos',
    html: `<section class="py-12 px-4 border-y border-gray-200">
  <div class="max-w-6xl mx-auto">
    <p class="text-center text-gray-500 mb-8">Trusted by leading companies</p>
    <div class="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
      <div class="h-8 w-24 bg-gray-300 rounded"></div>
      <div class="h-8 w-24 bg-gray-300 rounded"></div>
      <div class="h-8 w-24 bg-gray-300 rounded"></div>
      <div class="h-8 w-24 bg-gray-300 rounded"></div>
      <div class="h-8 w-24 bg-gray-300 rounded"></div>
    </div>
  </div>
</section>`,
  },

  // CTA
  {
    id: 'cta-simple',
    name: 'CTA - Simple',
    icon: '📢',
    category: 'CTA',
    description: 'Simple call-to-action banner',
    html: `<section class="py-16 px-4 bg-blue-600 text-white">
  <div class="max-w-4xl mx-auto text-center">
    <h2 class="text-3xl font-bold mb-4">Ready to Get Started?</h2>
    <p class="text-lg opacity-90 mb-8">Join thousands of satisfied customers today.</p>
    <button class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition">Start Free Trial</button>
  </div>
</section>`,
  },
  {
    id: 'cta-with-form',
    name: 'CTA - With Form',
    icon: '📝',
    category: 'CTA',
    description: 'CTA with email signup',
    html: `<section class="py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
  <div class="max-w-2xl mx-auto text-center">
    <h2 class="text-3xl font-bold mb-4">Stay Updated</h2>
    <p class="text-lg opacity-90 mb-8">Get the latest news and updates delivered to your inbox.</p>
    <form class="flex flex-col sm:flex-row gap-4 justify-center">
      <input type="email" placeholder="Enter your email" class="px-4 py-3 rounded-lg text-gray-900 w-full sm:w-80" />
      <button class="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition whitespace-nowrap">Subscribe</button>
    </form>
  </div>
</section>`,
  },

  // Pricing
  {
    id: 'pricing',
    name: 'Pricing Table',
    icon: '💰',
    category: 'Pricing',
    description: '3-tier pricing cards',
    html: `<section class="py-16 px-4">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-3xl font-bold text-center mb-4">Simple Pricing</h2>
    <p class="text-gray-600 text-center mb-12">Choose the plan that works for you</p>
    <div class="grid md:grid-cols-3 gap-8">
      <div class="border rounded-xl p-6">
        <h3 class="text-xl font-semibold mb-2">Starter</h3>
        <p class="text-gray-600 mb-4">For individuals</p>
        <p class="text-4xl font-bold mb-6">$9<span class="text-lg font-normal text-gray-500">/mo</span></p>
        <ul class="space-y-3 mb-8 text-gray-600">
          <li class="flex items-center gap-2">✓ 5 projects</li>
          <li class="flex items-center gap-2">✓ Basic support</li>
          <li class="flex items-center gap-2">✓ 1GB storage</li>
        </ul>
        <button class="w-full border border-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-50">Get Started</button>
      </div>
      <div class="border-2 border-blue-600 rounded-xl p-6 relative">
        <span class="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">Popular</span>
        <h3 class="text-xl font-semibold mb-2">Pro</h3>
        <p class="text-gray-600 mb-4">For teams</p>
        <p class="text-4xl font-bold mb-6">$29<span class="text-lg font-normal text-gray-500">/mo</span></p>
        <ul class="space-y-3 mb-8 text-gray-600">
          <li class="flex items-center gap-2">✓ Unlimited projects</li>
          <li class="flex items-center gap-2">✓ Priority support</li>
          <li class="flex items-center gap-2">✓ 10GB storage</li>
          <li class="flex items-center gap-2">✓ Analytics</li>
        </ul>
        <button class="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700">Get Started</button>
      </div>
      <div class="border rounded-xl p-6">
        <h3 class="text-xl font-semibold mb-2">Enterprise</h3>
        <p class="text-gray-600 mb-4">For large orgs</p>
        <p class="text-4xl font-bold mb-6">$99<span class="text-lg font-normal text-gray-500">/mo</span></p>
        <ul class="space-y-3 mb-8 text-gray-600">
          <li class="flex items-center gap-2">✓ Everything in Pro</li>
          <li class="flex items-center gap-2">✓ Dedicated support</li>
          <li class="flex items-center gap-2">✓ 100GB storage</li>
          <li class="flex items-center gap-2">✓ Custom integrations</li>
        </ul>
        <button class="w-full border border-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-50">Contact Sales</button>
      </div>
    </div>
  </div>
</section>`,
  },

  // Footer
  {
    id: 'footer',
    name: 'Footer',
    icon: '📋',
    category: 'Navigation',
    description: 'Multi-column footer',
    html: `<footer class="py-12 px-4 bg-gray-900 text-gray-400">
  <div class="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
    <div>
      <h4 class="text-white font-semibold mb-4">Company</h4>
      <ul class="space-y-2">
        <li><a href="#" class="hover:text-white">About</a></li>
        <li><a href="#" class="hover:text-white">Careers</a></li>
        <li><a href="#" class="hover:text-white">Blog</a></li>
      </ul>
    </div>
    <div>
      <h4 class="text-white font-semibold mb-4">Product</h4>
      <ul class="space-y-2">
        <li><a href="#" class="hover:text-white">Features</a></li>
        <li><a href="#" class="hover:text-white">Pricing</a></li>
        <li><a href="#" class="hover:text-white">Docs</a></li>
      </ul>
    </div>
    <div>
      <h4 class="text-white font-semibold mb-4">Support</h4>
      <ul class="space-y-2">
        <li><a href="#" class="hover:text-white">Help Center</a></li>
        <li><a href="#" class="hover:text-white">Contact</a></li>
        <li><a href="#" class="hover:text-white">Status</a></li>
      </ul>
    </div>
    <div>
      <h4 class="text-white font-semibold mb-4">Legal</h4>
      <ul class="space-y-2">
        <li><a href="#" class="hover:text-white">Privacy</a></li>
        <li><a href="#" class="hover:text-white">Terms</a></li>
      </ul>
    </div>
  </div>
  <div class="max-w-6xl mx-auto border-t border-gray-800 mt-8 pt-8 text-center">
    <p>© 2024 Your Company. All rights reserved.</p>
  </div>
</footer>`,
  },
];

const CATEGORIES = [...new Set(COMPONENT_LIBRARY.map((c) => c.category))];

interface ComponentPaletteProps {
  onInsert: (html: string, componentName: string) => void;
}

export const ComponentPalette = memo(({ onInsert }: ComponentPaletteProps) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredComponents = COMPONENT_LIBRARY.filter((c) => {
    const matchesCategory = activeCategory === 'All' || c.category === activeCategory;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleDragStart = (e: React.DragEvent, component: ComponentItem) => {
    e.dataTransfer.setData('text/html', component.html);
    e.dataTransfer.setData('text/plain', component.name);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="h-full flex flex-col bg-bolt-elements-background-depth-1">
      <div className="p-3 border-b border-bolt-elements-borderColor">
        <h3 className="font-semibold text-sm mb-2 text-bolt-elements-textPrimary">Components</h3>
        <input
          type="text"
          placeholder="Search components..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-1.5 text-sm rounded-lg bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor focus:outline-none focus:ring-2 focus:ring-accent-500/50"
        />
      </div>

      <div className="flex gap-1 p-2 overflow-x-auto border-b border-bolt-elements-borderColor">
        <button
          onClick={() => setActiveCategory('All')}
          className={classNames(
            'px-2 py-1 text-xs rounded-md whitespace-nowrap transition-colors',
            activeCategory === 'All'
              ? 'bg-accent-500 text-white'
              : 'bg-bolt-elements-background-depth-2 text-bolt-elements-textSecondary hover:bg-bolt-elements-background-depth-3',
          )}
        >
          All
        </button>
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={classNames(
              'px-2 py-1 text-xs rounded-md whitespace-nowrap transition-colors',
              activeCategory === category
                ? 'bg-accent-500 text-white'
                : 'bg-bolt-elements-background-depth-2 text-bolt-elements-textSecondary hover:bg-bolt-elements-background-depth-3',
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-1 gap-2">
          {filteredComponents.map((component) => (
            <div
              key={component.id}
              draggable
              onDragStart={(e) => handleDragStart(e, component)}
              onClick={() => onInsert(component.html, component.name)}
              className="p-3 rounded-lg bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor hover:border-accent-500 cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{component.icon}</span>
                <span className="font-medium text-sm text-bolt-elements-textPrimary group-hover:text-accent-500 transition-colors">
                  {component.name}
                </span>
              </div>
              {component.description && (
                <p className="text-xs text-bolt-elements-textTertiary">{component.description}</p>
              )}
            </div>
          ))}
        </div>

        {filteredComponents.length === 0 && (
          <div className="text-center py-8 text-bolt-elements-textTertiary">
            <p className="text-sm">No components found</p>
          </div>
        )}
      </div>

      <div className="p-2 border-t border-bolt-elements-borderColor">
        <p className="text-xs text-bolt-elements-textTertiary text-center">Click or drag to insert</p>
      </div>
    </div>
  );
});

ComponentPalette.displayName = 'ComponentPalette';
