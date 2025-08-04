// @ts-check

"use client";

import dynamic from "next/dynamic";

const DynamicThreejsScene = dynamic(
  () => import("./threejs-scene"),
  { ssr: false },
);

export default function Home() {
  return (
    <div className="home">
      <DynamicThreejsScene />
    </div>
  );
}
