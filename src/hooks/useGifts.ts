
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import GiftService from '@/services/gift.service';
import { VirtualGift } from '@/types/gift.types';

export function useGifts() {
  const [gifts, setGifts] = useState<VirtualGift[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        setIsLoading(true);
        const giftsData = await GiftService.getVirtualGifts();
        setGifts(giftsData);
      } catch (err) {
        console.error('Error fetching gifts:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch gifts'));
        toast({
          title: "Error",
          description: "Failed to load gifts. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchGifts();
  }, [toast]);

  return { gifts, isLoading, error };
}
