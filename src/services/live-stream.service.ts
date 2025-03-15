
// This file is maintained for backward compatibility
// Import from new module structure for future development
import LiveStreamService, { 
  StreamService,
  BattleService,
  GiftService,
  StreamProductService
} from './streaming';

// Re-export types for backward compatibility
export type { 
  LiveStream, 
  Battle, 
  BattleRequest, 
  StreamProduct 
} from './streaming';

// Re-export services for backward compatibility
export { 
  StreamService,
  BattleService,
  GiftService,
  StreamProductService
};

export default LiveStreamService;
