<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $commonUsers = [
            [
                'name' => 'John Smith',
                'email' => 'john@example.com',
                'password' => Hash::make('password'),
                'role' => 'user',
                'balance' => 150.00,
                'language' => 'en',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Sarah Johnson',
                'email' => 'sarah@example.com',
                'password' => Hash::make('password'),
                'role' => 'user',
                'balance' => 200.00,
                'language' => 'en',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Mike Chen',
                'email' => 'mike@example.com',
                'password' => Hash::make('password'),
                'role' => 'user',
                'balance' => 75.00,
                'language' => 'en',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Emma Wilson',
                'email' => 'emma@example.com',
                'password' => Hash::make('password'),
                'role' => 'user',
                'balance' => 300.00,
                'language' => 'en',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'David Brown',
                'email' => 'david@example.com',
                'password' => Hash::make('password'),
                'role' => 'user',
                'balance' => 120.00,
                'language' => 'en',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Lisa Garcia',
                'email' => 'lisa@example.com',
                'password' => Hash::make('password'),
                'role' => 'user',
                'balance' => 80.00,
                'language' => 'zh',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'James Miller',
                'email' => 'james@example.com',
                'password' => Hash::make('password'),
                'role' => 'user',
                'balance' => 250.00,
                'language' => 'en',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Anna Taylor',
                'email' => 'anna@example.com',
                'password' => Hash::make('password'),
                'role' => 'user',
                'balance' => 90.00,
                'language' => 'en',
                'email_verified_at' => now(),
            ]
        ];

        foreach ($commonUsers as $userData) {
            // Only create if user doesn't already exist
            if (!User::where('email', $userData['email'])->exists()) {
                User::create($userData);
                $this->command->info("Created user: {$userData['name']} ({$userData['email']})");
            } else {
                $this->command->info("User already exists: {$userData['email']}");
            }
        }

        $this->command->info('Common users seeded successfully!');
        $this->command->info('All users use password: password');
    }
}