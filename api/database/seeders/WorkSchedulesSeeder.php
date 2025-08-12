<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use DB;

class WorkSchedulesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('work_schedules')->insert([
            [
                'company_id' => 1,
                'start_time' => '09:00:00',
                'end_time' => '18:00:00',
                'weekends' => json_encode(['Saturday', 'Sunday']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'company_id' => 2,
                'start_time' => '09:00:00',
                'end_time' => '18:00:00',
                'weekends' => json_encode(['Saturday', 'Sunday']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
