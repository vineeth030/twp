<?php

namespace Database\Factories;

use Illuminate\Support\Arr;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Employee>
 */
class EmployeeFactory extends Factory
{
    private $designations = ['Software Engineer', 'Designer', 'Tester'];
    private $colors = ['#bbdc00', '#9e5fff', '#dc4900', '#03c2fc', '#232936', '#eb03fc'];
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'designation' => Arr::random($this->designations),
            'color' => Arr::random($this->colors)
        ];
    }
}
