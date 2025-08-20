<?php

use App\Models\Employee;
use App\Models\Task;
use App\Models\User;
use App\Models\WorkSchedule;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/users', function () {
    return User::all();
});

Route::get('/hours', function () {
    
    $today = Carbon::today();
    $endOfMonth = Carbon::now()->endOfMonth();

    $resource_utilization = [];

    $employees = Employee::where('company_id', 2)->get();

    foreach ($employees as $key => $employee) {
        
        $tasks = Task::where('employee_id', $employee->id)
            ->where('start_at', '<=', $endOfMonth)
            ->where('end_at', '>=', $today)
            ->get();

        $totalSeconds = 0;

        foreach ($tasks as $task) {
            // Clamp task start and end within the target date range
            $start = Carbon::parse($task->start_at)->max($today);
            $end = Carbon::parse($task->end_at)->min($endOfMonth);

            $current = $start->copy()->startOfDay();

            while ($current <= $end) {
                // Skip Sundays (or also Saturdays if needed)
                if (!$current->isSunday()) {
                    // Define working hour window
                    $workStart = $current->copy()->setTime(9, 0);  // 9:00 AM
                    $workEnd = $current->copy()->setTime(18, 0);   // 6:00 PM

                    // Get the actual overlapping time between task and workday
                    $dayStart = $start->copy()->max($workStart);
                    $dayEnd = $end->copy()->min($workEnd);

                    if ($dayStart < $dayEnd) {
                        $totalSeconds += $dayEnd->diffInSeconds($dayStart);
                    }
                }

                $current->addDay();
            }
        }

        $totalHours = round($totalSeconds / 3600, 2);

        $resource_utilization[] = [
            'employee_id' => $employee->id,
            'allocated_hours' => $totalHours,
            'available_hours' => 100,
            'billable_hours' => 100,
            'non_billable_hours' => 10
        ];
    }

    dd($resource_utilization);
});

Route::get('calc-time', function(){
    $start = Carbon::parse("2025-08-20T18:30:00.000Z");
    $end = Carbon::parse("2025-08-28T18:30:00.000Z");
    $totalSeconds = 0;

    $schedule = WorkSchedule::where('company_id', 1)->first();

    $current = $start->copy()->startOfDay();

    while ($current <= $end) {
        // Skip Sundays (or also Saturdays if needed)
        if (!in_array($current->format('l'), $schedule->weekends)) {
            // Define working hour window
            $workStart = $current->copy()->setTimeFromTimeString($schedule->start_time);
            $workEnd = $current->copy()->setTimeFromTimeString($schedule->end_time);

            // Get the actual overlapping time between task and workday
            $dayStart = $start->copy()->max($workStart);
            $dayEnd = $end->copy()->min($workEnd);

            if ($dayStart < $dayEnd) {
                $totalSeconds += $dayEnd->diffInSeconds($dayStart);
            }
        }

        $current->addDay();
    }

    $totalHours = abs(round($totalSeconds / 3600, 2));

    dd($totalHours);
});