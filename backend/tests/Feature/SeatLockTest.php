<?php

namespace Tests\Feature;

use App\Models\Seat;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Redis;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class SeatLockTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Clear redis map for testing
        Redis::del('map_state');
    }

    public function test_user_can_view_seats()
    {
        Seat::factory()->count(5)->create(['status' => 'AVAILABLE']);

        $response = $this->getJson('/api/seats');

        $response->assertStatus(200)
                 ->assertJsonCount(5);
    }

    public function test_authenticated_user_can_purchase_locked_seat()
    {
        $user = User::factory()->create();
        $token = JWTAuth::fromUser($user);
        $seat = Seat::factory()->create(['status' => 'AVAILABLE', 'price' => 100]);

        // Manually lock in Redis
        Redis::set("locks:{$seat->id}", $user->id, 'EX', 600);
        Redis::hset("map_state", $seat->id, json_encode(['status' => 'LOCKED', 'u' => $user->id, 'ts' => now()->timestamp]));

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->postJson("/api/seats/{$seat->id}/purchase", [
                             'transaction_id' => 'TXN_TEST_123'
                         ]);

        $response->assertStatus(200)
                 ->assertJsonPath('message', 'Purchase successful');

        $this->assertDatabaseHas('sales', [
            'seat_id' => $seat->id,
            'user_id' => $user->id,
            'transaction_id' => 'TXN_TEST_123'
        ]);

        $this->assertDatabaseHas('seats', [
            'id' => $seat->id,
            'status' => 'SOLD'
        ]);

        $this->assertDatabaseHas('outbox_events', [
            'event_type' => 'seat.sold'
        ]);
    }

    public function test_user_cannot_purchase_seat_locked_by_others()
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();
        $tokenB = JWTAuth::fromUser($userB);
        $seat = Seat::factory()->create(['status' => 'AVAILABLE']);

        // Lock by User A
        Redis::set("locks:{$seat->id}", $userA->id, 'EX', 600);

        $response = $this->withHeader('Authorization', "Bearer $tokenB")
                         ->postJson("/api/seats/{$seat->id}/purchase", [
                             'transaction_id' => 'TXN_MALICIOUS'
                         ]);

        $response->assertStatus(403);
    }
}
