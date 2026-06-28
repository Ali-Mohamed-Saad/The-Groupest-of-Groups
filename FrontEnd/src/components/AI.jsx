import { useState, useRef, useEffect } from 'react';
import '../assets/css/AI.css';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../context/AuthContext';

function AI() {
    const { token } = useAuth();

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const [conversations, setConversations] = useState([]);
    const [conversationId, setConversationId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const sidebarRef = useRef(true);
    const sidebarToggleButton = useRef(true);

    useEffect(() => {
        const loadConversations = async () => {
            try {
                const res = await fetch('http://localhost:3000/conversations', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (!res.ok) return;
                const data = await res.json();
                setConversations(data);
            } catch (err) {
                console.error('Failed to load conversations:', err);
            }
        };
        if (token) loadConversations();
    }, [token]);

    const handleNewChat = async () => {
        try {
            const res = await fetch('http://localhost:3000/conversations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error('Failed to create conversation');
            const newConversation = await res.json();

            setConversations(prev => [newConversation, ...prev]);
            setConversationId(newConversation._id);
            setMessages([]);
        } catch (err) {
            console.error('Failed to create new chat:', err);
        }
    };

        const handleSelectConversation = async (id) => {
        try {
            const res = await fetch(`http://localhost:3000/conversations/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed to load conversation');
            const data = await res.json();

            setConversationId(data._id);
            setMessages(data.messages.map(m => ({
                role: m.role === 'assistant' ? 'model' : 'user', 
                text: m.content
            })));
        } catch (err) {
            console.error('Failed to load conversation:', err);
        }
    };
    
    const toggleSidebar = () => {
        if(sidebarRef.current.style.display === 'none') {
            sidebarRef.current.style.display = 'inline';
            sidebarToggleButton.current.style.display = 'none';
        } else {
            sidebarRef.current.style.display = 'none';
            sidebarToggleButton.current.style.display = 'inline';
        }
    }

    function extractTaskPlan(text) {
    const match = text.match(/```taskplan\s*([\s\S]*?)```/);
    if (!match) return { textBefore: text, taskPlan: null };

    const textBefore = text.slice(0, match.index).trim();
    try {
        const parsed = JSON.parse(match[1].trim());
        return { textBefore, taskPlan: parsed.tasks || null };
    } catch (err) {
        console.error('Failed to parse task plan JSON:', err);
        return { textBefore: text, taskPlan: null };
    }
    }

      const handleAddToBoard = async (tasks, messageIndex) => {
        try {
            const res = await fetch('http://localhost:3000/tasks/bulk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ tasks }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Failed to add tasks');
            }

            // Mark this message's plan as "added" so the button can show confirmation
            setMessages(prev => prev.map((m, i) =>
                i === messageIndex ? { ...m, planAdded: true } : m
            ));
        } catch (err) {
            alert(`Could not add tasks to board: ${err.message}`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim() || loading) return;

        const userMessage = message;
        setMessage('');

        let activeConversationId = conversationId;

        if (!activeConversationId) {
            try {
                const res = await fetch('http://localhost:3000/conversations', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const newConversation = await res.json();
                activeConversationId = newConversation._id;
                setConversationId(activeConversationId);
                setConversations(prev => [newConversation, ...prev]);
            } catch (err) {
                setMessages(prev => [...prev, { role: 'model', text: `Error: could not start a new chat` }]);
                return;
            }
        }

        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setLoading(true);

        try {
            const res = await fetch('http://localhost:3000/ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    message: userMessage,
                    provider: 'gemini',
                    conversationId: activeConversationId,
                }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Request failed');
            }

            const data = await res.json();
            setMessages(prev => [...prev, { role: 'model', text: data.reply }]);

            setConversations(prev =>
                prev.map(c => c._id === activeConversationId
                    ? { ...c, title: data.title, lastMessageAt: new Date().toISOString() }
                    : c
                ).sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt))
            );
        } catch (err) {
            setMessages(prev => [...prev, { role: 'model', text: `Error: ${err.message}` }]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="ai d-flex flex-grow-1 overflow-hidden h-100">
                {/* Chat Sidebar */}
            <div className="chat-sidebar" ref={sidebarRef}>
                <div className="d-flex m-3">
                    <button className="new-chat text-center py-2 w-100" onClick={handleNewChat}>+ New Chat</button>
                    <button className="toggle-panel ms-2" onClick={toggleSidebar}><span className="material-symbols-outlined toggle-panel-icon py-1">left_panel_close</span></button>
                </div>
                <hr></hr>
                <div className="search d-flex rounded mx-3">
                    <span className="material-symbols-outlined p-2">search</span>
                    <input
                        className="search-bar form-control mr-sm-2 p-0"
                        type="text"
                        placeholder="Search chats..."
                        aria-label="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <p className="recent mx-3 mt-4">RECENT</p>
                {conversations.length === 0 ? (
                    <p className="no-chats text-center">No chats yet</p>
                ) : (
                    conversations
                        .filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map(c => (
                            <p
                                key={c._id}
                                className={`conversation-item mx-3 px-2 py-2 rounded ${c._id === conversationId ? 'active-conversation' : ''}`}
                                onClick={() => handleSelectConversation(c._id)}
                                style={{ cursor: 'pointer' }}
                            >
                                {c.title}
                            </p>
                        ))
                )}
            </div>

                {/* Main Section */}
                <div className="right-section d-flex flex-column flex-grow-1 w-100 overflow-hidden">
                    <nav className="d-flex align-items-center">
                        <button ref={sidebarToggleButton} onClick={toggleSidebar} className="toggle-panel nav-toggle-panel my-2 ms-2" ><span className="material-symbols-outlined toggle-panel-icon py-1 ">right_panel_close</span></button>
                        <div className="dropdown py-2 pe-2">
                            <button className="agent-button d-flex align-center gap-2 btn btn-transparent" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <span className="material-symbols-outlined text-center my-auto ai-icon">star_shine</span>
                                Gemini
                                <span className="material-symbols-outlined text-center my-auto">keyboard_arrow_down</span>
                            </button>
                            <ul className="dropdown-menu px-1 pb-1">
                                <li><a className="dropdown-item" href="#">Gemini</a></li>
                                <li><a className="dropdown-item" href="#">ChatGPT</a></li>
                                <li><a className="dropdown-item" href="#">Claude</a></li>
                            </ul>
                        </div>
                    </nav>

                    <main className='main d-flex flex-column justify-content-between overflow-hidden'>
                        <div className='message-window flex-grow-1 overflow-auto'>
                            <div className="text-center">
                                    <div className='agent-icon-bg d-flex justify-content-center align-items-center mx-auto'>
                                        <span className="agent-icon material-symbols-outlined text-dark"> robot_2 </span>
                                    </div>
                                    <h3 className='my-3 fw-bold'>How can I help today?</h3>
                                    <h6 className='agent-subtext fw-light mx-auto'>Ask anything — break down projects, generate user stories, plan sprints, or get unblocked.</h6>
                                </div>
                            {messages.length === 0 ? (
                                <></>
                            ) : (
                                messages.map((m, i) => {
                                const { textBefore, taskPlan } = m.role === 'model' ? extractTaskPlan(m.text) : { textBefore: m.text, taskPlan: null };

                                return (
                                    <div key={i} className={`chat-container mb-3 mt-3 ${m.role === 'user' ? 'text-end' : 'text-start'}`}>
                                        <span className={`chat-bubble ${m.role === 'user' ? 'user-bubble' : 'model-bubble'} p-2 px-3 d-inline-block`}>
                                            <ReactMarkdown>{textBefore}</ReactMarkdown>
                                        </span>

                                        {taskPlan && (
                                            <div className="task-plan-card p-3 rounded mt-2 mx-auto" style={{ maxWidth: '400px', textAlign: 'left' }}>
                                                <strong>Proposed tasks ({taskPlan.length})</strong>
                                                <ul className="mt-2 mb-2">
                                                    {taskPlan.map((t, ti) => (
                                                        <li key={ti}>{t.title} <span className="text-muted">({t.priority}, {t.points} pts)</span></li>
                                                    ))}
                                                </ul>
                                                {m.planAdded ? (
                                                    <button className="btn btn-success btn-sm" disabled>✓ Added to Board</button>
                                                ) : (
                                                    <button className="btn btn-primary btn-sm" onClick={() => handleAddToBoard(taskPlan, i)}>
                                                        + Add to Board
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                        <br />
                                    </div>
                                );
                            })
                            )}
                            {loading && <div className='chat-container'><div className="chat-bubble mb-3 model-bubble p-2 px-3 d-inline-block">Thinking...</div></div>}
                        </div>

                        <div className='chat-bg d-flex flex-column justify-content-center align-items-center gap-2 w-100'>
                            <form onSubmit={handleSubmit} className="mx-auto w-100">
                                <div className="chat mx-auto d-flex justify-content-center align-items-center mt-2 rounded">
                                    <input type="file" id="upload" className="" hidden></input>
                                    <label htmlFor="upload" className='attach-bg d-flex justify-content-center align-items-center p-2 mx-3 rounded'>
                                        <span className="material-symbols-outlined">attach_file</span>
                                    </label>
                                    <textarea className="search-bar form-control mr-sm-2 px-0 my-2"
                                        rows="1"
                                        placeholder="Message AI-Sprint..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSubmit(e);
                                            }
                                        }}
                                    />
                                    <button type="submit" disabled={loading} className={`send-bg d-flex justify-content-center align-items-center p-2 rounded m-3 border-0 ${message.length > 0 ? 'active-submit' : 'inactive-submit'}`}><span className="send material-symbols-outlined text-dark"> send </span></button>
                                </div>
                            </form>
                            <p className="chat-disclaimer">AI can make mistakes. Verify important info.</p>
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}

export default AI;
