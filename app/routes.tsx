import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("report", "routes/report.tsx"),
    route("*", "routes/404Page.tsx")

] satisfies RouteConfig;
