<?php

namespace Database\Factories;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    private $times = [
        [
            "start_at" => "2025-05-11T02:30:00.000Z",
            "end_at" => "2025-05-11T05:00:00.000Z",
        ],
        [
            "start_at" => "2025-05-11T03:30:00.000Z",
            "end_at" => "2025-05-11T05:30:00.000Z",
        ],
        [
            "start_at" => "2025-05-11T03:30:00.000Z",
            "end_at" => "2025-05-11T04:30:00.000Z",
        ],
        [
            "start_at" => "2025-05-11T05:30:00.000Z",
            "end_at" => "2025-05-11T07:30:00.000Z",
        ]
    ];

    private $tasks = ['Team Meeting', 'Development', 'Testing', 'Presentation', 'Deployment', 'Designing'];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => Arr::random($this->tasks),
            'start_at' => Carbon::parse(Arr::random($this->times)["start_at"]),
            'end_at' => Carbon::parse(Arr::random($this->times)["end_at"]),
            'is_all_day' => false,
            'employee_id' => DB::table('employees')->inRandomOrder()->value('id')
        ];
    }
}
