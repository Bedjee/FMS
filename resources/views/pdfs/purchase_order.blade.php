<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Purchase Order {{ $purchaseOrder->po_number }}</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
            line-height: 1.5;
            color: #333;
            padding: 40px;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .header p {
            margin: 5px 0 0;
            font-size: 14px;
            color: #666;
        }
        .po-number {
            font-size: 18px;
            font-weight: bold;
            text-align: right;
        }
        .section {
            margin-bottom: 20px;
        }
        .section-title {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 8px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
        }
        .grid-2 {
            display: table;
            width: 100%;
        }
        .grid-2 > div {
            display: table-cell;
            width: 50%;
            padding: 4px 0;
        }
        .grid-3 {
            display: table;
            width: 100%;
            margin-top: 10px;
        }
        .grid-3 > div {
            display: table-cell;
            width: 33.33%;
            padding: 4px 10px 4px 0;
        }
        .label {
            font-weight: bold;
            color: #555;
            font-size: 11px;
            text-transform: uppercase;
        }
        .value {
            font-size: 13px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
        }
        table th {
            background-color: #f0f0f0;
            font-size: 11px;
            text-transform: uppercase;
            padding: 8px;
            text-align: left;
            border: 1px solid #ddd;
        }
        table td {
            padding: 8px;
            border: 1px solid #ddd;
        }
        table tfoot td {
            font-weight: bold;
            background-color: #f9f9f9;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .signature-block {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
        }
        .signature-grid {
            display: table;
            width: 100%;
            margin-top: 10px;
        }
        .signature-grid > div {
            display: table-cell;
            width: 33.33%;
            padding-right: 20px;
        }
        .signature-line {
            border-bottom: 1px solid #333;
            margin-top: 30px;
            padding-bottom: 5px;
        }
        .signature-label {
            font-size: 10px;
            color: #777;
            margin-top: 4px;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #999;
            border-top: 1px solid #ddd;
            padding-top: 15px;
        }
        .status-badge {
            display: inline-block;
            padding: 3px 12px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-draft { background: #e5e7eb; color: #1f2937; }
        .status-sent { background: #dbeafe; color: #1e40af; }
        .status-confirmed { background: #d1fae5; color: #065f46; }
        .status-rejected { background: #fecaca; color: #991b1b; }
        .status-delivered { background: #f3e8ff; color: #5b21b6; }
        .status-cancelled { background: #fecaca; color: #991b1b; }
    </style>
</head>
<body>

    <!-- Header -->
    <div class="header">
        <h1>PURCHASE ORDER</h1>
        <p>System-generated document</p>
    </div>

    <!-- PO Number & Date -->
    <div style="display: table; width: 100%; margin-bottom: 15px;">
        <div style="display: table-cell; width: 70%;">
            <span class="label">PO Number</span><br>
            <span class="value" style="font-size: 18px; font-weight: bold;">{{ $purchaseOrder->po_number }}</span>
        </div>
        <div style="display: table-cell; width: 30%; text-align: right;">
            <span class="label">Date</span><br>
            <span class="value">{{ $purchaseOrder->order_date }}</span>
        </div>
    </div>

    <!-- Supplier Info -->
    <div class="section">
        <div class="section-title">Supplier Information</div>
        <div class="value">
            <strong>{{ $purchaseOrder->supplier?->name ?? 'N/A' }}</strong><br>
            {{ $purchaseOrder->supplier?->contact_person ?? '' }}<br>
            {{ $purchaseOrder->supplier?->phone ?? '' }}<br>
            {{ $purchaseOrder->supplier?->address ?? '' }}
        </div>
    </div>

    <!-- Order Details -->
    <div class="section">
        <div class="section-title">Order Details</div>
        <div class="grid-2">
            <div>
                <span class="label">Status</span><br>
                <span class="status-badge status-{{ $purchaseOrder->status }}">
                    {{ ucfirst($purchaseOrder->status) }}
                </span>
            </div>
            <div>
                <span class="label">Expected Delivery</span><br>
                <span class="value">{{ $purchaseOrder->expected_delivery ?? 'Not set' }}</span>
            </div>
        </div>
        @if($purchaseOrder->notes)
        <div style="margin-top: 8px;">
            <span class="label">Notes</span><br>
            <span class="value">{{ $purchaseOrder->notes }}</span>
        </div>
        @endif
    </div>

    <!-- Items Table -->
    <div class="section">
        <div class="section-title">Ordered Items</div>
        <table>
            <thead>
                <tr>
                    <th>Material</th>
                    <th style="text-align: right;">Qty</th>
                    <th style="text-align: center;">Unit</th>
                    <th style="text-align: right;">Unit Price</th>
                    <th style="text-align: right;">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                @foreach($purchaseOrder->items as $item)
                <tr>
                    <td>{{ $item->material?->name ?? $item->wood_type ?? '—' }}</td>
                    <td style="text-align: right;">{{ $item->quantity }}</td>
                    <td style="text-align: center;">{{ $item->material?->unit ?? 'BF' }}</td>
                    <td style="text-align: right;">₱{{ number_format($item->unit_price, 2) }}</td>
                    <td style="text-align: right;">₱{{ number_format($item->line_total, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="4" style="text-align: right;"><strong>TOTAL</strong></td>
                    <td style="text-align: right;"><strong>₱{{ number_format($total, 2) }}</strong></td>
                </tr>
            </tfoot>
        </table>
    </div>

    <!-- Signature Blocks -->
    <div class="signature-block">
        <div class="signature-grid">
            <div>
                <p style="font-size: 11px; font-weight: bold; text-transform: uppercase; margin-bottom: 5px;">Prepared by</p>
                <div class="signature-line"></div>
                <div class="signature-label">{{ $preparedBy }}</div>
                <div style="margin-top: 4px; font-size: 10px; color: #888;">Signature / Date</div>
            </div>
            <div>
                <p style="font-size: 11px; font-weight: bold; text-transform: uppercase; margin-bottom: 5px;">Approved by</p>
                <div class="signature-line"></div>
                <div class="signature-label">{{ $approvedBy }}</div>
                <div style="margin-top: 4px; font-size: 10px; color: #888;">Signature / Date</div>
            </div>
            <div>
                <p style="font-size: 11px; font-weight: bold; text-transform: uppercase; margin-bottom: 5px;">Received by</p>
                <div class="signature-line"></div>
                <div class="signature-label">{{ $receivedBy }}</div>
                <div style="margin-top: 4px; font-size: 10px; color: #888;">Signature / Date</div>
            </div>
        </div>
    </div>

    <div class="footer">
        This is a system-generated document. Valid without signature.
    </div>

</body>
</html>
