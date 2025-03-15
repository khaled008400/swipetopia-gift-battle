
// This file is maintained for backward compatibility
// Import from new module structure for future development
import { 
  StreamService,
  BattleService,
  GiftService,
  ProductService
} from './streaming';

import type {
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
  ProductService,
  // Direct method access for components using the old API
  endBattle: (battleId: string, winnerId?: string) => BattleService.endBattle(battleId, winnerId),
  tagProduct: (productId: string, streamId: string, featured: boolean = false, discountPercentage?: number) => 
    ProductService.tagProduct(productId, streamId, featured, discountPercentage),
  acceptBattle: (battleId: string) => BattleService.acceptBattle(battleId)
};

export default LiveStreamService;
