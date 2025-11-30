// frontend/src/App.tsx
import StationList from './components/StationList';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm p-4 border-b">
        <h1 className="text-xl font-bold text-gray-800">
          Metro API Dashboard
        </h1>
      </header>
      <main className="p-4">
        <StationList />
      </main>
    </div>
  );
}

export default App;