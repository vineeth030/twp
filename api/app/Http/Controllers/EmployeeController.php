<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Task;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class EmployeeController extends Controller
{
    private $colors = ['#bbdc00', '#9e5fff', '#dc4900', '#03c2fc', '#232936', '#eb03fc'];

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $employee = Employee::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'designation' => $request->input('designation'),
            'company_id' => Auth::user()->company_id,
            'color' => Arr::random($this->colors)
        ]);

        return response()->json(['message' => 'Employee created successfully', 'employee' => $employee], 201);
    }

    public function update(Request $request, $id)
    {
        Log::info('Data: ', [$request->all()]);
        
        $employee = Employee::findOrFail($id);

        $employee->update([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'designation' => $request->input('designation'),
            'hourly_rate' => $request->input('hourly_rate')
        ]);

        return response()->json(['message' => 'Task updated successfully']);
    }

    public function destroy($id)
    {
        Log::info('Task ID: ', [$id]);

        $employee = Employee::find($id);

        if (!$employee) {
            return response()->json(['message' => 'Employee not found'], 404);
        }

        $employee->delete();

        return response()->json(['message' => 'Employee deleted successfully']);
    }

    public function index(){

        return response()->json(['employees' => Employee::where('company_id', Auth::user()->company_id)->with(['task'])->get()]);
    }

    public function resourceUtilization($from_date, $to_date) {

        $today = Carbon::today();
        $endOfMonth = Carbon::now()->endOfMonth();

        $resource_utilization = [];

        $employees = Employee::where('company_id', Auth::user()->company_id)->all();

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

        return response()->json(['employees' => $employees]);
    }
}
