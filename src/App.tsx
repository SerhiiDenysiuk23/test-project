import { useState } from 'react';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { InfiniteList } from './components/InfiniteList';
import { HandPoseScroller } from './components/HandPoseScroller';
import { AlbumsPage } from './components/AlbumsPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PhotosPage } from './components/PhotosPage';

export const App = () => {
  const [isClose, setIsClose] = useState(true);
  const [scrollEffectTrigger, setScrollEffectTrigger] = useState(0);
  return (
    <>
      <Header />
      <main>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <section>
                  {!isClose && (
                    <HandPoseScroller effectTrigger={scrollEffectTrigger} />
                  )}
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
                  <button
                    style={{
                      position: 'fixed',
                      bottom: '10px',
                      right: '10px',
                      color: 'white',
                      backgroundColor: '#282c34',
                      padding: '10px',
                      borderRadius: '20px',
                      cursor: 'pointer',
                    }}
                    onClick={() =>
                      setScrollEffectTrigger((prevState) => prevState + 1)
                    }
                  >
                    Trigger Scroll Effect
                  </button>
                  <InfiniteList />
                </section>
              }
            />
            <Route path="/albums" element={<AlbumsPage />} />
            <Route path="/albums/:albumId" element={<PhotosPage />} />
          </Routes>
        </BrowserRouter>
      </main>

      <Footer />
    </>
  );
};
