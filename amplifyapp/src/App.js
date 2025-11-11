import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('about');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === 'audio') {
      // Fetch Bose books only when Audio Books tab is active
      const url = `https://archive.org/advancedsearch.php?q=collection:bosebooks&fl[]=title,creator,identifier&output=json&rows=50`;

      fetch(url)
        .then(res => res.json())
        .then(data => {
          const items = data.response.docs.map(doc => ({
            title: doc.title,
            author: doc.creator || "Unknown",
            audioURL: `https://archive.org/download/${doc.identifier}/${doc.identifier}_64kb.mp3`
          }));
          setBooks(items);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching books:", err);
          setLoading(false);
        });
    }
  }, [activeTab]);

  const renderContent = () => {
    switch(activeTab) {
      case 'about':
        return (
          <div>
            <h2>About</h2>
            <p>Welcome to the Bose Books site! Here you can listen to audio books or browse our book collection.</p>
          </div>
        );
      case 'audio':
        if (loading) return <p>Loading audio books...</p>;
        return (
          <div>
            <h2>Audio Books</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {books.map((book, index) => (
                <li key={index} style={{ marginBottom: "2rem" }}>
                  <h3>{book.title}</h3>
                  <p>by {book.author}</p>
                  <audio controls>
                    <source src={book.audioURL} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </li>
              ))}
            </ul>
          </div>
        );
      case 'books':
        return (
          <div>
            <h2>Books</h2>
            <p>Here you can list your non-audio books or eBooks. Add a JSON or static list of books here.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Bose Books</h1>
        <nav style={{ marginBottom: '2rem' }}>
          <button onClick={() => setActiveTab('about')} style={{ marginRight: '1rem' }}>
            About
          </button>
          <button onClick={() => setActiveTab('audio')} style={{ marginRight: '1rem' }}>
            Audio Books
          </button>
          <button onClick={() => setActiveTab('books')}>
            Books
          </button>
        </nav>
        <div>
          {renderContent()}
        </div>
      </header>
    </div>
  );
}

export default App;
