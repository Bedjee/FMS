<?php

namespace App\Services;

use App\Models\EcommerceOrder;
use App\Models\ProductVariant;
use App\Models\ProductInventoryTransaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class InventoryService
{
    /**
     * Deduct stock for an order and log transactions.
     *
     * @param EcommerceOrder $order
     * @param string $referenceType  'order' or 'manual'
     * @param string $notes          Optional notes
     * @return bool
     * @throws \Exception
     */
  public function deductOrderStock(EcommerceOrder $order, string $referenceType = 'order', string $notes = null): bool
{
    if ($order->fulfillment_status !== 'delivered') {
        throw new \Exception('Order is not delivered, cannot deduct stock.');
    }

    $order->load('items.variant');

    DB::transaction(function () use ($order, $referenceType, $notes) {
        foreach ($order->items as $item) {
            $variant = $item->variant;
            if (!$variant) {
                $msg = "Variant not found for order item #{$item->id} (variant_id: {$item->product_variant_id})";
                Log::error('❌ ' . $msg);
                throw new \Exception($msg);
            }

            // Deduct stock
            $variant->decrement('stock_quantity', $item->quantity);

            // Log transaction
            $this->logTransaction(
                $variant,
                'stock_out',
                $item->quantity,
                $referenceType,
                $order->id,
                $notes ?? 'Order #' . $order->order_number . ' delivered'
            );
        }
    });

    Log::info('✅ Stock deducted for order #' . $order->order_number, ['order_id' => $order->id]);
    return true;
}

    /**
     * Add stock to a variant and log transaction.
     *
     * @param ProductVariant $variant
     * @param int $quantity
     * @param string $referenceType
     * @param int|null $referenceId
     * @param string|null $notes
     * @return void
     */
    public function addStock(ProductVariant $variant, int $quantity, string $referenceType = 'manual', $referenceId = null, string $notes = null): void
    {
        DB::transaction(function () use ($variant, $quantity, $referenceType, $referenceId, $notes) {
            $variant->increment('stock_quantity', $quantity);
            $this->logTransaction(
                $variant,
                'stock_in',
                $quantity,
                $referenceType,
                $referenceId,
                $notes ?? 'Manual stock addition'
            );
        });
    }

    /**
     * Log inventory transaction.
     *
     * @param ProductVariant $variant
     * @param string $type      stock_in, stock_out, adjustment
     * @param int $quantity
     * @param string $referenceType
     * @param int|null $referenceId
     * @param string|null $notes
     * @return void
     */
    protected function logTransaction(ProductVariant $variant, string $type, int $quantity, string $referenceType, $referenceId = null, string $notes = null): void
    {
        ProductInventoryTransaction::create([
            'product_variant_id' => $variant->id,
            'type' => $type,
            'quantity' => $quantity,
            'balance_after' => $variant->stock_quantity,
            'reference_type' => $referenceType,
            'reference_id' => $referenceId,
            'notes' => $notes,
        ]);
    }
}
