import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { InfiniteList } from './components/InfiniteList';

function App() {
  return (
    <>
      <Header />
      <main>
        <section>
          <InfiniteList />
        </section>
      </main>

      <Footer />
    </>
  );
}

export default App;
