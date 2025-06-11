<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::where('company_id', Auth::user()->company_id)->get();

        $projects = $projects->map(function($project){

            [$total_hours, $total_expenses] = $this->getTotalProjectExpenses($project->id);

            return [
                'id' => $project->id,
                'name' => $project->name,
                'budget' => $project->budget,
                'estimated_hours' => $project->estimated_hours,
                'is_over_budget' => ( $project->budget - $total_expenses ) < 0, // example condition
                'budget_expenses_difference' => $project->budget - $total_expenses,
                'label' => strtoupper($project->name),        // custom formatted value
                'created_at_formatted' => $project->created_at->format('Y-m-d'),
                'total_billable_hours' => $total_hours,
                'total_project_expenses' => $total_expenses,
                // Add any relationship data if needed
                'client_name' => optional($project->client)->name,
            ];
        });

        return response()->json(['projects' => $projects]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'budget' => 'nullable|numeric',
            'estimated_hours' => 'nullable|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $project = Project::create([
            'name' => $request->input('name'),
            'budget' => $request->input('budget'),
            'estimated_hours' => $request->input('estimated_hours'),
            'company_id' => Auth::user()->company_id,
        ]);

        return response()->json(['message' => 'Project created successfully', 'project' => $project], 201);
    }

    public function update(Request $request, $id)
    {
        $project = Project::where('company_id', Auth::user()->company_id)->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'budget' => 'nullable|numeric',
            'estimated_hours' => 'nullable|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $project->update([
            'name' => $request->input('name'),
            'budget' => $request->input('budget'),
            'estimated_hours' => $request->input('estimated_hours'),
        ]);

        return response()->json(['message' => 'Project updated successfully', 'project' => $project]);
    }

    public function destroy($id)
    {
        $project = Project::where('company_id', Auth::user()->company_id)->find($id);

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        $project->delete();

        return response()->json(['message' => 'Project deleted successfully']);
    }

    private function getTotalProjectExpenses(int $projectId)
    {
        // employee under project one x billed hours of this employee for project one x hourly rate of this employee, 
        // do this for all employees under this project
        $total_hours = 0;
        $total_expenses = 0;
        //$employees = Employee::where('project_id', $projectId)->pluck('id');
        $employees = Task::where('project_id', $projectId)->distinct()->pluck('employee_id');

        foreach ($employees as $key => $employeeId) {

            $employee = Employee::where('id', $employeeId)->first();

            $total_hours = $total_hours + Task::where('project_id', $projectId)->where('employee_id', $employeeId)->sum('total_hours');
            $total_expenses = $total_expenses + ($total_hours * $employee->hourly_rate);
        }

        return [ $total_hours, $total_expenses ];
    }

    private function getBilledHours(int $projectId)
    {
        return Task::where('project_id', $projectId)->where('billable', 1)->sum('total_hours');
    }

    private function getProjectExpenseStatus()
    {
        // Budget - Total Project Expenses 
    }
}
