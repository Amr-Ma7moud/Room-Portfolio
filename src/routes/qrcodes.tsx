import { createFileRoute, Navigate } from "@tanstack/react-router";

import data from "@/data/portfolio.json";

export const Route = createFileRoute("/qrcodes")({
  head: () => ({
    meta: [{ title: `QR Codes - ${data.profile.name}` }],
  }),
  component: () => <Navigate to="/qr" replace />,
});
