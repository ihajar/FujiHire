type ProtectedRoutes = 
    | '/login'
    | '/signup'
    | 'verify-email'
    | '/request-password-reset'
    | '/verify-email'
    | '(tabs)';


type TabRoutes =
    | '/(protected)/(tabs)/index'

export type AppRoutes = 
    | '/'
    | `/(protected)/${ProtectedRoutes}`
    | TabRoutes;