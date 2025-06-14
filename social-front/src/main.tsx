import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import Login from './components/Login.tsx';
import Register from './components/Register.tsx';
import Home from './components/Home.tsx';
import NotFound from './components/NotFound.tsx';
import Landing from './components/Landing.tsx';
import NewPost from './components/Publish.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'landing', element: <Landing /> },
      { path: 'publish', element: <NewPost /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
