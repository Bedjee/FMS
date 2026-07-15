import ManagerLayout from '@/Layouts/ManagerLayout';
import { useState } from 'react';

export default function ReportIndex() {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [datePreset, setDatePreset] = useState('');

    const handlePreset = (preset) => {
        setDatePreset(preset);
        const now = new Date();
        let from = new Date(now);
        let to = new Date(now);

        switch (preset) {
            case 'today':
                break;
            case 'week':
                from.setDate(now.getDate() - 7);
                break;
            case 'month':
                from.setMonth(now.getMonth() - 1);
                break;
            default:
                from = null;
                to = null;
        }

        setFromDate(from ? from.toISOString().split('T')[0] : '');
        setToDate(to ? to.toISOString().split('T')[0] : '');
    };

    return (
        <ManagerLayout>
            <div className="max-w-2xl mx-auto py-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Generate Report</h1>
                    <p className="text-gray-600 mb-6">Select a date range to generate a financial report PDF.</p>

                    {/* ⚡ Use GET, target="_blank" to open in new tab if needed */}
                    <form method="GET" action={route('manager.report.generate')} target="_blank" className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Quick Select</label>
                            <div className="flex flex-wrap gap-2">
                                {['today', 'week', 'month', 'custom'].map((preset) => (
                                    <button
                                        key={preset}
                                        type="button"
                                        onClick={() => handlePreset(preset)}
                                        className={`px-4 py-2 text-sm font-medium rounded-lg border ${
                                            datePreset === preset
                                                ? 'bg-slate-700 text-white border-slate-700'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        {preset.charAt(0).toUpperCase() + preset.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="from_date" className="block text-sm font-medium text-gray-700">
                                    From Date
                                </label>
                                <input
                                    type="date"
                                    id="from_date"
                                    name="from_date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="to_date" className="block text-sm font-medium text-gray-700">
                                    To Date
                                </label>
                                <input
                                    type="date"
                                    id="to_date"
                                    name="to_date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800"
                            >
                                Generate & Download PDF
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </ManagerLayout>
    );
}
