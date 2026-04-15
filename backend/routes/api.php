<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\SeatController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\EventController;
use Illuminate\Support\Facades\Route;

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::get('events', [EventController::class, 'index']);
Route::get('events/{id}', [EventController::class, 'show']);
Route::get('debug-db', function() {
    return response()->json([
        'events' => \App\Models\Event::count(),
        'categories' => \App\Models\SeatCategory::count(),
        'seats' => \App\Models\Seat::count(),
        'first_event' => \App\Models\Event::first(),
        'seats_sample' => \App\Models\Seat::limit(5)->get(),
    ]);
});
Route::get('repair-db', function() {
    try {
        // Clean up everything to start fresh
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        \App\Models\Seat::truncate();
        \App\Models\SeatCategory::truncate();
        \App\Models\Event::truncate();
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Run the seeder logic directly
        $seeder = new \Database\Seeders\EventSeeder();
        $seeder->run();

        return response()->json(['message' => 'DB repaired and seeded successfully']);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});
Route::post('events', [EventController::class, 'store']);
Route::put('events/{id}', [EventController::class, 'update']);
Route::delete('events/{id}', [EventController::class, 'destroy']);

Route::group(['middleware' => 'api'], function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('me', [AuthController::class, 'getAuthenticatedUser']);
    Route::post('purchase', [PurchaseController::class, 'store']);
    Route::get('tickets', [PurchaseController::class, 'index']);
});

Route::get('seats', [SeatController::class, 'index']);
