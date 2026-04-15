<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Event;
use App\Models\SeatCategory;
use App\Models\Seat;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class TestSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Crear Usuario de Test Estándar
        User::updateOrCreate(
            ['email' => 'test@example.com'],
            [
                'id' => (string) Str::uuid(),
                'name' => 'Test User',
                'password' => Hash::make('password'),
            ]
        );

        // 2. Crear Admin
        User::updateOrCreate(
            ['email' => 'admin@admin.com'],
            [
                'id' => (string) Str::uuid(),
                'name' => 'Admin Sistema',
                'password' => Hash::make('password'),
                'is_admin' => true,
            ]
        );

        // 3. Crear Eventos y Asientos (40 por evento)
        $events = [
            [
                'name' => 'CYBERPUNK RHYTHMS 2026',
                'description' => 'La convergència digital definitiva. Tecnologia, so i visió en una experiència multisensorial sense precedents.',
                'date' => '2026-06-15 21:00:00',
                'location' => 'Neon Arena, Barcelona',
            ],
            [
                'name' => 'SYNTHWAVE DREAMS',
                'description' => 'Un viatge retro-futurista a través dels sintetitzadors i les llums de neó.',
                'date' => '2026-07-20 22:30:00',
                'location' => 'Digital Plaza, Madrid',
            ]
        ];

        $now = now()->format('Y-m-d H:i:s');

        foreach ($events as $eventData) {
            $event = Event::updateOrCreate(
                ['name' => $eventData['name']],
                [
                    'description' => $eventData['description'],
                    'date' => $eventData['date'],
                    'location' => $eventData['location'],
                ]
            );

            $category = SeatCategory::updateOrCreate(
                ['event_id' => $event->id, 'name' => 'General'],
                ['price' => 50.00]
            );

            if ($category->seats()->count() === 0) {
                $seatsToCreate = [];
                $seatNumber = 1;
                for ($row = 1; $row <= 4; $row++) {
                    for ($col = 1; $col <= 10; $col++) {
                        $seatsToCreate[] = [
                            'id' => (string) Str::uuid(),
                            'seat_category_id' => $category->id,
                            'section' => 'Main',
                            'row' => $row,
                            'number' => $seatNumber++,
                            'status' => 'AVAILABLE',
                            'x' => $col * 40,
                            'y' => $row * 40,
                            'price' => 50.00,
                            'created_at' => $now,
                            'updated_at' => $now,
                        ];
                    }
                }
                Seat::insert($seatsToCreate);
            }
        }
    }
}
