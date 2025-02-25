import { useAuth } from "@/hooks/use-auth";
import { Route } from "wouter";
import { LoadingScreen } from "@/components/loading-screen";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <LoadingScreen />
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}