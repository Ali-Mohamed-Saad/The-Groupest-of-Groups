import { useState } from "react";
import "../assets/css/AI.css";

function AI() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/ai", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ message, provider: "ChatGPT", history: [] }),
    });

    const data = await res.json();
    setReply(data.reply);
  };

  return (
    <>
      <div className="ai d-flex flex-grow-1 overflow-hidden h-100">
        {/* Chat Sidebar */}
        <div className="chat-sidebar">
          <div className="d-flex m-3">
            <button className="new-chat text-center py-2 w-100">
              + New Chat
            </button>
            <button className="toggle-panel ms-2">
              <span className="material-symbols-outlined toggle-panel-icon py-2">
                left_panel_close
              </span>
            </button>
          </div>
          <hr></hr>
          <div className="search d-flex rounded mx-3">
            <span className="material-symbols-outlined p-2">search</span>
            <input
              className="search-bar form-control mr-sm-2 p-0"
              type="text"
              placeholder="Search chats..."
              aria-label="Search"
            ></input>
          </div>
          <p className="recent mx-3 mt-4">RECENT</p>
          <p className="no-chats text-center">No chats yet</p>
        </div>

        {/* Main Section */}
        <div className="right-section d-flex flex-column flex-grow-1 w-100 overflow-hidden">
          <nav className="">
            <div className="dropdown p-2">
              <button
                className="agent-button d-flex align-center gap-2 btn btn-transparent"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span className="material-symbols-outlined text-center my-auto ai-icon">
                  star_shine
                </span>
                Placeholder AI Agent
                <span className="material-symbols-outlined text-center my-auto">
                  keyboard_arrow_down
                </span>
              </button>
              <ul className="dropdown-menu px-1 pb-1">
                <li>
                  <a className="dropdown-item" href="#">
                    Placeholder AI Agent
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Another AI Agent
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    The Coolest AI Agent
                  </a>
                </li>
              </ul>
            </div>
          </nav>

          <main className="main d-flex flex-column justify-content-between overflow-hidden">
            <div className="message-window flex-grow-1 text-center overflow-auto">
              <div className="agent-icon-bg d-flex justify-content-center align-items-center mx-auto">
                <span
                  className="agent-icon material-symbols-outlined"
                  style={{ color: "var(--color-heading, #f8fafc)" }}
                >
                  {" "}
                  robot_2{" "}
                </span>
              </div>
              <h3 className="my-3 fw-bold">How can I help today?</h3>
              <h6 className="agent-subtext fw-light mx-auto">
                Ask anything — break down projects, generate user stories, plan
                sprints, or get unblocked.
              </h6>
            </div>

            <div className="chat-bg d-flex flex-column justify-content-center align-items-center gap-2 w-100">
              <form onSubmit={handleSubmit} className="mx-auto w-100">
                <div className="chat mx-auto d-flex justify-content-center align-items-center mt-2 rounded">
                  <input type="file" id="upload" className="" hidden></input>
                  <label
                    htmlFor="upload"
                    className="attach-bg d-flex justify-content-center align-items-center p-2 mx-3 rounded"
                  >
                    <span className="material-symbols-outlined">
                      attach_file
                    </span>
                  </label>
                  <textarea
                    className="search-bar form-control mr-sm-2 px-0 my-2"
                    rows="1"
                    placeholder="Message AI-Sprint..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="send-bg d-flex justify-content-center align-items-center p-2 rounded m-3"
                  >
                    <span
                      className="send material-symbols-outlined"
                      style={{ color: "white" }}
                    >
                      {" "}
                      send{" "}
                    </span>
                  </button>
                </div>
              </form>
              <p className="chat-disclaimer">
                AI can make mistakes. Verify important info.
              </p>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default AI;
