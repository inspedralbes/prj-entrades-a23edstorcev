<?php

namespace App\Console\Commands;

use App\Models\OutboxEvent;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Redis;

class ProcessOutbox extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'outbox:process {--realtime : Whether to keep running}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process the Transactional Outbox and publish to Redis';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting Outbox Processor...');

        do {
            $events = OutboxEvent::whereNull('processed_at')
                ->orderBy('created_at', 'asc')
                ->limit(100)
                ->get();

            if ($events->isEmpty()) {
                if ($this->option('realtime')) {
                    usleep(100000); // Wait 100ms
                    continue;
                }
                break;
            }

            foreach ($events as $event) {
                try {
                    $JSON_PAYLOAD = json_encode([
                        'type' => $event->event_type,
                        'payload' => $event->payload
                    ]);
                    
                    $this->info("Publishing to Redis: " . $JSON_PAYLOAD);
                    
                    // Publish to Redis channel 'seat_updates'
                    Redis::publish('seat_updates', $JSON_PAYLOAD);

                    $event->update(['processed_at' => now()]);
                    $this->line("Processed: {$event->event_type} (ID: {$event->id})");
                } catch (\Exception $e) {
                    $this->error("CRITICAL ERROR in Outbox: " . $e->getMessage());
                }
            }
        } while ($this->option('realtime'));

        $this->info('Outbox processing finished.');
    }
}
