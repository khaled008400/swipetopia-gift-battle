
import BattleService from './battle.service';
import ProductService from './product.service';
import StreamService from './stream.service';
import GiftService from './gift.service';
import StreamingAdminService from './admin.service';
import type { LiveStream, Battle, BattleRequest, StreamProduct } from '@/models/streaming';

// Export individual services
export {
  BattleService,
  ProductService,
  StreamService,
  GiftService,
  StreamingAdminService
};

// Export types properly with 'export type'
export type { LiveStream, Battle, BattleRequest, StreamProduct };

// No default export - we're exporting individual services
