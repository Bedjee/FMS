<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

use App\Services\FinancialService;
use App\Services\InventoryService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
   public function register(): void
{
    $this->app->singleton(InventoryService::class, function ($app) {
        return new InventoryService();
    });

     $this->app->singleton(FinancialService::class, function () {
        return new FinancialService();
    });
}

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
    }
}
