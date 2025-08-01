<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Chat;
use App\Models\Order;
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
        $chats = $request->user()->chats()
            ->with(['order', 'lastMessage'])
            ->withCount('unreadMessages')
            ->where('status', 'active')
            ->latest('last_message_at')
            ->paginate(20);

        return Inertia::render('Chat/Index', [
            'chats' => $chats,
        ]);
    }

    public function show(Chat $chat): Response
    {
        $this->authorize('view', $chat);

        $this->chatService->markMessagesAsRead($chat, auth()->user());

        $messages = $chat->messages()
            ->with('sender:id,name,role')
            ->latest()
            ->paginate(50);

        return Inertia::render('Chat/Show', [
            'chat' => $chat->load(['order', 'user']),
            'messages' => $messages,
        ]);
    }

    public function create(Request $request): Response
    {
        $orderId = $request->query('order_id');
        $order = $orderId ? Order::findOrFail($orderId) : null;

        if ($order) {
            $this->authorize('view', $order);
        }

        return Inertia::render('Chat/Create', [
            'order' => $order,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'nullable|exists:orders,id',
            'message' => 'required|string|max:1000',
        ]);

        $order = $validated['order_id'] ? Order::find($validated['order_id']) : null;

        if ($order) {
            $this->authorize('view', $order);
        }

        $chat = $this->chatService->findOrCreateChat($request->user(), $order);
        
        $this->chatService->sendMessage(
            $chat,
            $request->user(),
            $validated['message']
        );

        return redirect()->route('chats.show', $chat);
    }

    public function sendMessage(Request $request, Chat $chat)
    {
        $this->authorize('view', $chat);

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
}