<?php

namespace Database\Factories;

use App\Models\Seat;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class SeatFactory extends Factory
{
    protected $model = Seat::class;

    public function definition(): array
    {
        return [
            'id' => Str::uuid(),
            'section' => $this->faker->word(),
            'row' => $this->faker->numberBetween(1, 20),
            'number' => $this->faker->numberBetween(1, 50),
            'status' => 'AVAILABLE',
            'x' => $this->faker->randomFloat(2, 0, 800),
            'y' => $this->faker->randomFloat(2, 0, 600),
            'price' => $this->faker->randomFloat(2, 10, 200),
        ];
    }
}
