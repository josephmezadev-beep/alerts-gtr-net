export function getAlertColor(level?: string) {
  switch (level) {
    case 'critical': return 'text-red-400 bg-red-500/20';
    case 'warning': return 'text-amber-400 bg-amber-500/20';
    case 'info': return 'text-blue-400 bg-blue-500/20';
    default: return 'text-gray-400 bg-gray-500/20';
  }
}