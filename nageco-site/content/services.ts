export type ServiceItem = {
  slug: string;
  title: string;
  summary: string;
  details: string;
};

export const services: ServiceItem[] = [
  {
    slug: "seismic-surveys",
    title: "Seismic Surveys",
    summary: "2D/3D seismic data acquisition and processing for subsurface mapping.",
    details:
      "NAGECO delivers field-ready seismic acquisition and interpretation workflows for onshore and nearshore environments."
  },
  {
    slug: "gravity-magnetic",
    title: "Gravity & Magnetic",
    summary: "High-resolution gravity and magnetic surveys for structural analysis.",
    details:
      "Our gravity and magnetic programs support frontier exploration, basin screening, and structural trend identification."
  },
  {
    slug: "integrated-interpretation",
    title: "Integrated Interpretation",
    summary: "Multi-dataset interpretation and decision support for exploration teams.",
    details:
      "We integrate geophysical, geological, and geospatial data to reduce uncertainty and improve exploration outcomes."
  },
  {
    slug: "software-development",
    title: "Software Development (ERP, Service Software - Web & Mobile & Applications)",
    summary: "Custom software solutions for geophysical operations, data workflows, and reporting.",
    details:
      "We design and build web platforms, operational dashboards, and data management tools tailored to field and interpretation teams."
  },
  {
    slug: "electronic-aviation",
    title: "Electronic Aviation",
    summary: "Electronic aviation support systems for airborne operations and mission coordination.",
    details:
      "Our electronic aviation services include mission electronics integration, telemetry support, and digital monitoring workflows for reliable flight operations."
  }
];