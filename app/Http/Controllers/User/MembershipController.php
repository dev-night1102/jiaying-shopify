<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Services\MembershipService;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MembershipController extends Controller
{
    private MembershipService $membershipService;
    private PaymentService $paymentService;

    public function __construct(MembershipService $membershipService, PaymentService $paymentService)
    {
        $this->membershipService = $membershipService;
        $this->paymentService = $paymentService;
    }

    public function index(Request $request): Response
    {
        $user = $request->user();
        
        return Inertia::render('Membership/Index', [
            'membership' => $user->activeMembership,
            'membershipHistory' => $user->memberships()->latest()->get(),
            'hasUsedTrial' => $user->memberships()->where('type', 'trial')->exists(),
        ]);
    }

    public function plans(): Response
    {
        return Inertia::render('Membership/Plans', [
            'hasUsedTrial' => auth()->user()->memberships()->where('type', 'trial')->exists(),
            'currentMembership' => auth()->user()->activeMembership,
        ]);
    }

    public function subscribe(Request $request)
    {
        $validated = $request->validate([
            'payment_method' => 'required|string',
        ]);

        try {
            $payment = $this->paymentService->processMembershipPayment(
                $request->user(),
                $validated
            );

            return redirect()->route('membership.index')
                ->with('success', 'Membership activated successfully!');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}