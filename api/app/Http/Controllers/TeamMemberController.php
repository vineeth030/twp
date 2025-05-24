<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TeamMemberController extends Controller
{
    public function index(Request $request)
    {
        $members = User::where('company_id', $request->user()->company_id)
                       ->where('id', '!=', $request->user()->id) // Exclude self
                       ->get();
        return response()->json(['members' => $members]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'company_id' => Auth::user()->company_id,
            'password' => bcrypt($request->password), // Or send a password reset email
        ]);

        return response()->json(['user' => $user]);
    }

    public function update(Request $request, User $user)
    {
        //$this->authorize('update', $user); // Optional: add policy

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
        ]);

        $user->update($request->only(['name', 'email']));

        return response()->json(['message' => 'Team member updated']);
    }

    public function destroy(User $user)
    {
        //$this->authorize('delete', $user); // Optional

        $user->delete();

        return response()->json(['message' => 'Team member deleted']);
    }
}
