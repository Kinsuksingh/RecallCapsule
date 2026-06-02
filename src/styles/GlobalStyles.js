import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    --primary: #000000;
    --primary-light: #475569;
    --secondary: #1E293B;
    --background: #FFFFFF;
    --text: #0F172A;
    --text-light: #64748B;
    --white: #FFFFFF;
    --glass: rgba(255, 255, 255, 0.8);
    --glass-border: rgba(0, 0, 0, 0.05);
    --shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.1);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 100%;
  }

  @media (max-width: 768px) {
    html {
      font-size: 75%;
    }
  }

  body {
    font-family: 'Kite One', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: var(--background);
    color: var(--text);
    line-height: 1.6;
    overflow-x: hidden;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    background: none;
    font-family: inherit;
  }

  h1, h2, h3, h4 {
    font-family: 'Kite One', 'IBM Plex Serif', serif;
    font-weight: 700;
    line-height: 1.2;
  }

  section {
    padding: 100px 5%;
    max-width: 1400px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    section {
      padding: 60px 5%;
    }
  }
`;

export default GlobalStyles;
