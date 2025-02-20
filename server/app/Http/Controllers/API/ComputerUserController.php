<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Computer;
use App\Models\ComputerUser;
use App\Models\Notification;
use App\Models\Log as ComputerUserLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ComputerUserController extends Controller
{
    public function index()
    {
        $allComputerUsers = ComputerUser::query()->with('branchCode', 'position', 'computers', 'computers.units.category', 'computers.units.supplier')->orderBy('id', 'asc')->get();
        $computerSetUsers = ComputerUser::query()->with('computers', 'computers.units.category', 'computers.units.supplier')->orderBy('id', 'asc')->whereHas('computers')->get();


        if ($allComputerUsers->count() > 0) {

            return response()->json([
                'status'            =>              true,
                'message'           =>              'All computer users successfully fetched',
                'data'              =>              $allComputerUsers,
                'hasComputerSet'    =>              $computerSetUsers,
            ], 200);
        } else {
            return response()->json([
                'status'            =>              true,
                'message'           =>              'No computer users found.'
            ], 404);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'name'                           =>              ['required', 'unique:computer_users,name'],
            'position'                       =>              ['required', 'exists:positions,id'],
            'branch_code'                    =>              ['required', 'exists:branch_codes,id'],
        ]);

        $request->merge([
            'email'         =>      str_replace(' ', '.', $request->input('email'))
        ]);


        if ($request->has('email') && $request->email != null) {
            $validation = Validator::make($request->all(), [
                'email'                          =>              ['unique:computer_users,email', 'lowercase', 'regex:/^\S+@\S+\.\S+$/'],
            ]);
        }
        if ($validation->fails()) {
            return response()->json([
                'status'                =>          false,
                'message'               =>          'Something went wrong. Please fix.',
                'errors'                =>          $validation->errors()
            ], 422);
        }

        $userAuth = auth()->user();


        $user = ComputerUser::create([
            'name'                    =>          $request->name,
            'email'                   =>          $request->email ?: str_replace(' ', '', strtolower($request->name)) . '.smct@gmail.com',
            'position_id'             =>          $request->position,
            'branch_code_id'          =>          $request->branch_code

        ]);

        Notification::create([
            'user_id'       =>          $userAuth->id,
            'title'         =>          ' Added a computer user (' . $user->name . ').',
        ]);

        ComputerUserLog::create([
            'user_id'           =>              auth()->user()->id,
            'log_data'          =>              'Added a computer user: ' . $user->name . ' assign in branch: ' . $user->branchCode->branch_name . ' and position: ' . $user->position->position_name
        ]);


        return response()->json([
            'status'                =>              true,
            'message'               =>              $user->name . " user added successfully.",
            'data'                  =>              $user,
            'id'                    =>              $user->id
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(ComputerUser $computerUser)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ComputerUser $computerUser, $id)
    {
        $computer_user = ComputerUser::with('computers', 'computers.units.category', 'computers.units.supplier')->find($id);
        if (!$computer_user) {
            return response()->json([
                'status'            =>          false,
                'message'           =>          'No user found.'
            ], 404);
        } else {
            return response()->json([
                'status'                =>              true,
                'message'               =>              'Successfully fetched ' . $computer_user->name . ' data.',
                'computer_user_data'    =>              $computer_user,
                'id'                    =>              $computer_user->id
            ], 200);
        }
    }
    public function viewSpecs(ComputerUser $computerUser, $id)
    {
        $computer_user = ComputerUser::with('branchCode', 'position', 'computers', 'computers.units.category', 'computers.units.supplier', 'computers.installedApplications', 'computers.remarks')->find($id);
        if (!$computer_user) {
            return response()->json([
                'status'            =>          false,
                'message'           =>          'No user found.'
            ], 404);
        } else {
            return response()->json([
                'status'                =>              true,
                'message'               =>              'Successfully fetched ' . $computer_user->name . ' computer specs.',
                'computer_user_specs'   =>              $computer_user,
                'id'                    =>              $computer_user->id
            ], 200);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ComputerUser $computerUser)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ComputerUser $computerUser)
    {
        //
    }
}
