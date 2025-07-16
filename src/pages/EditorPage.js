import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import Client from '../components/Client';
import Editor from '../components/Editor'
import { language, cmtheme } from '../../src/atoms';
import { useRecoilState } from 'recoil';
import ACTIONS from '../actions/Actions';
import { initSocket } from '../socket';
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';

const EditorPage = () => {

  const [lang, setLang] = useRecoilState(language);
  const [them, setThem] = useRecoilState(cmtheme);
  const [output, setOutput] = useState('');

  const [clients, setClients] = useState([]);

  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const [inputText, setInputText] = useState('');
  const [actionValue, setActionValue] = useState('');

  const reactNavigator = useNavigate();

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on('connect_error', (err) => handleErrors(err));
      socketRef.current.on('connect_failed', (err) => handleErrors(err));
      console.log("ewrwerewrwe", roomId, location.state?.username);
      function handleErrors(e) {
        console.log('socket errorssssss', e);
        toast.error('Socket connection failed, try again later.');
        reactNavigator('/');
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      // Listening for joined event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room.`);
            console.log(`${username} joined`);
          }
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );

      // Listening for disconnected
      socketRef.current.on(
        ACTIONS.DISCONNECTED,
        ({ socketId, username }) => {
          toast.success(`${username} left the room.`);
          setClients((prev) => {
            return prev.filter(
              (client) => client.socketId !== socketId
            );
          });
        }
      );
    };
    init();
    return () => {
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
      socketRef.current.disconnect();
    };
  }, []);

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success('Room ID has been copied to clipboard');
    } catch (err) {
      toast.error('Could not copy the Room ID');
      console.error(err);
    }
  }

  function leaveRoom() {
    reactNavigator('/');
  }

  function handleAction(e) {
    const action = e.target.value;
    setActionValue(action); // update selected state

    switch (action) {
      case 'run':
        runCode();
        break;
      case 'compile':
        compileAndRun();
        break;
      case 'format':
        formatCode();
        break;
      case 'clear':
        setOutput('');
        break;
      default:
        break;
    }

    setTimeout(() => setActionValue(''), 300); // reset after a short delay
  }



  function runCode() {
  const code = codeRef.current;
  const logs = [];

  // Override global console.log for this function scope
  const customConsole = {
    log: (...args) => {
      logs.push(args.join(' '));
    },
    error: (...args) => {
      logs.push('Error: ' + args.join(' '));
    }
  };

  try {
    const func = new Function('console', 'input', code);
    func(customConsole, inputText); // pass in custom console and input
    setOutput(logs.join('\n') || '// No output');
  } catch (err) {
    setOutput('Runtime Error: ' + err.message);
  }
}


  function compileAndRun() {
    const code = codeRef.current;
    try {
      // Mock compile phase
      setOutput('Compiling...\n');
      setTimeout(() => {
        try {
          const result = new Function(code)();
          setOutput((prev) => prev + 'Output: ' + String(result));
        } catch (err) {
          setOutput('Compile Error: ' + err.message);
        }
      }, 500); // Simulate delay
    } catch (err) {
      setOutput('Error: ' + err.message);
    }
  }

  function formatCode() {
    const code = codeRef.current;
    try {
      const formatted = code
        .replace(/;\s*/g, ';\n')   // add new lines
        .replace(/\s*{\s*/g, ' {\n')  // format braces
        .replace(/\s*}\s*/g, '\n}\n');
      codeRef.current = formatted;
      setOutput('Code formatted');
    } catch (err) {
      setOutput('Format Error: ' + err.message);
    }
  }


  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container">
      <header className="topBar">
        <div className="brand">Live Code Canvas</div>
        <div className="topActions">
          <div>
          {/* <select
            className="btn dropdownAction"
            onChange={handleAction}
            value={actionValue}
          >
            <option value="">⚙️ Actions</option>
            <option value="run">▶ Run</option>
            <option value="compile">⚙️ Compile & Run</option>
            <option value="format">🧹 Format Code</option>
            <option value="clear">🗑 Clear Output</option>
          </select> */}
{/* 
          <button className="btn copyBtn" onClick={copyRoomId}>
            Copy Room ID
          </button> */}
           
          </div>
          <div>
          <button className="btn copyBtn" onClick={copyRoomId}>
            Copy Room ID
          </button>
          <button className="btn leaveBtn" onClick={leaveRoom}>
            Leave
          </button>
          </div>
        </div>

      </header>

      <div className="contentArea">
        <aside className="leftPanel">
          <h3>Connected Users</h3>
          <div className="clientsList">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>

          <label>
            Select Language:
            <select
              value={lang}
              onChange={(e) => {
                setLang(e.target.value);
                window.location.reload();
              }}
              className="seLang"
            >
              {/* language options */}
              <option value="clike">C / C++ / C# / Java</option>
              <option value="css">CSS</option>
              <option value="dart">Dart</option>
              <option value="django">Django</option>
              <option value="dockerfile">Dockerfile</option>
              <option value="go">Go</option>
              <option value="htmlmixed">HTML-mixed</option>
              <option value="javascript">JavaScript</option>
              <option value="jsx">JSX</option>
              <option value="markdown">Markdown</option>
              <option value="php">PHP</option>
              <option value="python">Python</option>
              <option value="r">R</option>
              <option value="rust">Rust</option>
              <option value="ruby">Ruby</option>
              <option value="sass">Sass</option>
              <option value="shell">Shell</option>
              <option value="sql">SQL</option>
              <option value="swift">Swift</option>
              <option value="xml">XML</option>
              <option value="yaml">yaml</option>
            </select>
          </label>

          <label>
            Select Theme:
            <select
              value={them}
              onChange={(e) => {
                setThem(e.target.value);
                window.location.reload();
              }}
              className="seLang"
            >
              <option value="base16-light">Light</option>
              <option value="base16-dark">Dark</option>
            </select>
          </label>

          {/* New Textarea Input and Output Below */}
          {/* <label style={{ marginTop: '20px', display: 'block' }}>
            Enter Input:
            <textarea
              rows={6}
              style={{ width: '100%', marginTop: '5px' }}
              onChange={(e) => setInputText(e.target.value)}
            />
          </label>

          <label style={{ marginTop: '20px', display: 'block' }}>
            Output:
            <pre
              style={{
                backgroundColor: '#f5f5f5',
                padding: '10px',
                border: '1px solid #ccc',
                marginTop: '5px',
                whiteSpace: 'pre-wrap',
                minHeight: '80px',
              }}
            >
              {inputText}
            </pre>
          </label> */}
        </aside>


        <main className="editorOutput">
          <div className="editorPane">
            <Editor
              socketRef={socketRef}
              roomId={roomId}
              onCodeChange={(code) => {
                codeRef.current = code;
              }}
            />
          </div>
          <div className="outputPane">
            <h3>Output</h3>
            <div className="outputPane">
              <h3>Output</h3>
              <div className="outputBox">
                <pre style={{ whiteSpace: 'pre-wrap' }}>{output || '// Output will appear here'}</pre>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );

}

export default EditorPage;