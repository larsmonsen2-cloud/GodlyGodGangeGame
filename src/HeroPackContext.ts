import {createContext} from 'react';
import type {PackSelection} from './heroPackGeometry';
export const HeroPackContext=createContext<{selection:PackSelection;image:HTMLImageElement|null}|null>(null);
