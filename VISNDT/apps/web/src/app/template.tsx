'use client';

/**
 * M32.2 — Web 轻量路由进入过渡（无第三方依赖）。
 * 仅对 children 施加 .page-enter（opacity fade-in），
 * 不改变布局 / 不产生 containing block，避免干扰 fixed 元素（CompareBar / Drawer）。
 */
export default function RouteTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="page-enter">{children}</div>;
}