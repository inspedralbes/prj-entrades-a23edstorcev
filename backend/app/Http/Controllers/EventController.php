<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class EventController extends Controller
{
    public function index()
    {
        try {
            return response()->json(Event::all());
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'required|date|after_or_equal:today',
            'dates' => 'nullable|string',
            'location' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('events', 'public');
            $validated['image_path'] = $path;
        }

        if (isset($validated['dates'])) {
            $validated['dates'] = json_decode($validated['dates'], true);
        }

        try {
            return DB::transaction(function() use ($validated) {
                $event = Event::create($validated);

                // Crear categoría y asientos por defecto
                $category = \App\Models\SeatCategory::create([
                    'id' => (string) Str::uuid(),
                    'event_id' => $event->id,
                    'name' => 'General Admission',
                    'price' => 50.00
                ]);

                $seatsToCreate = [];
                for ($i = 1; $i <= 40; $i++) {
                    $seatsToCreate[] = [
                        'id' => (string) Str::uuid(),
                        'seat_category_id' => $category->id,
                        'section' => 'Main',
                        'row' => (int) ceil($i / 10),
                        'number' => $i,
                        'status' => 'AVAILABLE',
                        'x' => (($i - 1) % 10) * 40,
                        'y' => (int) ceil($i / 10) * 40,
                        'price' => 50.00,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
                \App\Models\Seat::insert($seatsToCreate);

                return response()->json($event, 201);
            });
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $event = Event::with('seatCategories')->find($id);
        if (!$event) {
            return response()->json(['error' => 'Event not found'], 404);
        }
        return response()->json($event);
    }

    public function update(Request $request, $id)
    {
        \Illuminate\Support\Facades\Log::info('Update request received', ['id' => $id, 'all' => $request->all(), 'files' => $request->allFiles()]);
        
        $event = Event::find($id);
        if (!$event) return response()->json(['error' => 'Event not found'], 404);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'sometimes|required|date', // Eliminada la restricción de fecha futura para permitir editar eventos pasados
            'dates' => 'nullable|string',
            'location' => 'sometimes|required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('image')) {
            \Illuminate\Support\Facades\Log::info('Image found in request');
            // Borrar imagen antigua si existe
            if ($event->image_path) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($event->image_path);
            }
            $path = $request->file('image')->store('events', 'public');
            $validated['image_path'] = $path;
            \Illuminate\Support\Facades\Log::info('New image stored at: ' . $path);
        }

        if (isset($validated['dates'])) {
            $validated['dates'] = json_decode($validated['dates'], true);
        }

        // Eliminamos 'image' del array de datos para evitar que Laravel busque una columna que no existe
        unset($validated['image']);

        $event->update($validated);
        \Illuminate\Support\Facades\Log::info('Event updated successfully', ['event' => $event->toArray()]);
        return response()->json($event);
    }

    public function destroy($id)
    {
        $event = Event::find($id);
        if (!$event) return response()->json(['error' => 'Event not found'], 404);
        $event->delete();
        return response()->json(['message' => 'Event deleted successfully']);
    }
}
