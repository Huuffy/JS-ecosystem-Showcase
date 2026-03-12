// AI Chatbot Component with backend integration
function ChatBot() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [loading, setLoading] = useState(true);

    // Load chat history from backend
    useEffect(() => {
        fetch('http://localhost:5000/api/chatbot')
            .then(res => res.json())
            .then(data => {
                if (data.length === 0) {
                    // Add welcome message if no chat history
                    const welcomeMessage = {
                        id: 1,
                        text: "Hello! I'm your AI support assistant. I can help you with common issues, guide you through processes, or escalate complex problems to human agents. How can I assist you today?",
                        sender: 'bot',
                        timestamp: new Date(),
                        type: 'welcome'
                    };
                    setMessages([welcomeMessage]);
                } else {
                    setMessages(data);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error loading chat history:', error);
                setLoading(false);
            });
    }, []);

    // Simulated AI responses based on keywords
    const generateBotResponse = (userMessage) => {
        const message = userMessage.toLowerCase();
        
        // Knowledge base responses
        if (message.includes('password') || message.includes('login')) {
            return {
                text: "I can help you with password and login issues. Here are some common solutions:\n\n1. Try resetting your password using the 'Forgot Password' link\n2. Clear your browser cache and cookies\n3. Check if Caps Lock is enabled\n4. Try using an incognito/private browser window\n\nWould you like me to create a support ticket for further assistance?",
                type: 'solution',
                actions: ['Create Ticket', 'More Help']
            };
        }
        
        if (message.includes('email') || message.includes('notification')) {
            return {
                text: "For email and notification issues:\n\n1. Check your spam/junk folder\n2. Verify your email address in account settings\n3. Check notification preferences\n4. Whitelist our domain in your email client\n\nShall I escalate this to our technical team?",
                type: 'solution',
                actions: ['Escalate', 'Check Settings']
            };
        }
        
        if (message.includes('slow') || message.includes('performance') || message.includes('loading')) {
            return {
                text: "Performance issues can be frustrating. Let's try these steps:\n\n1. Refresh the page (Ctrl+F5 or Cmd+Shift+R)\n2. Check your internet connection\n3. Close unnecessary browser tabs\n4. Try a different browser\n5. Clear browser cache\n\nIs the issue persisting after these steps?",
                type: 'solution',
                actions: ['Still Having Issues', 'Problem Solved']
            };
        }
        
        if (message.includes('billing') || message.includes('payment') || message.includes('invoice')) {
            return {
                text: "For billing and payment inquiries, I'll connect you with our billing specialist. In the meantime:\n\n1. Check your account dashboard for recent transactions\n2. Verify payment method details\n3. Look for any failed payment notifications\n\nCreating a priority ticket for billing support...",
                type: 'escalation',
                actions: ['View Billing', 'Contact Specialist']
            };
        }
        
        if (message.includes('bug') || message.includes('error') || message.includes('broken')) {
            return {
                text: "I understand you're experiencing a technical issue. To help our developers:\n\n1. Can you describe what you were doing when the error occurred?\n2. What browser and device are you using?\n3. Do you have any error messages or screenshots?\n\nI'm creating a bug report ticket for our technical team.",
                type: 'bug_report',
                actions: ['Add Screenshots', 'Provide Details']
            };
        }
        
        if (message.includes('thank') || message.includes('thanks')) {
            return {
                text: "You're welcome! I'm glad I could help. Is there anything else you need assistance with today?",
                type: 'acknowledgment'
            };
        }
        
        // Default response with suggestions
        return {
            text: "I understand you need help, but I'm not sure about the specific issue. Here are some things I can assist with:\n\n• Password and login problems\n• Email and notification issues\n• Performance and loading problems\n• Billing and payment questions\n• Bug reports and technical issues\n\nCould you please provide more details about what you're experiencing?",
            type: 'clarification',
            actions: ['Speak to Human', 'Browse FAQ']
        };
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        // Add user message
        const userMessage = {
            id: Date.now(),
            text: inputMessage,
            sender: 'user',
            timestamp: new Date(),
            type: 'message'
        };

        setMessages(prev => [...prev, userMessage]);
        const currentMessage = inputMessage;
        setInputMessage('');
        setIsTyping(true);

        // Save user message to backend
        try {
            await fetch('http://localhost:5000/api/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: currentMessage,
                    sender: 'user'
                })
            });
        } catch (error) {
            console.error('Error saving user message:', error);
        }

        // Simulate AI processing time
        setTimeout(async () => {
            const botResponse = generateBotResponse(currentMessage);
            const botMessage = {
                id: Date.now() + 1,
                text: botResponse.text,
                sender: 'bot',
                timestamp: new Date(),
                type: botResponse.type,
                actions: botResponse.actions
            };

            setMessages(prev => [...prev, botMessage]);
            setIsTyping(false);

            // Save bot message to backend
            try {
                await fetch('http://localhost:5000/api/chatbot', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        text: botResponse.text,
                        sender: 'bot',
                        type: botResponse.type,
                        actions: botResponse.actions
                    })
                });
            } catch (error) {
                console.error('Error saving bot message:', error);
            }
        }, 1500 + Math.random() * 1000);
    };

    const handleActionClick = async (action, messageId) => {
        const actionMessage = {
            id: Date.now(),
            text: `Selected: ${action}`,
            sender: 'user',
            timestamp: new Date(),
            type: 'action'
        };

        setMessages(prev => [...prev, actionMessage]);

        // Save action to backend
        try {
            await fetch('http://localhost:5000/api/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: `Selected: ${action}`,
                    sender: 'user',
                    type: 'action'
                })
            });
        } catch (error) {
            console.error('Error saving action:', error);
        }

        // Handle specific actions
        setTimeout(async () => {
            let response = '';
            switch(action) {
                case 'Create Ticket':
                    response = "I've initiated the ticket creation process. A support ticket will be created with the details from our conversation. You'll receive a confirmation email shortly.";
                    break;
                case 'Escalate':
                    response = "I'm escalating your issue to a human agent. You'll be contacted within 2 hours during business hours. Ticket reference: #ESC-" + Date.now().toString().slice(-6);
                    break;
                case 'Speak to Human':
                    response = "Connecting you to our live chat support. Please hold while I find an available agent...";
                    break;
                default:
                    response = "Thank you for your selection. Is there anything else I can help you with?";
            }

            const responseMessage = {
                id: Date.now(),
                text: response,
                sender: 'bot',
                timestamp: new Date(),
                type: 'action_response'
            };

            setMessages(prev => [...prev, responseMessage]);

            // Save response to backend
            try {
                await fetch('http://localhost:5000/api/chatbot', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        text: response,
                        sender: 'bot',
                        type: 'action_response'
                    })
                });
            } catch (error) {
                console.error('Error saving response:', error);
            }
        }, 800);
    };

    const clearChat = async () => {
        try {
            await fetch('http://localhost:5000/api/chatbot', {
                method: 'DELETE'
            });
            setMessages([{
                id: 1,
                text: "Chat cleared. How can I help you today?",
                sender: 'bot',
                timestamp: new Date(),
                type: 'welcome'
            }]);
        } catch (error) {
            console.error('Error clearing chat:', error);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading chat...</p>
            </div>
        );
    }

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <h2>AI Support Assistant</h2>
                <div className="chatbot-actions">
                    <button className="btn btn-secondary" onClick={clearChat}>
                        Clear Chat
                    </button>
                    <div className="bot-status">
                        <span className="status-indicator online"></span>
                        Online
                    </div>
                </div>
            </div>

            <div className="chat-window">
                <div className="messages-container">
                    {messages.map(message => (
                        <div key={message.id} className={`message ${message.sender}`}>
                            <div className="message-content">
                                <div className="message-text">
                                    {message.text.split('\n').map((line, index) => (
                                        <div key={index}>{line}</div>
                                    ))}
                                </div>
                                {message.actions && (
                                    <div className="message-actions">
                                        {message.actions.map(action => (
                                            <button
                                                key={action}
                                                className="action-btn"
                                                onClick={() => handleActionClick(action, message.id)}
                                            >
                                                {action}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                <div className="message-time">
                                    {new Date(message.timestamp).toLocaleTimeString()}
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {isTyping && (
                        <div className="message bot">
                            <div className="message-content">
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <form className="chat-input-form" onSubmit={handleSendMessage}>
                    <div className="input-container">
                        <input
                            type="text"
                            className="chat-input"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Type your message..."
                            disabled={isTyping}
                        />
                        <button 
                            type="submit" 
                            className="send-btn"
                            disabled={isTyping || !inputMessage.trim()}
                        >
                            Send
                        </button>
                    </div>
                </form>
            </div>

            <div className="chat-suggestions">
                <h4>Quick Help Topics:</h4>
                <div className="suggestion-buttons">
                    <button 
                        className="suggestion-btn"
                        onClick={() => setInputMessage('I forgot my password')}
                    >
                        Password Reset
                    </button>
                    <button 
                        className="suggestion-btn"
                        onClick={() => setInputMessage('Email notifications not working')}
                    >
                        Email Issues
                    </button>
                    <button 
                        className="suggestion-btn"
                        onClick={() => setInputMessage('Page loading slowly')}
                    >
                        Performance
                    </button>
                    <button 
                        className="suggestion-btn"
                        onClick={() => setInputMessage('Billing question')}
                    >
                        Billing
                    </button>
                </div>
            </div>
        </div>
    );
}
