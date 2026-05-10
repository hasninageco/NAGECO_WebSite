"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type { ProjectsOperationsMap as MapType } from "./ProjectsOperationsMap";

const ProjectsOperationsMapDynamic = dynamic(
  () => import("./ProjectsOperationsMap").then((m) => m.ProjectsOperationsMap),
  { ssr: false }
);

type MapProps = ComponentProps<typeof MapType>;

export function ProjectsOperationsMapClient(props: MapProps) {
  return <ProjectsOperationsMapDynamic {...props} />;
}
