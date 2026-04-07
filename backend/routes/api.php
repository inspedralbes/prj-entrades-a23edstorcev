<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\SeatController;
use Illuminate\Support\Facades\Route;

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::group(['middleware' => 'api'], function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('me', [AuthController::class, 'getAuthenticatedUser']);
});

Route::get('seats', [SeatController::class, 'index']);
