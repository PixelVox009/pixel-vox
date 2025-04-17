import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { GiftTokenModalProps } from "@/types/users";

export const GiftTokenModal = ({
  isOpen,
  onOpenChange,
  selectedUser,
  tokensToGift,
  setTokensToGift,
  giftDescription,
  setGiftDescription,
  onGift,
  isGifting,
}: GiftTokenModalProps) => (
  <Dialog open={isOpen} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Bonus Token</DialogTitle>
        <DialogDescription>Bonus token for user {selectedUser?.name}</DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <label htmlFor="tokens" className="text-sm font-medium">
            Quantity credits
          </label>
          <Input
            id="tokens"
            type="number"
            min="1"
            value={tokensToGift}
            onChange={(e) => setTokensToGift(parseInt(e.target.value) || 0)}
            placeholder="Quantity credits"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <Input
            id="description"
            value={giftDescription}
            onChange={(e) => setGiftDescription(e.target.value)}
            placeholder="Ví dụ: Khuyến mãi, thưởng hoạt động,..."
          />
          <p className="text-sm text-muted-foreground">Description will be displayed in user transaction history</p>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Hủy
        </Button>
        <Button onClick={onGift} disabled={isGifting || tokensToGift <= 0}>
          {isGifting ? "Đang xử lý..." : "Tặng credits"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
