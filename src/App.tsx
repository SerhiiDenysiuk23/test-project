import { useState } from 'react';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { InfiniteList } from './components/InfiniteList';
import { HandPoseScroller } from './components/HandPoseScroller';

function App() {
  const [isClose, setIsClose] = useState(false);
  return (
    <>
      <Header />
      <main>
        <section>
          {!isClose && <HandPoseScroller />}
          <button
            style={{
              position: 'fixed',
              bottom: '10px',
              left: '10px',
              color: 'white',
              backgroundColor: '#282c34',
              padding: '10px',
              borderRadius: '20px',
              cursor: 'pointer',
            }}
            onClick={() => setIsClose((prevState) => !prevState)}
          >
            {!isClose ? 'Stop detect' : 'Start detect'}
          </button>
          <InfiniteList />
        </section>
      </main>

      <Footer />
    </>
  );
}

export default App;
