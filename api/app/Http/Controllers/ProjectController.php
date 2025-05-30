<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::where('company_id', Auth::user()->company_id)->get();

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
}
