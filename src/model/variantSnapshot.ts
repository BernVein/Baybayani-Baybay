export interface VariantSnapshot {
  variant_snapshot_id: string;
  variant_copy_snapshot_id: string;
  variant_snapshot_name: string;
  variant_snapshot_price_retail: number;
  variant_snapshot_price_wholesale?: number | null;
  variant_snapshot_wholesale_item?: number | null;
  last_updated: string;
  is_soft_deleted: boolean;
  created_at: string;
}
