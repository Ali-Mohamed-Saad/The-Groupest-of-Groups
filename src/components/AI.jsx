import { useState, useRef } from 'react';
import '../assets/css/AI.css';
import ReactMarkdown from 'react-markdown';

function AI() {

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const sidebarRef = useRef(true);
    const sidebarToggleButton = useRef(true);
    
    const toggleSidebar = () => {
        if(sidebarRef.current.style.display === 'none') {
            sidebarRef.current.style.display = 'inline';
            sidebarToggleButton.current.style.display = 'none';
        } else {
            sidebarRef.current.style.display = 'none';
            sidebarToggleButton.current.style.display = 'inline';
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim() || loading) return;

        const userMessage = message;
        setMessage('');

        const history = messages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
        }));

        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setLoading(true);

        try {
            const res = await fetch('http://localhost:5000/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage, provider: 'gemini', history }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Request failed');
            }

            const data = await res.json();
            setMessages(prev => [...prev, { role: 'model', text: data.reply }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'model', text: `Error: ${err.message}` }]);
        } finally {
            setLoading(null);
        }
    }

    return (
        <>
            <div className="ai d-flex flex-grow-1 overflow-hidden h-100">
                {/* Chat Sidebar */}
                <div className="chat-sidebar" ref={sidebarRef}>
                    <div className="d-flex m-3">
                        <button className="new-chat text-center py-2 w-100">+ New Chat</button>
                        <button className="toggle-panel ms-2" onClick={toggleSidebar}><span className="material-symbols-outlined toggle-panel-icon py-1">left_panel_close</span></button>
                    </div>
                    <hr></hr>
                    <div className="search d-flex rounded mx-3">
                        <span className="material-symbols-outlined p-2">search</span>
                        <input className="search-bar form-control mr-sm-2 p-0" type="text" placeholder="Search chats..." aria-label="Search"></input>
                    </div>
                    <p className="recent mx-3 mt-4">RECENT</p>
                    <p className="no-chats text-center">No chats yet</p>
                </div>

                {/* Main Section */}
                <div className="right-section d-flex flex-column flex-grow-1 w-100 overflow-hidden">
                    <nav className="d-flex align-items-center">
                        <button ref={sidebarToggleButton} onClick={toggleSidebar} className="toggle-panel my-2 ms-2" ><span className="material-symbols-outlined toggle-panel-icon py-1 ">right_panel_close</span></button>
                        <div className="dropdown py-2 pe-2">
                            <button className="agent-button d-flex align-center gap-2 btn btn-transparent" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <span className="material-symbols-outlined text-center my-auto ai-icon">star_shine</span>
                                Placeholder AI Agent
                                <span className="material-symbols-outlined text-center my-auto">keyboard_arrow_down</span>
                            </button>
                            <ul className="dropdown-menu px-1 pb-1">
                                <li><a className="dropdown-item" href="#">Placeholder AI Agent</a></li>
                                <li><a className="dropdown-item" href="#">Another AI Agent</a></li>
                                <li><a className="dropdown-item" href="#">Third AI Agent</a></li>
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
                                messages.map((m, i) => (
                                    <>
                                        <div className={`chat-container mb-3 mt-3 ${m.role === 'user' ? 'text-end' : 'text-start'}`}>
                                            <span key={i} className={`chat-bubble ${m.role === 'user' ? 'user-bubble' : 'model-bubble'} p-2 px-3 d-inline-block`}>
                                                <ReactMarkdown>{m.text}</ReactMarkdown>
                                            </span>
                                            <br></br>
                                        </div>
                                    </>
                                ))
                            )}
                            {loading && <div className='chat-container'><div className="chat-bubble model-bubble p-2 px-3 d-inline-block">Thinking...</div></div>}
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
