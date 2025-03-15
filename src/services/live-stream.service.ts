
// This file is maintained for backward compatibility
// Import from new module structure for future development
import LiveStreamService, { 
  LiveStream, 
  Battle, 
  BattleRequest, 
  StreamProduct,
  StreamService,
  BattleService,
  GiftService,
  StreamProductService
} from './streaming';

// Re-export everything for backward compatibility
export { 
  LiveStream, 
  Battle, 
  BattleRequest, 
  StreamProduct,
  StreamService,
  BattleService,
  GiftService,
  StreamProductService
};

export default LiveStreamService;
