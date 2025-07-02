import React from 'react';

const Header: React.FC = () => {
  return (
    <header>
      <section className="container">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h1 style={{ margin: 0 }}>My App</h1>
        </div>
        <nav>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </nav>
      </section>
    </header>
  );
};

export default Header;
