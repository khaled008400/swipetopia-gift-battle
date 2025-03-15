
import StreamService from './stream.service';
import BattleService from './battle.service';
import GiftService from './gift.service';
import StreamProductService from './product.service';
import { LiveStream, Battle, BattleRequest, StreamProduct } from '@/models/streaming';

// Re-export types for backward compatibility
export type { LiveStream, Battle, BattleRequest, StreamProduct };

// Combine all services into a single object to maintain backward compatibility
const LiveStreamService = {
  // Stream operations
  startStream: StreamService.startStream,
  endStream: StreamService.endStream,
  getActiveStreams: StreamService.getActiveStreams,
  
  // Battle operations
  requestBattle: BattleService.requestBattle,
  acceptBattle: BattleService.acceptBattle,
  endBattle: BattleService.endBattle,
  
  // Gift operations
  sendGift: GiftService.sendGift,
  
  // Product operations
  tagProduct: StreamProductService.tagProduct,
  removeProductTag: StreamProductService.removeProductTag,
  getStreamProducts: StreamProductService.getStreamProducts,
  updateStreamProduct: StreamProductService.updateStreamProduct,
  getStreamsByProduct: StreamProductService.getStreamsByProduct,
};

export default LiveStreamService;

// Also export individual services for direct use
export {
  StreamService,
  BattleService,
  GiftService,
  StreamProductService
};
