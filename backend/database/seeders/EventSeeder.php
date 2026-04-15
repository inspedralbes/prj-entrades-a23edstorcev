<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\SeatCategory;
use App\Models\Seat;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        $events = [
            [
                'name' => 'CYBERPUNK RHYTHMS 2026',
                'description' => 'La convergència digital definitiva. Tecnologia, so i visió en una experiència multisensorial sense precedents.',
                'date' => '2026-06-15 21:00:00',
                'location' => 'Neon Arena, Barcelona',
                'categories' => [
                    ['name' => 'VIP Front Stage', 'price' => 120.00, 'rows' => 5, 'cols' => 10],
                    ['name' => 'General Floor', 'price' => 65.00, 'rows' => 10, 'cols' => 15],
                    ['name' => 'Balcony', 'price' => 45.00, 'rows' => 8, 'cols' => 12],
                ]
            ],
            [
                'name' => 'SYNTHWAVE DREAMS',
                'description' => 'Un viatge retro-futurista a través dels sintetitzadors i les llums de neó.',
                'date' => '2026-07-20 22:30:00',
                'location' => 'Digital Plaza, Madrid',
                'categories' => [
                    ['name' => 'Standard Admission', 'price' => 35.00, 'rows' => 12, 'cols' => 12],
                ]
            ],
            [
                'name' => 'BATEIG NEÓ 2026',
                'description' => 'L\'esdeveniment inaugural de la temporada. Una nit on el so i el color es fusionen.',
                'date' => '2026-05-10 20:00:00',
                'location' => 'Virtual Stadium, Valencia',
                'categories' => [
                    ['name' => 'Golden Circle', 'price' => 150.00, 'rows' => 4, 'cols' => 10],
                    ['name' => 'Side Stands', 'price' => 55.00, 'rows' => 15, 'cols' => 10],
                ]
            ],
            [
                'name' => 'ELECTRO PULSE',
                'description' => 'Sent el pols de la ciutat amb el millor de l\'electrònica underground.',
                'date' => '2026-08-05 23:00:00',
                'location' => 'The Underground, Bilbao',
                'categories' => [
                    ['name' => 'Main Floor', 'price' => 40.00, 'rows' => 20, 'cols' => 20],
                ]
            ]
        ];

        foreach ($events as $eventData) {
            $event = Event::create([
                'id' => Str::uuid(),
                'name' => $eventData['name'],
                'description' => $eventData['description'],
                'date' => $eventData['date'],
                'location' => $eventData['location'],
            ]);

            foreach ($eventData['categories'] as $catData) {
                $category = SeatCategory::create([
                    'id' => Str::uuid(),
                    'event_id' => $event->id,
                    'name' => $catData['name'],
                    'price' => $catData['price'],
                ]);

                // Create seats for this category
                for ($row = 1; $row <= $catData['rows']; $row++) {
                    for ($col = 1; $col <= $catData['cols']; $col++) {
                        Seat::create([
                            'id' => Str::uuid(),
                            'seat_category_id' => $category->id,
                            'section' => $catData['name'],
                            'row' => $row,
                            'number' => $col,
                            'status' => 'AVAILABLE',
                            'x' => $col * 40, // Visual coordinate
                            'y' => $row * 40, // Visual coordinate
                            'price' => $catData['price'],
                        ]);
                    }
                }
            }
        }
    }
}
