<?php

namespace App\Services;

use App\Models\Chat;
use App\Models\Message;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ChatService
{
    public function createChat(User $user, ?Order $order = null): Chat
    {
        return Chat::create([
            'user_id' => $user->id,
            'order_id' => $order?->id,
            'status' => 'active',
        ]);
    }

    public function findOrCreateChat(User $user, ?Order $order = null): Chat
    {
        $query = Chat::where('user_id', $user->id)
            ->where('status', 'active');

        if ($order) {
            $query->where('order_id', $order->id);
        } else {
            $query->whereNull('order_id');
        }

        return $query->first() ?? $this->createChat($user, $order);
    }

    public function sendMessage(Chat $chat, User $sender, string $content, string $type = 'text', ?UploadedFile $image = null): Message
    {
        $messageData = [
            'chat_id' => $chat->id,
            'sender_id' => $sender->id,
            'content' => $content,
            'type' => $type,
        ];

        if ($image && $type === 'image') {
            $path = $image->store('messages/' . $chat->id, 'public');
            $messageData['image_path'] = $path;
        }

        $message = Message::create($messageData);

        $chat->update(['last_message_at' => now()]);

        return $message;
    }

    public function markMessagesAsRead(Chat $chat, User $reader): void
    {
        $chat->markAsRead($reader->id);
    }

    public function closeChat(Chat $chat): void
    {
        $chat->update(['status' => 'closed']);
    }

    public function getUnreadCount(User $user): int
    {
        return Message::whereHas('chat', function ($query) use ($user) {
            if ($user->isAdmin()) {
                $query->where('status', 'active');
            } else {
                $query->where('user_id', $user->id);
            }
        })
        ->where('sender_id', '!=', $user->id)
        ->where('is_read', false)
        ->count();
    }
}