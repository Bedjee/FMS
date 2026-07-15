<?php

namespace App\Services;

use App\Models\PurchaseOrder;
use App\Models\User;
use App\Models\Supplier;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class FinancialService
{
    public function processPurchaseOrderPayment(PurchaseOrder $purchaseOrder)
    {
        $manager = $purchaseOrder->creator;
        $supplier = $purchaseOrder->supplier;

        $total = $purchaseOrder->items->sum('line_total');

        if ($total <= 0) {
            throw new \Exception('Order total is zero.');
        }

        DB::transaction(function () use ($manager, $supplier, $total, $purchaseOrder) {
            $manager->deductCapital($total);
            $supplier->addRevenue($total);

            Log::info('💰 Payment processed', [
                'purchase_order_id' => $purchaseOrder->id,
                'manager_id' => $manager->id,
                'supplier_id' => $supplier->id,
                'amount' => $total,
            ]);
        });
    }
}
