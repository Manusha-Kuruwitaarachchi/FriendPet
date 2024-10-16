/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(tabs)` | `/(tabs)/favorite` | `/(tabs)/home` | `/(tabs)/inbox` | `/(tabs)/profile` | `/_sitemap` | `/add-new-pet` | `/chat` | `/favorite` | `/home` | `/inbox` | `/login` | `/pet-details` | `/profile` | `/user-post`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
