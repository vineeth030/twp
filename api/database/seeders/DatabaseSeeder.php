<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Employee;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $companyOne = Company::create([
            'name' => 'One'
        ]);

        $company = Company::create([
            'name' => 'Cubet'
        ]);

        $projectOne = Project::create([
            'name' => "Project One",
            'budget' => 100000,
            'estimated_hours' => 100,
            'company_id' => $company->id
        ]);

        $projectTwo = Project::create([
            'name' => "Project Two",
            'budget' => 300000,
            'estimated_hours' => 300,
            'company_id' => $company->id
        ]);

        User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'superadmin@one.com',
            'is_admin' => 1,
            'is_company_owner' => 1,
            'company_id' => $companyOne->id
        ]);

        User::factory()->create([
            'name' => 'Lovegin',
            'email' => 'lovegin@one.com',
            'is_admin' => 0,
            'is_company_owner' => 1,
            'company_id' => $company->id
        ]);

        User::factory(3)->create([
            'is_admin' => 0,
            'is_company_owner' => 0,
            'company_id' => $company->id
        ]);

        Employee::factory(5)->create([
            'company_id' => $company->id
        ]);

        Task::factory(6)->create([
            'company_id' => $company->id,
            'project_id' => rand(1,2)
        ]);
    }
}
