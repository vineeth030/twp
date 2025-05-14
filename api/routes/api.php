<?php

use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\TaskController;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/users', function () {
    return User::all();
});

Route::post('/employees', [EmployeeController::class, 'store']);
Route::get('/employees', function () {
    return response()->json(['employees' => Employee::with(['task'])->get()]);
});

Route::post('/tasks', [TaskController::class, 'store']);
Route::post('/tasks/reassign', [TaskController::class, 'reassign']);
Route::delete('/tasks/{id}', [TaskController::class, 'destroy']);
Route::patch('/tasks', [TaskController::class, 'update']);
Route::get('/tasks', [TaskController::class, 'index']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
