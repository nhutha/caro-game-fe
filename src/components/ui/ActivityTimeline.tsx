'use client';

import { Clock, Award, Trophy, Flame } from 'lucide-react';

interface Activity {
  id: string;
  type: 'win' | 'loss' | 'achievement' | 'milestone';
  title: string;
  description: string;
  timestamp: string;
  icon?: React.ReactNode;
}

interface ActivityTimelineProps {
  activities?: Activity[];
  isLoading?: boolean;
}

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: '1',
    type: 'win',
    title: 'Victory Streak!',
    description: 'Won 5 games in a row',
    timestamp: '2 hours ago',
    icon: <Trophy className="w-5 h-5 text-yellow-500" />,
  },
  {
    id: '2',
    type: 'achievement',
    title: 'Rising Star',
    description: 'Reached rating 2500',
    timestamp: '1 day ago',
    icon: <Award className="w-5 h-5 text-purple-500" />,
  },
  {
    id: '3',
    type: 'win',
    title: 'Ranked Up',
    description: 'Promoted to Diamond tier',
    timestamp: '3 days ago',
    icon: <Flame className="w-5 h-5 text-red-500" />,
  },
  {
    id: '4',
    type: 'milestone',
    title: '100 Games',
    description: 'Completed 100 matches',
    timestamp: '1 week ago',
    icon: <Trophy className="w-5 h-5 text-blue-500" />,
  },
];

export function ActivityTimeline({
  activities = MOCK_ACTIVITIES,
  isLoading = false,
}: ActivityTimelineProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-10 h-10 border-4 border-gray-200 dark:border-gray-700 border-t-indigo-500 rounded-full animate-spin" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-4">Loading activities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No activities yet. Start playing to see your achievements!</p>
        </div>
      ) : (
        activities.map((activity, index) => (
          <div key={activity.id} className="relative flex gap-4 pb-4">
            {/* Timeline line */}
            {index !== activities.length - 1 && (
              <div className="absolute left-6 top-10 bottom-0 w-0.5 bg-gradient-to-b from-indigo-300 to-transparent dark:from-indigo-700" />
            )}

            {/* Icon */}
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center border border-indigo-200 dark:border-indigo-700 shadow-sm">
              {activity.icon}
            </div>

            {/* Content */}
            <div className="flex-1 pt-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">{activity.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {activity.description}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{activity.timestamp}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
