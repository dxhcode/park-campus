/// <reference types="vite/client" />

export {};

declare module "vue-router" {
  interface RouteMeta {
    title: string;
    description?: string;
    group?: string;
    highlights?: string[];
    public?: boolean;
    crumbs?: string[];
  }
}
