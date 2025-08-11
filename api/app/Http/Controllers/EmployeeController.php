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

    public function resourceUtilization(Request $request) {

        
        //$totalHoursOfEmployees = $this->getBillableHours();
        //dd($resource_utilization);

        return response()->json($this->getBillableHours($request->get('from_date'), $request->get('to_date')));
    }

    private function getAvailableHours($start, $end){

        $totalAvailableSeconds = 0;

        $current = Carbon::parse($start)->copy()->startOfDay();
        $end = Carbon::parse($end)->copy()->endOfDay();

        while ($current <= $end) {
            if (!$current->isWeekend()) {
                // 9 working hours per day = 9 * 3600 seconds
                $totalAvailableSeconds += 9 * 3600;
            }

            $current->addDay();
        }

        $availableHours = round($totalAvailableSeconds / 3600, 2);

        return $availableHours;
    }

    private function getBillableHours($from_date, $to_date){

        $from_date = Carbon::parse($from_date);
        $to_date = Carbon::parse($to_date);

        $resource_utilization = []; $employeeNamesArray = []; 
        $nonBillableTotalHoursArray = []; $billableTotalHoursArray = [];
        $availableHoursArray = [];

        $employees = Employee::where('company_id', Auth::user()->company_id)->get();

        foreach ($employees as $key => $employee) {
            
            $billableTasks = Task::where('employee_id', $employee->id)
                ->where('billable', 1)
                ->where('start_at', '<=', $to_date)
                ->where('end_at', '>=', $from_date)
                ->get();

            $billableTotalSeconds = 0;

            foreach ($billableTasks as $task) {
                // Clamp task start and end within the target date range
                $start = Carbon::parse($task->start_at)->max($from_date);
                $end = Carbon::parse($task->end_at)->min($to_date);

                $current = $start->copy()->startOfDay();

                while ($current <= $end) {
                    // Skip Sundays (or also Saturdays if needed)
                    if (!$current->isWeekend()) {
                        // Define working hour window
                        $workStart = $current->copy()->setTime(9, 0);  // 9:00 AM
                        $workEnd = $current->copy()->setTime(18, 0);   // 6:00 PM

                        // Get the actual overlapping time between task and workday
                        $dayStart = $start->copy()->max($workStart);
                        $dayEnd = $end->copy()->min($workEnd);

                        if ($dayStart < $dayEnd) {
                            $billableTotalSeconds += $dayEnd->diffInSeconds($dayStart);
                        }
                    }

                    $current->addDay();
                }
            }

            $nonBillableTasks = Task::where('employee_id', $employee->id)
                ->where('billable', 0)
                ->where('start_at', '<=', $to_date)
                ->where('end_at', '>=', $from_date)
                ->get();

            $nonBillableTotalSeconds = 0;

            foreach ($nonBillableTasks as $task) {
                // Clamp task start and end within the target date range
                $start = Carbon::parse($task->start_at)->max($from_date);
                $end = Carbon::parse($task->end_at)->min($to_date);

                $current = $start->copy()->startOfDay();

                while ($current <= $end) {
                    // Skip Sundays (or also Saturdays if needed)
                    if (!$current->isWeekend()) {
                        // Define working hour window
                        $workStart = $current->copy()->setTime(9, 0);  // 9:00 AM
                        $workEnd = $current->copy()->setTime(18, 0);   // 6:00 PM

                        // Get the actual overlapping time between task and workday
                        $dayStart = $start->copy()->max($workStart);
                        $dayEnd = $end->copy()->min($workEnd);

                        if ($dayStart < $dayEnd) {
                            $nonBillableTotalSeconds += $dayEnd->diffInSeconds($dayStart);
                        }
                    }

                    $current->addDay();
                }
            }

            $nonBillableTotalHours = round($nonBillableTotalSeconds / 3600, 2);
            $billableTotalHours = round($billableTotalSeconds / 3600, 2);
            $availableHours = $this->getAvailableHours($from_date, $to_date);

            $employeeNamesArray[] = $employee->name;
            $availableHoursArray[] = $availableHours;
            $billableTotalHoursArray[] = abs($billableTotalHours);
            $nonBillableTotalHoursArray[] = abs($nonBillableTotalHours); 

            $resource_utilization[] = [
                'employee_id' => $employee->id,
                'employee_name' => $employee->name,
                'available_hours' => $availableHours,
                'billable_hours' => abs($billableTotalHours),
                'non_billable_hours' => abs($nonBillableTotalHours)
            ];
        }

        return [
            'employees' => $resource_utilization,
            'employeeNames' => $employeeNamesArray,
            'availableHours' => $availableHours,
            'billableTotalHours' => $billableTotalHoursArray,
            'nonBillableTotalHours' => $nonBillableTotalHoursArray
        ];
    }
}
