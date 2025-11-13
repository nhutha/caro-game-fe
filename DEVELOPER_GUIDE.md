# Caro Game Frontend - Developer Guide

## Quick Start

### Project Structure
```
src/
├── types/              # TypeScript interfaces
├── hooks/              # Custom React hooks
├── components/         # React components
│   ├── ui/            # Reusable UI components
│   ├── game/          # Game-specific components
│   └── modals/        # Modal dialogs
├── utils/             # Utility functions
├── contexts/          # React Context
├── lib/               # External integrations
└── app/               # Next.js app directory
```

## Available Components

### UI Components
- **Navbar** (`@/components/ui/Navbar.tsx`)
  - Props: `username`, `isAuthenticated`, `onLogout`
  - Use on every page for consistent navigation

- **LoadingSpinner** (`@/components/ui/LoadingSpinner.tsx`)
  - Props: None (uses default styling)
  - Use for loading states

### Game Components
- **GameBoard** (`@/components/game/GameBoard.tsx`)
  - Props: `boardState`, `isCurrentUserTurn`, `onCellClick`
  - Renders 15x15 grid

- **PlayerInfo** (`@/components/game/PlayerInfo.tsx`)
  - Props: `player`, `isCurrentTurn`, `isCurrentPlayer`
  - Shows player details and turn status

### Modal Components
- **CreateRoomModal** (`@/components/modals/CreateRoomModal.tsx`)
  - Props: `isOpen`, `roomName`, `isLoading`, `onRoomNameChange`, `onCreateRoom`, `onClose`
  - Handles room creation

## Custom Hooks

### useBodyOverflow
Manages body scroll prevention when modals are open:
```tsx
import { useBodyOverflow } from '@/hooks/useBodyOverflow';

const [showModal, setShowModal] = useState(false);
useBodyOverflow(showModal); // Disables scroll when true
```

## Utility Functions

### gameUtils
```tsx
import { 
  createMockOpponent, 
  initializeGameState, 
  checkWinner 
} from '@/utils/gameUtils';

// Create mock opponent for testing
const opponent = createMockOpponent();

// Initialize 15x15 board state
const board = initializeGameState();

// Check for winner
const winner = checkWinner(boardState, symbol);
```

## Type Definitions

All types are in `@/types`:
```tsx
import { 
  User, 
  GamePlayer, 
  Room, 
  CreateRoomResponse, 
  CreateRoomInput 
} from '@/types';
```

## Absolute Imports

Always use absolute imports (@/) instead of relative paths:

❌ **Don't:**
```tsx
import { Navbar } from '../../../components/ui/Navbar';
```

✅ **Do:**
```tsx
import { Navbar } from '@/components/ui/Navbar';
```

## Authentication Context

```tsx
import { useAuth } from '@/contexts/AuthContext';

const { isAuthenticated, user, login, logout, isLoading } = useAuth();
```

## GraphQL & Apollo

```tsx
import { useMutation } from '@apollo/client/react';
import { CREATE_ROOM } from '@/lib/graphql/mutations';

const [createRoom, { loading }] = useMutation(CREATE_ROOM);
```

## ActionCable Integration

```tsx
import createCableConsumer from '@/lib/actioncable';

const cable = createCableConsumer();
const subscription = cable.subscriptions.create(
  { channel: 'GraphqlChannel', room_id: roomId },
  {
    received(data) { /* Handle updates */ },
    connected() { /* Handle connection */ }
  }
);
```

## Styling Guidelines

### Tailwind CSS Classes
All components use Tailwind CSS for styling:
- Supports dark mode with `dark:` prefix
- Responsive design with `sm:`, `md:`, `lg:` breakpoints
- Hover states with `hover:` prefix

### CSS Animations
Pre-defined animations in `globals.css`:
- `animate-fadeIn` - 300ms fade-in
- `animate-slideUp` - 300ms slide-up

Usage:
```tsx
<div className="animate-fadeIn">Fading in...</div>
<div className="animate-slideUp">Sliding up...</div>
```

## Common Patterns

### Creating a New Page
1. Create file in `src/app/[page]/page.tsx`
2. Import Navbar component
3. Wrap with main div with gradient background
4. Import and use other components as needed

Example:
```tsx
'use client';

import { Navbar } from '@/components/ui/Navbar';
import { useAuth } from '@/contexts/AuthContext';

export default function NewPage() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar 
        username={user?.username}
        isAuthenticated={isAuthenticated}
        onLogout={logout}
      />
      <main className="max-w-7xl mx-auto py-12 px-4">
        {/* Your content here */}
      </main>
    </div>
  );
}
```

### Creating a New Component
1. Create file in appropriate subfolder
2. Use TypeScript with proper interfaces
3. Export as default
4. Use Tailwind for styling
5. Support dark mode

Example:
```tsx
interface MyComponentProps {
  title: string;
  isActive?: boolean;
}

export default function MyComponent({ title, isActive }: MyComponentProps) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
      <h2 className="text-gray-900 dark:text-white">{title}</h2>
    </div>
  );
}
```

## Testing Checklist

- [ ] Component renders without errors
- [ ] TypeScript types are correct
- [ ] Imports use absolute paths (@/)
- [ ] Dark mode styling is applied
- [ ] Responsive on mobile/tablet/desktop
- [ ] Accessibility attributes present
- [ ] Error handling implemented
- [ ] Loading states handled

## Common Issues & Solutions

### Import Path Errors
**Problem:** `Cannot find module '@/...'`
**Solution:** Check tsconfig.json path aliases and file existence

### Dark Mode Not Working
**Problem:** `dark:` classes don't apply
**Solution:** Ensure `dark:` class is on parent container

### Component Not Re-rendering
**Problem:** State changes don't trigger UI update
**Solution:** Check useState initialization and proper dependency arrays

### Type Errors in GraphQL
**Problem:** TypeScript errors in mutations/queries
**Solution:** Define response types with interfaces, extend CreateRoomResponse pattern

## Performance Tips

1. **Use LoadingSpinner** for async operations
2. **Implement proper error boundaries**
3. **Lazy load heavy components**
4. **Memoize expensive computations**
5. **Optimize re-renders with useCallback**

## Deployment Checklist

- [ ] All imports use absolute paths
- [ ] No TypeScript errors
- [ ] No console errors/warnings
- [ ] Dark mode works
- [ ] Responsive design verified
- [ ] Auth flows tested
- [ ] API endpoints configured
- [ ] Environment variables set

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Apollo Client Documentation](https://www.apollographql.com/docs)

## Getting Help

1. Check this guide first
2. Review existing components for patterns
3. Check TypeScript errors in VS Code
4. Review REFACTORING_SUMMARY.md for overview
5. Check component JSDoc comments

---

**Last Updated:** November 14, 2025
**Refactoring Version:** 1.0
