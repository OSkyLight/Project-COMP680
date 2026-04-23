import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function BackendDemo() {
  const [data, setData] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((json) => setData(JSON.stringify(json, null, 2)))
      .catch((e) => setError(String(e)))
  }, [])

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 6, padding: '0.75rem 1rem', marginBottom: '1rem', textAlign: 'left' }}>
      <strong>Backend Demo</strong>
      {error ? <pre style={{ color: 'red' }}>{error}</pre> : <pre>{data ?? 'Loading…'}</pre>}
    </div>
  )
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BackendDemo />
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
