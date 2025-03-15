
// This file is maintained for backward compatibility
// Import from new module structure for future development
import { 
  StreamService,
  BattleService,
  GiftService,
  ProductService,
  LiveStream,
  Battle,
  BattleRequest,
  StreamProduct
} from './streaming';

// Re-export types for backward compatibility
export type { 
  LiveStream, 
  Battle, 
  BattleRequest, 
  StreamProduct 
};

// Re-export services for backward compatibility
export { 
  StreamService,
  BattleService,
  GiftService,
  ProductService
};

// Backward compatibility default export
const LiveStreamService = {
  StreamService,
  BattleService,
  GiftService,
  ProductService
};

export default LiveStreamService;
