<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\User;
use App\Models\WorkSchedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function login(Request $request) {
        
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
    
        $user = User::where('email', $request->email)->first();
    
        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }
    
        $token = $user->createToken('rm-chrome-extension')->plainTextToken;
    
        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function register(Request $request) {
        
        $request->validate([
            'companyName' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
        ]);

        $company = Company::create([
            'name' => $request->companyName,
            'currency' => 'USD'
        ]);
    
        $user = User::create([
            'company_id' => $company->id,
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'is_company_owner' => 1,
        ]);

        WorkSchedule::create([
            'company_id' => $company->id,
            'weekends' => ['Saturday', 'Sunday'],
            'start_time' => '09:00:00',
            'end_time' => '18:00:00'
        ]);
    
        $token = $user->createToken('rm-chrome-extension')->plainTextToken;
    
        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function logout(Request $request) {

        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }
}
