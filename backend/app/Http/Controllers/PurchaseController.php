<?php

namespace App\Http\Controllers;

use App\Models\OutboxEvent;
use App\Models\Sale;
use App\Models\Seat;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PurchaseController extends Controller
{
    public function index()
    {
        $user = auth('api')->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $sales = Sale::where('user_id', $user->id)
            ->with(['seat.seatCategory.event', 'ticket'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($sales);
    }

    public function store(Request $request)
    {
        $request->validate([
            'seat_ids' => 'required|array|min:1',
            'seat_ids.*' => 'exists:seats,id',
        ]);

        $user = auth('api')->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }


        $seatIds = $request->input('seat_ids');

        try {
            return DB::transaction(function () use ($seatIds, $user) {
                $processedSales = [];
                
                foreach ($seatIds as $seatId) {
                    // Lock the seat row for update
                    $seat = Seat::where('id', $seatId)
                        ->where('status', '!=', 'SOLD')
                        ->lockForUpdate()
                        ->first();

                    if (!$seat) {
                        throw new \Exception("Seat {$seatId} is already sold or unavailable");
                    }

                    // Create Sale record
                    $sale = Sale::create([
                        'id' => Str::uuid(),
                        'seat_id' => $seatId,
                        'user_id' => $user->id,
                        'transaction_id' => Str::uuid(), 
                        'amount' => $seat->price,
                    ]);

                    // Create Ticket record
                    Ticket::create([
                        'id' => Str::uuid(),
                        'sale_id' => $sale->id,
                        'ticket_code' => 'TKT-' . strtoupper(Str::random(8)),
                    ]);

                    // Update Seat status
                    $seat->update(['status' => 'SOLD']);

                    // Create Outbox Event
                    OutboxEvent::create([
                        'event_type' => 'seat.sold',
                        'payload' => [
                            'id' => $seatId,
                            'event_id' => $seat->seatCategory->event_id,
                            'status' => 'SOLD',
                            'u' => $user->id,
                            'user_name' => $user->name, // Nombre para el Activity Feed
                            'ts' => now()->timestamp,
                        ],
                    ]);                    
                    $processedSales[] = $sale;
                }

                return response()->json([
                    'message' => 'Purchase successful',
                    'sales' => $processedSales,
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }
}
