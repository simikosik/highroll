import { signal } from '@angular/core';

export const balance = signal(1000);
export function setBalance(value: number) {
    balance.set(value);
}

export function changeBalance(delta: number) {
    balance.update(b => b + delta);
}
