// Attorney lookup helpers — safe for both server and client components
import { firmAttorneys } from '@/data/firm';

export function getAttorneyById(id: string) {
  return firmAttorneys.find((a) => a.id === id);
}

export function getAttorneyByEmail(email: string) {
  return firmAttorneys.find((a) => a.email === email);
}