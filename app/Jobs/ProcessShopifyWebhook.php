<?php

namespace App\Jobs;

use App\Http\Controllers\ShopifyController;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessShopifyWebhook implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 120;
    public $tries = 3;

    protected $topic;
    protected $data;

    /**
     * Create a new job instance.
     */
    public function __construct(string $topic, array $data)
    {
        $this->topic = $topic;
        $this->data = $data;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Log::info('Processing Shopify webhook', [
            'topic' => $this->topic,
            'order_id' => $this->data['id'] ?? null
        ]);

        $controller = app(ShopifyController::class);

        try {
            match($this->topic) {
                'orders/create' => $controller->processOrderCreated($this->data),
                'orders/paid' => $controller->processOrderPaid($this->data),
                'orders/cancelled' => $controller->processOrderCancelled($this->data),
                'refunds/create' => $controller->processRefundCreated($this->data),
                'checkouts/create' => $controller->processCheckoutCreated($this->data),
                'checkouts/update' => $controller->processCheckoutUpdated($this->data),
                default => Log::info('Unhandled webhook topic', ['topic' => $this->topic])
            };

            Log::info('Shopify webhook processed successfully', [
                'topic' => $this->topic,
                'order_id' => $this->data['id'] ?? null
            ]);

        } catch (\Exception $e) {
            Log::error('Shopify webhook processing failed', [
                'topic' => $this->topic,
                'order_id' => $this->data['id'] ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // Re-throw to trigger retry mechanism
            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Shopify webhook job failed permanently', [
            'topic' => $this->topic,
            'order_id' => $this->data['id'] ?? null,
            'error' => $exception->getMessage()
        ]);
    }
}
