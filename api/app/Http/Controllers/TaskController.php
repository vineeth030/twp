<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class TaskController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'start_at' => 'nullable|date|before:end_at',
            'end_at' => 'nullable|date|after:start_at',
            'employee_id' => 'nullable|exists:employees,id', // Assuming you have a 'users' table
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        Log::info("Data: ", [$request->all()]);

        $is_billable = Project::where('id', $request->input('project_id'))->value('is_billable');

        $task = Task::create([
            'name' => $request->input('name'),
            'start_at' => Carbon::parse($request->input('start_at')),
            'end_at' => Carbon::parse($request->input('end_at')),
            'employee_id' => $request->input('employee_id'),
            'company_id' => Auth::user()->company_id,
            'project_id' => $request->input('project_id'),
            'total_hours' => $request->input('totalWorkingHours'),
            'billable' => $is_billable
        ]);

        return response()->json(['message' => 'Task created successfully', 'task' => $task], 201);
    }

    public function index()
    {
        $tasks = Task::where('company_id', Auth::user()->company_id)->with(['project'])->get()->map(function ($task) {
            return [
                'id' => $task->id,
                'name' => $task->name, // or 'Subject' if you're using legacy keys
                'start_at' => $task->start_at ? $task->start_at->toIso8601String() : null,
                'end_at' => $task->end_at ? $task->end_at->toIso8601String() : null,
                'is_all_day' => $task->is_all_day,
                'employee_id' => $task->employee_id,
                'project_id' => $task->project_id,
                'project_name' => $task->project->name
            ];
        });

        return response()->json(['tasks' => $tasks]);
    }

    public function reassign(Request $request){

        Task::where('assigned_to', $request->input('assigned_to'))->delete();
        
        Task::where('id', $request->input('task_id'))->update([
            'assigned_to' => $request->input('assigned_to')
        ]);

        return response()->json(['message' => 'Task updated successfully'], 200);
    }

    public function update(Request $request)
    {
        Log::info('Data: ', [$request->all()]);
        
        $task = Task::findOrFail($request->input('id'));

        Log::info('Update Data: ', [
            'name' => $request->input('name'),
            'start_at' => Carbon::parse($request->input('start_at')),
            'end_at' => Carbon::parse($request->input('end_at')),
            'employee_id' => $request->input('employee_id'),
            'is_all_day' => false,
            'project_id' => $request->input('project_id'),
        ]);

        $is_billable = Project::where('id', $request->input('project_id'))->value('is_billable');

        $task->update([
            'name' => $request->input('name'),
            'start_at' => Carbon::parse($request->input('start_at')),
            'end_at' => Carbon::parse($request->input('end_at')),
            'employee_id' => $request->input('employee_id'),
            'is_all_day' => false,
            'project_id' => $request->input('project_id'),
            'billable' => $is_billable
        ]);

        return response()->json(['message' => 'Task updated successfully']);
    }


    public function destroy($id)
    {
        Log::info('Task ID: ', [$id]);

        $task = Task::find($id);

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        $task->delete();

        return response()->json(['message' => 'Task deleted successfully']);
    }
}
