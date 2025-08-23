import RealtimeChat from './RealtimeChat';

export default function ChatShow({ auth, chat, messages = [], isAdmin = false }) {
    return (
        <RealtimeChat 
            auth={auth}
            chat={chat}
            messages={messages}
            isAdmin={isAdmin}
        />
    );
}