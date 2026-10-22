import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import {isHeroPackTest} from './previewMode';
import './style.css';

const HeroPackTest=React.lazy(()=>import('./HeroPackTest'));
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode>{isHeroPackTest?<React.Suspense fallback={<p>Laster bildeprøven …</p>}><HeroPackTest/></React.Suspense>:<App />}</React.StrictMode>);
