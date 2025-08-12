<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    /**
     * Show the user's profile.
     */
    public function show()
    {
        $user = Auth::user();

        return response()->json([
            'company_name' => $user->company->name ?? null,
        ]);
    }

    /**
     * Update the user's profile (reset password only for now).
     */
    public function update(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'password' => 'nullable|string|min:8|confirmed', // password_confirmation required if password sent
        ]);

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully.',
        ]);
    }
}
