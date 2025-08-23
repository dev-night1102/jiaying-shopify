<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use App\Models\Message;
use App\Models\Order;
use App\Events\MessageSent;
use App\Events\UserTyping;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ChatController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        $chats = Chat::with(['lastMessage.sender', 'order', 'user'])
            ->where(function ($query) use ($user) {
                if ($user->isAdmin()) {
                    // Admin sees all chats
                    $query->whereHas('messages');
                } else {
                    // User sees only their chats
                    $query->where('user_id', $user->id);
                }
            })
            ->orderBy('last_message_at', 'desc')
            ->get();

        return Inertia::render('Chat/Index', [
            'chats' => $chats,
            'isAdmin' => $user->isAdmin(),
        ]);
    }

    public function show(Request $request, Chat $chat)
    {
        $user = $request->user();
        
        // Check permissions
        if (!$user->isAdmin() && $chat->user_id !== $user->id) {
            abort(403);
        }

        // Load messages with sender info
        $messages = $chat->messages()
            ->with('sender')
            ->orderBy('created_at', 'asc')
            ->get();

        // Mark messages as read
        $chat->markAsRead($user->id);

        return Inertia::render('Chat/Show', [
            'chat' => $chat->load(['user', 'order']),
            'messages' => $messages,
            'isAdmin' => $user->isAdmin(),
        ]);
    }

    public function create(Request $request)
    {
        $user = $request->user();
        
        // Only non-admin users can create new chats (through orders)
        if ($user->isAdmin()) {
            return redirect()->route('admin.chats.index');
        }

        // Get user's orders to choose from
        $orders = Order::where('user_id', $user->id)
            ->whereDoesntHave('chats')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Chats/Create', [
            'orders' => $orders
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'content' => 'required|string|max:1000',
            'type' => 'in:text,image',
            'image' => 'nullable|image|max:2048',
        ]);

        $user = $request->user();
        $order = Order::findOrFail($request->order_id);

        // Check permissions
        if (!$user->isAdmin() && $order->user_id !== $user->id) {
            abort(403);
        }

        // Find or create chat for this order
        $chat = Chat::firstOrCreate(
            ['order_id' => $request->order_id],
            [
                'user_id' => $order->user_id,
                'status' => 'active',
                'last_message_at' => now(),
            ]
        );

        // Handle image upload
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('chat-images', 'public');
        }

        // Create message
        $message = Message::create([
            'chat_id' => $chat->id,
            'sender_id' => $user->id,
            'content' => $request->content,
            'type' => $request->type ?? 'text',
            'image_path' => $imagePath,
            'is_read' => false,
        ]);

        // Update chat last message time
        $chat->update(['last_message_at' => now()]);

        // Redirect to the chat page after creation
        return redirect()->route('chats.show', $chat)->with('success', 'Chat started successfully!');
    }

    public function send(Request $request, Chat $chat)
    {
        $request->validate([
            'content' => 'nullable|string|max:1000',
            'type' => 'nullable|in:text,file',
            'files.*' => 'nullable|file|max:10240|mimes:jpg,jpeg,png,gif,pdf,doc,docx',
        ]);

        $user = $request->user();

        // Check permissions
        if (!$user->isAdmin() && $chat->user_id !== $user->id) {
            abort(403);
        }

        // Handle file uploads
        $filePath = null;
        if ($request->hasFile('files')) {
            $files = $request->file('files');
            if (is_array($files) && count($files) > 0) {
                $file = $files[0]; // Take first file for now
                $filePath = $file->store('chat-files', 'public');
            } elseif (!is_array($files)) {
                // Single file upload
                $filePath = $files->store('chat-files', 'public');
            }
        }

        // Only create message if there's content or file
        if ($request->filled('content') || $filePath) {
            // Determine message type - use 'image' for files since 'file' might not exist in enum
            $messageType = 'text';
            if ($filePath) {
                // Check if it's an image file
                $isImage = preg_match('/\.(jpg|jpeg|png|gif)$/i', $filePath);
                $messageType = $isImage ? 'image' : 'text'; // Fallback to text if file type not supported
            }
            
            // Create message - use image_path since that's what exists in DB
            $message = Message::create([
                'chat_id' => $chat->id,
                'sender_id' => $user->id,
                'content' => $request->content ?? '',
                'type' => $messageType,
                'image_path' => $filePath,
                'is_read' => false,
            ]);

            // Broadcast the message
            broadcast(new MessageSent($message, $user))->toOthers();
        } else {
            return back()->withErrors(['message' => 'Message content or file required']);
        }

        // Update chat last message time
        $chat->update(['last_message_at' => now()]);

        return back();
    }

    public function typing(Request $request, Chat $chat)
    {
        $user = $request->user();

        // Check permissions
        if (!$user->isAdmin() && $chat->user_id !== $user->id) {
            abort(403);
        }

        $isTyping = $request->input('is_typing', true);

        // Broadcast typing indicator
        broadcast(new UserTyping($chat, $user, $isTyping))->toOthers();

        return response()->json(['status' => 'typing']);
    }
}