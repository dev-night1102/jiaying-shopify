<?php

namespace App\Policies;

use App\Models\Chat;
use App\Models\User;

class ChatPolicy
{
    public function view(User $user, Chat $chat): bool
    {
        return $user->isAdmin() || $user->id === $chat->user_id;
    }

    public function update(User $user, Chat $chat): bool
    {
        return $user->isAdmin() || $user->id === $chat->user_id;
    }
}