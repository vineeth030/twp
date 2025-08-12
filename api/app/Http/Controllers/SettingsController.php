<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Company;
use App\Models\WorkSchedule;
use Illuminate\Support\Facades\Auth;

class SettingsController extends Controller
{
    /**
     * Get settings for a specific company.
     */
    public function show()
    {
        $company = Company::findOrFail(Auth::user()->company_id);
        $schedule = WorkSchedule::where('company_id', Auth::user()->company_id)->firstOrFail();

        return response()->json([
            'holidays' => $schedule->weekends,
            'working_hours_start' => \Carbon\Carbon::createFromFormat('H:i:s', $schedule->start_time)->format('H:i'),
            'working_hours_end' => \Carbon\Carbon::createFromFormat('H:i:s', $schedule->end_time)->format('H:i'),
            'currency' => $company->currency,
        ]);
    }

    /**
     * Update settings for a specific company.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'holidays' => 'required|array',
            'workingHoursStart' => 'required|date_format:H:i',
            'workingHoursEnd' => 'required|date_format:H:i',
            'currency' => 'required|string|max:10',
        ]);

        // Update work schedule
        $schedule = WorkSchedule::updateOrCreate(
            ['company_id' => Auth::user()->company_id],
            [
                'start_time' => $validated['workingHoursStart'],
                'end_time' => $validated['workingHoursEnd'],
                'weekends' => $validated['holidays'],
            ]
        );

        // Update company currency
        $company = Company::findOrFail(Auth::user()->company_id);
        $company->currency = $validated['currency'];
        $company->save();

        return response()->json([
            'message' => 'Settings updated successfully.',
            'data' => [
                'holidays' => $schedule->weekends,
                'workingHoursStart' => $schedule->start_time,
                'workingHoursEnd' => $schedule->end_time,
                'currency' => $company->currency,
            ]
        ]);
    }
}
