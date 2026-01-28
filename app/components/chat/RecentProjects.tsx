import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { classNames } from '~/utils/classNames';
import { db, type ChatHistoryItem } from '~/lib/persistence';
import { getAll } from '~/lib/persistence/db';

interface RecentProjectsProps {
  className?: string;
  maxProjects?: number;
}

export function RecentProjects({ className, maxProjects = 4 }: RecentProjectsProps) {
  const [projects, setProjects] = useState<ChatHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setIsLoading(false);
      return;
    }

    getAll(db)
      .then((chats) => {
        // Filter valid chats and sort by most recent
        const validChats = chats
          .filter((chat) => chat.urlId && chat.description)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, maxProjects);
        setProjects(validChats);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [maxProjects]);

  if (isLoading) {
    return (
      <div className={classNames('w-full max-w-3xl mx-auto px-4', className)}>
        <div className="animate-pulse flex gap-3 overflow-x-auto pb-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-shrink-0 w-48 h-20 bg-gray-200 dark:bg-gray-800 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return null;
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className={classNames('w-full max-w-3xl mx-auto px-4', className)}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
          <span className="i-ph:clock-counter-clockwise w-4 h-4" />
          Recent Projects
        </h3>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            // Trigger sidebar open by simulating mouse movement to the left edge
            const event = new MouseEvent('mousemove', {
              clientX: 0,
              pageX: 0,
              bubbles: true,
            });
            window.dispatchEvent(event);
          }}
          className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          View all →
        </a>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        {projects.map((project, index) => (
          <motion.a
            key={project.id}
            href={`/chat/${project.urlId}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={classNames(
              'flex-shrink-0 w-52 p-3 rounded-lg border transition-all duration-200',
              'bg-white dark:bg-gray-900',
              'border-gray-200 dark:border-gray-800',
              'hover:border-blue-300 dark:hover:border-blue-700',
              'hover:shadow-md dark:hover:shadow-blue-900/20',
              'group cursor-pointer',
            )}
          >
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 w-8 h-8 rounded-md bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="i-ph:chat-circle-text text-white w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {project.description}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">{formatDate(project.timestamp)}</p>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-600">
              <span className="i-ph:chat w-3 h-3" />
              <span>{project.messages.length} messages</span>
            </div>
          </motion.a>
        ))}
      </div>

      {/* Info banner about data persistence */}
      <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50">
        <div className="flex items-start gap-2">
          <span className="i-ph:info text-blue-500 dark:text-blue-400 w-4 h-4 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-blue-700 dark:text-blue-300">
            <p className="font-medium">Your projects are saved locally</p>
            <p className="mt-0.5 text-blue-600 dark:text-blue-400">
              Data is stored in your browser. To backup your work, use{' '}
              <button
                onClick={() => {
                  // Open sidebar and navigate to settings
                  const event = new MouseEvent('mousemove', {
                    clientX: 0,
                    pageX: 0,
                    bubbles: true,
                  });
                  window.dispatchEvent(event);
                }}
                className="underline hover:no-underline"
              >
                Settings → Data → Export
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
