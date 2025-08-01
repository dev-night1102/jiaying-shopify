<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Chat;
use App\Services\ChatService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ChatController extends Controller
{
    private ChatService $chatService;

    public function __construct(ChatService $chatService)
    {
        $this->chatService = $chatService;
    }

    public function index(Request $request): Response
    {
        $chats = Chat::with(['user', 'order', 'lastMessage'])
            ->withCount('unreadMessages')
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->search, function ($query, $search) {
                $query->whereHas('user', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->latest('last_message_at')
            ->paginate(20);

        return Inertia::render('Admin/Chats/Index', [
            'chats' => $chats,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function show(Chat $chat): Response
    {
        $this->chatService->markMessagesAsRead($chat, auth()->user());

        $messages = $chat->messages()
            ->with('sender:id,name')
            ->orderBy('created_at', 'asc')
            ->get();

        return Inertia::render('Admin/Chats/Show', [
            'chat' => $chat->load(['user', 'order']),
            'messages' => $messages,
        ]);
    }

    public function sendMessage(Request $request, Chat $chat)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:1000',
            'image' => 'nullable|image|max:5120',
        ]);

        $message = $this->chatService->sendMessage(
            $chat,
            $request->user(),
            $validated['content'],
            $validated['image'] ? 'image' : 'text',
            $validated['image'] ?? null
        );

        return back();
    }

    public function close(Chat $chat)
    {
        $this->chatService->closeChat($chat);

        return back()->with('success', 'Chat closed successfully!');
    }
}