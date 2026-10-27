import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/qrcodes")({
  component: () => <Navigate to="/qr" replace />,
});
