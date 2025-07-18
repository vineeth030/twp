<?php

namespace App\Http\Controllers;

use App\Models\Employee;
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

        Log::info('From Date: ', $from_date);
        Log::info('To Date: ', $to_date);

        $employees = Employee::where('company_id', Auth::user()->company_id)
            ->whereHas('task', function ($query) use ($from_date, $to_date) {
                $query->where(function ($q) use ($from_date, $to_date) {
                    $q->where(function ($q) use ($from_date, $to_date) {
                        $q->where('start_at', '>=', $from_date)
                        ->where('end_at', '<=', $to_date); // Task completely within range
                    })->orWhere(function ($q) use ($from_date, $to_date) {
                        $q->where('start_at', '<', $from_date)
                        ->where('end_at', '<=', $to_date)
                        ->where('end_at', '>=', $from_date); // Task starts before, ends within
                    })->orWhere(function ($q) use ($from_date, $to_date) {
                        $q->where('start_at', '>=', $from_date)
                        ->where('start_at', '<=', $to_date)
                        ->where('end_at', '>', $to_date); // Task starts within, ends after
                    });
                });
            })
            ->with(['task' => function ($query) use ($from_date, $to_date) {
                $query->where(function ($q) use ($from_date, $to_date) {
                    $q->where(function ($q) use ($from_date, $to_date) {
                        $q->where('start_at', '>=', $from_date)
                        ->where('end_at', '<=', $to_date);
                    })->orWhere(function ($q) use ($from_date, $to_date) {
                        $q->where('start_at', '<', $from_date)
                        ->where('end_at', '<=', $to_date)
                        ->where('end_at', '>=', $from_date);
                    })->orWhere(function ($q) use ($from_date, $to_date) {
                        $q->where('start_at', '>=', $from_date)
                        ->where('start_at', '<=', $to_date)
                        ->where('end_at', '>', $to_date);
                    });
                });
            }])
            ->get();

        return response()->json(['employees' => $employees]);
    }
}
