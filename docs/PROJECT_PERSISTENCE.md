# Project Persistence in Pocket Marketer

This document explains how Pocket Marketer stores, saves, and allows recovery of your projects.

## Overview

Pocket Marketer uses **browser-based storage (IndexedDB)** to persist your projects locally. This means:
- ✅ Your data stays on your device
- ✅ No server account required
- ⚠️ Data is tied to your browser/device
- ⚠️ Clearing browser data will delete projects

## Where Data is Stored

### IndexedDB Database
- **Database Name:** `boltHistory`
- **Version:** 2
- **Object Stores:**
  - `chats` - Stores chat sessions with messages
  - `snapshots` - Stores file snapshots for each chat

### What's Saved
For each project/chat:
- **Chat ID** - Unique identifier
- **URL ID** - Used for navigation (`/chat/{urlId}`)
- **Description** - Project title (auto-generated from first artifact)
- **Messages** - Full conversation history
- **Timestamp** - Last update time
- **Metadata** - Git URL, branch, deployment info
- **Snapshot** - Current state of all files in the project

## Auto-Save Behavior

Projects are automatically saved when:
1. You send a message
2. The AI responds with changes
3. Files are modified in the workbench

### Save Status Indicator
Look for the cloud icon next to your project name in the header:
- ☁️ **Gray** - All changes saved
- ☁️ **Blue (pulsing)** - Saving in progress
- ☁️ **Green** - Just saved
- ☁️ **Red** - Save failed (check browser storage)

## How to Backup Your Projects

### Export All Chats
1. Open the sidebar (hover on the left edge)
2. Click the **Settings** gear icon
3. Go to **Data** tab
4. Click **Export All Chats**
5. Save the JSON file somewhere safe

### Export Individual Chat
1. Open the chat you want to export
2. Click the **Export** dropdown in the chat header
3. Select **Export Chat**
4. Save the JSON file

### Export Code Only
1. Open the chat with the project
2. Click the **Export** dropdown
3. Select **Download Code**
4. Get a ZIP file of all project files

## How to Restore Projects

### Import from Backup File
1. On the home page, click **Import Chat**
2. Select your backup JSON file
3. The project will be restored and opened

### Import from Settings
1. Open Settings → Data tab
2. Click **Import Chats**
3. Select your backup JSON file

## Troubleshooting

### "Chat persistence is unavailable"
This error means IndexedDB is not working. Possible causes:
- Private/Incognito browsing mode
- Browser storage is full
- Browser doesn't support IndexedDB

**Solutions:**
- Switch to normal browsing mode
- Clear some browser data
- Try a different browser (Chrome, Firefox, Edge)

### Projects disappeared after browser update
Browser updates can sometimes reset IndexedDB. Always keep backups!

**Prevention:**
- Export your projects regularly
- Use the "Export All Chats" feature before major updates

### Data won't save
If the save indicator shows red:
1. Check available browser storage
2. Try refreshing the page
3. Export what you can and clear old projects

## Storage Limits

IndexedDB storage limits vary by browser:
- **Chrome:** ~80% of available disk space
- **Firefox:** ~50% of available disk space
- **Safari:** ~1GB default, can request more

## Best Practices

1. **Regular Backups** - Export your projects weekly
2. **Use Git** - Connect projects to GitHub for version control
3. **Don't rely solely on browser storage** - Export important projects
4. **Clear old projects** - Delete unused chats to free space

## Technical Details

### File Locations (in codebase)
- `app/lib/persistence/db.ts` - Database operations
- `app/lib/persistence/useChatHistory.ts` - React hook for persistence
- `app/lib/persistence/chats.ts` - Chat CRUD operations
- `app/components/ui/AutoSaveIndicator.tsx` - Save status UI

### Data Schema

```typescript
// Chat record
interface ChatHistoryItem {
  id: string;           // Internal ID
  urlId: string;        // URL-friendly ID
  description: string;  // Project title
  messages: Message[];  // Conversation history
  timestamp: string;    // ISO timestamp
  metadata?: {
    gitUrl?: string;
    gitBranch?: string;
    netlifySiteId?: string;
  };
}

// Snapshot record
interface Snapshot {
  chatIndex: string;    // Last message ID
  files: FileMap;       // All project files
  summary?: string;     // Chat summary
}
```

## Getting Help

If you're experiencing data loss or persistence issues:
1. Check the browser console for errors
2. Try exporting any recoverable data
3. Contact support with details about your browser and error messages
