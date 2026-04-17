<?php

namespace App\Http\Controllers;

use App\Models\Seat;
use Illuminate\Http\Request;

class SeatController extends Controller
{
    public function index(Request $request)
    {
        $eventId = $request->input('event_id');
        
        if (!$eventId) {
            return response()->json(['error' => 'event_id is required'], 400);
        }

        $category = \App\Models\SeatCategory::where('event_id', $eventId)->first();
        if (!$category) {
            $category = \App\Models\SeatCategory::create([
                'id' => \Illuminate\Support\Str::uuid(),
                'event_id' => $eventId,
                'name' => 'General Admission',
                'price' => 50.00
            ]);
        }

        // Force exactly 40 seats for consistent UI
        $currentCount = Seat::whereHas('seatCategory', function($q) use ($eventId) {
            $q->where('event_id', $eventId);
        })->count();

        if ($currentCount !== 40) {
            // Delete corrupt/old seats for this event
            Seat::whereHas('seatCategory', function($q) use ($eventId) {
                $q->where('event_id', $eventId);
            })->delete();

            $seatsToCreate = [];
            $seatNumber = 1;
            for ($row = 1; $row <= 4; $row++) {
                for ($col = 1; $col <= 10; $col++) {
                    $seatsToCreate[] = [
                        'id' => \Illuminate\Support\Str::uuid(),
                        'seat_category_id' => $category->id,
                        'section' => 'Main',
                        'row' => $row,
                        'number' => $seatNumber++, // 1 to 40
                        'status' => 'AVAILABLE',
                        'x' => $col * 40,
                        'y' => $row * 40,
                        'price' => $category->price,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }
            Seat::insert($seatsToCreate);
        }

        $seats = Seat::whereHas('seatCategory', function($q) use ($eventId) {
            $q->where('event_id', $eventId);
        })->orderBy('number', 'asc')->get();

        // MERGE REAL-TIME STATE FROM NODE.JS
        try {
            $client = new \GuzzleHttp\Client(['timeout' => 2]);
            $response = $client->get("http://realtime:3000/rt-api/map-state/{$eventId}");
            $liveState = json_decode($response->getBody()->getContents(), true);

            foreach ($seats as $seat) {
                // Si el seient ja està venut a la DB, ignorem qualsevol bloqueig temporal de Redis
                if ($seat->status === 'SOLD') {
                    continue;
                }

                if (isset($liveState[$seat->id])) {
                    $state = json_decode($liveState[$seat->id], true);
                    $seat->status = $state['status'];
                    $seat->u = $state['u'] ?? null;
                }
            }
        } catch (\Exception $e) {
            // If Node.js is unavailable, we just serve DB state
            \Illuminate\Support\Facades\Log::warning("Could not fetch live state from Node.js: " . $e->getMessage());
        }

        return response()->json($seats);
    }
}
