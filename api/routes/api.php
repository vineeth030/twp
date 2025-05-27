<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TeamMemberController;
use App\Models\User;
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
    Route::patch('/employees/{id}', [EmployeeController::class, 'update']);

    Route::get('/team-members', [TeamMemberController::class, 'index']);
    Route::post('/team-members', [TeamMemberController::class, 'store']);
    Route::patch('/team-members/{user}', [TeamMemberController::class, 'update']);
    Route::delete('/team-members/{user}', [TeamMemberController::class, 'destroy']);

    Route::post('/tasks', [TaskController::class, 'store']);
    Route::post('/tasks/reassign', [TaskController::class, 'reassign']);
    Route::delete('/tasks/{id}', [TaskController::class, 'destroy']);
    Route::patch('/tasks', [TaskController::class, 'update']);
    Route::get('/tasks', [TaskController::class, 'index']);

    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);