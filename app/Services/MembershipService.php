<?php

namespace App\Services;

use App\Models\Membership;
use App\Models\User;
use Carbon\Carbon;

class MembershipService
{
    public function createTrialMembership(User $user): Membership
    {
        $existingTrial = $user->memberships()->where('type', 'trial')->first();
        
        if ($existingTrial) {
            throw new \Exception('User has already used their trial membership');
        }

        return $user->memberships()->create([
            'type' => 'trial',
            'status' => 'active',
            'started_at' => now(),
            'expires_at' => now()->addDays(30),
        ]);
    }

    public function createPaidMembership(User $user, string $paymentReference): Membership
    {
        $currentMembership = $user->activeMembership;
        
        $startDate = $currentMembership && $currentMembership->expires_at->isFuture() 
            ? $currentMembership->expires_at 
            : now();

        return $user->memberships()->create([
            'type' => 'paid',
            'status' => 'active',
            'started_at' => $startDate,
            'expires_at' => $startDate->copy()->addMonth(),
            'amount_paid' => 9.9,
            'payment_reference' => $paymentReference,
        ]);
    }

    public function checkAndExpireMemberships(): int
    {
        return Membership::where('status', 'active')
            ->where('expires_at', '<=', now())
            ->update(['status' => 'expired']);
    }

    public function cancelMembership(Membership $membership): void
    {
        $membership->update(['status' => 'cancelled']);
    }
}