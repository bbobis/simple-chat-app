import { useEffect, useState } from 'react';

type Message = {
  data: string;
  source: 'client' | 'server';
};

export function App() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [value, setValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const connection = new WebSocket('ws://localhost:3000/chat');
    connection.onerror = () => {
      console.log('WebSocket error');
    };
    connection.onopen = () => {
      console.log('WebSocket connection established');
      setWs(connection);
    };
    connection.onclose = () => {
      console.log('WebSocket connection closed');
      setWs(null);
    };
    connection.onmessage = (event) => {
      setMessages((prev) => [
        ...prev,
        {
          data: event.data,
          source: 'server',
        },
      ]);
    };

    return () => {
      connection.close();
    };
  }, []);
  return (
    <div className="mx-auto max-w-3xl flex flex-col gap-4 p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (ws) {
            ws.send(value);
            setMessages((prev) => [
              ...prev,
              {
                data: value,
                source: 'client',
              },
            ]);
            setValue('');
          }
        }}
      >
        <div className="border border-gray-500 rounded-lg overflow-hidden">
          <div className="min-h-10 max-h-60 overflow-y-auto p-4 text-sm space-y-2">
            {messages.map((m) => {
              const isServer = m.source === 'server';
              return (
                <p
                  key={m.data}
                  className={`text-sm text-gray-800 ${
                    isServer ? 'text-right' : ''
                  }`}
                >
                  <span
                    className={`py-1 px-4 rounded-xl border ${
                      isServer ? 'bg-gray-200' : 'bg-sky-200'
                    }`}
                  >
                    {m.data}
                  </span>
                </p>
              );
            })}
          </div>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full border-y border-gray-500 py-2 px-4 text-xs outline-none"
          />
          <div className="flex items-center justify-end px-2 py-4">
            <button
              type="submit"
              className="border bg-sky-500 text-white rounded-md border-gray-400 py-2 px-3 text-sm"
            >
              Send
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default App;
