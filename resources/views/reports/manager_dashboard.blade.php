<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Financial Performance Report</title>
    <style>
        /* ─── Reset & Base ─── */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'DejaVu Sans', 'Helvetica Neue', Arial, sans-serif;
            font-size: 10pt;
            color: #000000;
            line-height: 1.3;
            padding: 30px 35px;
            background: #ffffff;
        }

        /* ─── Header ─── */
        .header {
            text-align: center;
            border-bottom: 2px solid #000000;
            padding-bottom: 10px;
            margin-bottom: 18px;
        }
        .header .company-name {
            font-size: 18pt;
            font-weight: 700;
            letter-spacing: 1px;
        }
        .header .report-title {
            font-size: 14pt;
            font-weight: 400;
            margin-top: 2px;
        }
        .header .meta-info {
            font-size: 9pt;
            margin-top: 4px;
            color: #333333;
        }
        .header .meta-info span {
            display: inline-block;
            margin: 0 10px;
        }

        /* ─── Sections ─── */
        .section {
            margin: 16px 0 12px 0;
        }
        .section-title {
            font-size: 12pt;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1px solid #000000;
            padding-bottom: 3px;
            margin-bottom: 8px;
        }

        /* ─── Summary Cards (table-based) ─── */
        .summary-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        .summary-table td {
            padding: 8px 6px;
            text-align: center;
            border: 1px solid #000000;
            font-size: 10pt;
        }
        .summary-table .label {
            font-size: 8pt;
            text-transform: uppercase;
            color: #000000;
            font-weight: 600;
        }
        .summary-table .value {
            font-size: 15pt;
            font-weight: 700;
            margin-top: 2px;
        }
        .summary-table .value.negative {
            text-decoration: underline; /* indicates loss */
        }

        /* ─── Data Tables ─── */
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin: 6px 0 10px 0;
            font-size: 9pt;
        }
        .data-table th {
            background: #f0f0f0;
            font-weight: 700;
            padding: 5px 6px;
            border: 1px solid #000000;
            text-align: left;
            font-size: 8.5pt;
            text-transform: uppercase;
        }
        .data-table td {
            padding: 4px 6px;
            border: 1px solid #000000;
        }
        .data-table th.text-right,
        .data-table td.text-right {
            text-align: right;
        }
        .data-table th.text-center,
        .data-table td.text-center {
            text-align: center;
        }
        .data-table .total-row {
            font-weight: 700;
            background: #f9f9f9;
        }

        /* ─── Badges (plain text) ─── */
        .badge {
            font-weight: 700;
            text-transform: uppercase;
            font-size: 8pt;
        }
        .badge-income  { color: #000000; }
        .badge-expense { color: #000000; }
        /* just plain text, no background */

        /* ─── Footer ─── */
        .footer {
            margin-top: 25px;
            padding-top: 10px;
            border-top: 1px solid #000000;
            font-size: 8pt;
            text-align: center;
            color: #333333;
        }
        .footer .page-number {
            float: right;
        }

        /* ─── Utilities ─── */
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .text-left { text-align: left; }
        .fw-bold { font-weight: 700; }
        .mt-1 { margin-top: 6px; }
        .mb-1 { margin-bottom: 6px; }
        .no-border { border: none !important; }
    </style>
</head>
<body>

    <!-- ========== HEADER ========== -->
    <div class="header">
        <div class="company-name">TRIPLE AAA</div>
        <div class="report-title">Financial Performance Report</div>
        <div class="meta-info">
            <span><strong>Generated:</strong> {{ $generated_at }}</span>
            <span><strong>Period:</strong> {{ $date_range }}</span>
        </div>
    </div>

    <!-- ========== FINANCIAL SUMMARY ========== -->
    <div class="section">
        <div class="section-title">Financial Summary</div>
        <table class="summary-table">
            <tr>
                <td>
                    <div class="label">Total Revenue</div>
                    <div class="value">₱{{ number_format($total_revenue, 2) }}</div>
                </td>
                <td>
                    <div class="label">Total Expenses</div>
                    <div class="value">₱{{ number_format($total_expenses, 2) }}</div>
                </td>
                <td>
                    <div class="label">Net Profit / Loss</div>
                    <div class="value {{ $net_profit < 0 ? 'negative' : '' }}">
                        ₱{{ number_format($net_profit, 2) }}
                    </div>
                </td>
                <td>
                    <div class="label">Profit Margin</div>
                    <div class="value">{{ number_format($profit_margin, 2) }}%</div>
                </td>
                <td>
                    <div class="label">Available Capital</div>
                    <div class="value">₱{{ number_format($capital, 2) }}</div>
                </td>
            </tr>
        </table>
    </div>

    <!-- ========== ORDER SUMMARY ========== -->
    <div class="section">
        <div class="section-title">Order Summary</div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Status</th>
                    <th class="text-right">Count</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>Pending</td><td class="text-right">{{ $pending }}</td></tr>
                <tr><td>Processing</td><td class="text-right">{{ $processing }}</td></tr>
                <tr><td>Shipped</td><td class="text-right">{{ $shipped }}</td></tr>
                <tr><td>Delivered</td><td class="text-right">{{ $delivered }}</td></tr>
                <tr class="total-row">
                    <td>Total Orders</td>
                    <td class="text-right">{{ $total_orders }}</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- ========== INVENTORY SUMMARY ========== -->
    <div class="section">
        <div class="section-title">Inventory Summary</div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Metric</th>
                    <th class="text-right">Value</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>Total Products (Variants)</td><td class="text-right">{{ $total_products }}</td></tr>
                <tr><td>Total Stock Units</td><td class="text-right">{{ $total_stock }}</td></tr>
                <tr><td>Low Stock Items</td><td class="text-right">{{ $low_stock }}</td></tr>
                <tr><td>Out of Stock</td><td class="text-right">{{ $out_of_stock }}</td></tr>
            </tbody>
        </table>
    </div>

    <!-- ========== TOP SELLING PRODUCTS ========== -->
    @if($top_products->count())
    <div class="section">
        <div class="section-title">Top Selling Products</div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Variant</th>
                    <th class="text-right">Units Sold</th>
                </tr>
            </thead>
            <tbody>
                @foreach($top_products as $product)
                <tr>
                    <td>{{ $product['name'] }}</td>
                    <td>{{ $product['variant'] }}</td>
                    <td class="text-right">{{ $product['total_sold'] }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    <!-- ========== RECENT TRANSACTIONS ========== -->
    @if($transactions->count())
    <div class="section">
        <div class="section-title">Recent Financial Transactions</div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th class="text-right">Amount</th>
                </tr>
            </thead>
            <tbody>
                @foreach($transactions as $tx)
                <tr>
                    <td>{{ $tx['date'] }}</td>
                    <td>{{ $tx['description'] }}</td>
                    <td class="text-center">
                        <span class="badge {{ $tx['type'] == 'Income' ? 'badge-income' : 'badge-expense' }}">
                            {{ $tx['type'] }}
                        </span>
                    </td>
                    <td class="text-right">₱{{ number_format($tx['amount'], 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    <!-- ========== FOOTER ========== -->
    <div class="footer">
        <span>Generated on {{ $generated_at }}</span>

        <br>
        <span>&copy; {{ date('Y') }} {{ $business_name }}. All rights reserved.</span>
    </div>

</body>
</html>
