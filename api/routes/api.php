<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\TaskController;
use App\Models\Company;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/users', function () {
        return User::all();
    });

    Route::get('/user', function() {
        return Auth::user();
    });

    Route::post('/employees', [EmployeeController::class, 'store']);
    Route::delete('/employees/{id}', [EmployeeController::class, 'destroy']);
    Route::get('/employees', [EmployeeController::class, 'index']);
    Route::patch('/employees', [EmployeeController::class, 'update']);

    Route::post('/tasks', [TaskController::class, 'store']);
    Route::post('/tasks/reassign', [TaskController::class, 'reassign']);
    Route::delete('/tasks/{id}', [TaskController::class, 'destroy']);
    Route::patch('/tasks', [TaskController::class, 'update']);
    Route::get('/tasks', [TaskController::class, 'index']);
});

Route::post('/login', [AuthController::class, 'login']);

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });