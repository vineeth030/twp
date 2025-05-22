<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class EmployeeController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $employee = Employee::create([
            'name' => $request->input('name')
        ]);

        return response()->json(['message' => 'Employee created successfully', 'employee' => $employee], 201);
    }

    public function update(Request $request)
    {
        Log::info('Data: ', [$request->all()]);
        
        $employee = Employee::findOrFail($request->input('id'));

        $employee->update([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'designation' => $request->input('designation')
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
}
