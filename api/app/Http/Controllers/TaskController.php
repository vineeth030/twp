<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TaskController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'hours' => 'required|numeric|min:0',
            'start_at' => 'nullable|date|before:end_at',
            'end_at' => 'nullable|date|after:start_at',
            'assigned_to' => 'nullable|exists:employees,id', // Assuming you have a 'users' table
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $task = Task::create([
            'name' => $request->input('name'),
            'hours' => $request->input('hours'),
            'start_at' => $request->input('start_at'),
            'end_at' => $request->input('end_at'),
            'assigned_to' => $request->input('assigned_to'),
        ]);

        return response()->json(['message' => 'Task created successfully', 'task' => $task], 201);
    }

    public function index()
    {
        $tasks = Task::all();

        return response()->json(['tasks' => $tasks]);
    }

    public function reassign(Request $request){

        Task::where('assigned_to', $request->input('assigned_to'))->delete();
        
        Task::where('id', $request->input('task_id'))->update([
            'assigned_to' => $request->input('assigned_to')
        ]);

        return response()->json(['message' => 'Task updated successfully'], 200);
    }
}
