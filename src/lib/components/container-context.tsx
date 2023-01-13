import type { Container } from 'inversify';
import { createContext } from 'solid-js';

export const ContainerContext = createContext<Container>(null!);