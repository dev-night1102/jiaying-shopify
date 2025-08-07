import WhatsAppChat from './WhatsAppChat';

export default function ChatShow({ auth, chat, messages = [], isAdmin = false }) {
    return (
        <WhatsAppChat 
            auth={auth}
            chat={chat}
            messages={messages}
            isAdmin={isAdmin}
        />
    );
}