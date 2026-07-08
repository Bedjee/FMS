<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\PurchaseOrder;
use Barryvdh\DomPDF\Facade\Pdf;

class PDFController extends Controller
{
    public function download(PurchaseOrder $purchaseOrder)
    {
        // Load relationships
        $purchaseOrder->load([
            'supplier',
            'creator',
            'items.material',
            'materialRequest.admin',
            'materialRequest.manager'
        ]);

        // Calculate total
        $total = $purchaseOrder->items->sum('line_total');

        // Get names for signature blocks
        $preparedBy = $purchaseOrder->materialRequest?->admin?->name ?? '—';
        $approvedBy = $purchaseOrder->materialRequest?->manager?->name ?? '—';
        $receivedBy = $purchaseOrder->supplier?->name ?? '—';

        // Generate PDF
        $pdf = Pdf::loadView('pdfs.purchase_order', [
            'purchaseOrder' => $purchaseOrder,
            'total' => $total,
            'preparedBy' => $preparedBy,
            'approvedBy' => $approvedBy,
            'receivedBy' => $receivedBy,
        ]);

        // Set paper size and orientation
        $pdf->setPaper('A4', 'portrait');

        return $pdf->download('Purchase_Order_' . $purchaseOrder->po_number . '.pdf');
    }
}
