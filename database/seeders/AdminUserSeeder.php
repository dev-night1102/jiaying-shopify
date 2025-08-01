<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@shopify.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'balance' => 0.00,
            'language' => 'en',
            'email_verified_at' => now(),
        ]);

        // Create test admin user with different credentials
        User::create([
            'name' => 'Test Admin',
            'email' => 'test.admin@shopify.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'balance' => 100.00,
            'language' => 'en',
            'email_verified_at' => now(),
        ]);

        // Create a regular test user for comparison
        User::create([
            'name' => 'Test User',
            'email' => 'user@shopify.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'balance' => 50.00,
            'language' => 'en',
            'email_verified_at' => now(),
        ]);

        $this->command->info('Admin users created successfully!');
        $this->command->info('Admin User: admin@shopify.com (password: password)');
        $this->command->info('Test Admin: test.admin@shopify.com (password: admin123)');
        $this->command->info('Regular User: user@shopify.com (password: password)');
    }
}