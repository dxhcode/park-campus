/// <reference types="vite/client" />

export {};

declare module "vue-router" {
  interface RouteMeta {
    title: string;
    description: string;
    accent: string;
    panels: string[];
  }
}
