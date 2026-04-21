"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { GeoJSON, MapContainer, Marker, TileLayer, Tooltip, useMap } from "react-leaflet";
import Image from "next/image";
import type { LatLngBoundsExpression, LatLngExpression } from "leaflet";
import { divIcon } from "leaflet";
import type { GeoJsonObject } from "geojson";

type MapPoint = {
  id: string;
  title: string;
  slug: string;
  country?: string | null;
  industry?: string | null;
  summary?: string | null;
  imageUrl?: string | null;
  x: number;
  y: number;
};

type LibyaBounds = {
  minLon: number;
  maxLon: number;
  minLat: number;
  maxLat: number;
};

type GeoJsonFeature = {
  type: "Feature";
  properties?: Record<string, unknown>;
  geometry?: {
    type: "Polygon" | "MultiPolygon";
    coordinates: unknown;
  };
};

type GeoJsonFeatureCollection = {
  type: "FeatureCollection";
  features: GeoJsonFeature[];
};

const WORLD_GEO_JSON = "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";
const MARKER_PALETTE = ["#2563eb", "#059669", "#ea580c", "#7c3aed", "#0ea5e9", "#be123c", "#16a34a", "#4338ca"];
const MAP_PADDING: [number, number] = [10, 10];
const DEFAULT_LIBYA_BOUNDS: LibyaBounds = {
  minLon: 9.2,
  maxLon: 25.3,
  minLat: 19.8,
  maxLat: 33.2
};

function MapViewportController({ bounds, isFullscreen }: { bounds: LatLngBoundsExpression; isFullscreen: boolean }) {
  const map = useMap();

  useEffect(() => {
    map.fitBounds(bounds, { padding: MAP_PADDING });
    map.setMaxBounds(bounds);
  }, [map, bounds]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      map.invalidateSize();
    });

    return () => cancelAnimationFrame(frame);
  }, [map, isFullscreen]);

  return null;
}

function createProjectPinIcon(label: string, color: string, active: boolean) {
  const size = active ? 34 : 28;
  const ringSize = active ? 46 : 38;

  return divIcon({
    className: "",
    iconSize: [ringSize, ringSize],
    iconAnchor: [ringSize / 2, ringSize / 2],
    popupAnchor: [0, -(ringSize / 2)],
    html: `
      <div style="position:relative;width:${ringSize}px;height:${ringSize}px;display:flex;align-items:center;justify-content:center;">
        <span style="position:absolute;width:${ringSize}px;height:${ringSize}px;border-radius:9999px;background:${active ? "rgba(239,68,68,0.24)" : "rgba(14,165,233,0.2)"};border:1px solid ${active ? "rgba(239,68,68,0.45)" : "rgba(14,165,233,0.35)"};"></span>
        <span style="position:relative;width:${size}px;height:${size}px;border-radius:9999px;background:${active ? "#ef4444" : color};color:#fff;font-size:${active ? "12px" : "11px"};font-weight:800;line-height:${size}px;text-align:center;border:2px solid #ffffff;box-shadow:0 10px 22px rgba(15,23,42,0.35);">${label}</span>
      </div>
    `
  });
}

function toLngLat(x: number, y: number, bounds: LibyaBounds): [number, number] {
  const clampedX = Math.max(0, Math.min(100, x));
  const clampedY = Math.max(0, Math.min(100, y));

  const lon = bounds.minLon + (bounds.maxLon - bounds.minLon) * (clampedX / 100);
  const lat = bounds.maxLat - (bounds.maxLat - bounds.minLat) * (clampedY / 100);

  return [lon, lat];
}

function collectCoordinates(node: unknown, accumulator: Array<[number, number]>) {
  if (!Array.isArray(node)) return;

  if (node.length >= 2 && typeof node[0] === "number" && typeof node[1] === "number") {
    accumulator.push([node[0], node[1]]);
    return;
  }

  node.forEach((item) => collectCoordinates(item, accumulator));
}

function computeBoundsFromFeature(feature: GeoJsonFeature): LibyaBounds | null {
  const points: Array<[number, number]> = [];
  collectCoordinates(feature.geometry?.coordinates, points);
  if (points.length === 0) return null;

  let minLon = Number.POSITIVE_INFINITY;
  let maxLon = Number.NEGATIVE_INFINITY;
  let minLat = Number.POSITIVE_INFINITY;
  let maxLat = Number.NEGATIVE_INFINITY;

  points.forEach(([lon, lat]) => {
    if (lon < minLon) minLon = lon;
    if (lon > maxLon) maxLon = lon;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  });

  return { minLon, maxLon, minLat, maxLat };
}

export function ProjectsOperationsMap({ points }: { points: MapPoint[] }) {
  const [activeId, setActiveId] = useState<string | null>(points[0]?.id ?? null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [libyaFeature, setLibyaFeature] = useState<GeoJsonFeature | null>(null);
  const [libyaBounds, setLibyaBounds] = useState<LibyaBounds>(DEFAULT_LIBYA_BOUNDS);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapFrameRef = useRef<HTMLDivElement | null>(null);

  const activePoint = useMemo(() => points.find((point) => point.id === activeId) ?? points[0] ?? null, [points, activeId]);

  const mapPoints = useMemo(
    () =>
      points.map((point, index) => {
        const [longitude, latitude] = toLngLat(point.x, point.y, libyaBounds);
        return {
          ...point,
          order: index + 1,
          color: MARKER_PALETTE[index % MARKER_PALETTE.length],
          longitude,
          latitude,
          position: [latitude, longitude] as LatLngExpression
        };
      }),
    [points, libyaBounds]
  );

  const libyaViewBounds = useMemo<LatLngBoundsExpression>(
    () => [
      [libyaBounds.minLat, libyaBounds.minLon],
      [libyaBounds.maxLat, libyaBounds.maxLon]
    ],
    [libyaBounds]
  );

  useEffect(() => {
    setActiveId(points[0]?.id ?? null);
  }, [points]);

  useEffect(() => {
    let mounted = true;

    async function loadLibyaBoundary() {
      try {
        const response = await fetch(WORLD_GEO_JSON);
        const data = (await response.json()) as GeoJsonFeatureCollection;
        if (!mounted || !data?.features?.length) return;

        const foundLibya = data.features.find((feature) => {
          const props = feature.properties ?? {};
          const iso = typeof props.ISO_A3 === "string" ? props.ISO_A3.toUpperCase() : "";
          const name = typeof props.name === "string" ? props.name.toLowerCase() : "";
          const admin = typeof props.ADMIN === "string" ? props.ADMIN.toLowerCase() : "";
          return iso === "LBY" || name === "libya" || admin === "libya";
        });

        if (!foundLibya) return;

        setLibyaFeature(foundLibya);
        const bounds = computeBoundsFromFeature(foundLibya);
        if (bounds) {
          setLibyaBounds(bounds);
        }
      } catch {
        // Keep defaults when loading boundary fails.
      }
    }

    void loadLibyaBoundary();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (mapPoints.length <= 1 || hoveredId) return;

    const timer = setInterval(() => {
      setActiveId((current) => {
        const currentIndex = mapPoints.findIndex((point) => point.id === current);
        const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % mapPoints.length : 0;
        return mapPoints[nextIndex]?.id ?? current;
      });
    }, 3400);

    return () => clearInterval(timer);
  }, [hoveredId, mapPoints]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === mapFrameRef.current);
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    const frame = mapFrameRef.current;
    if (!frame) return;

    if (document.fullscreenElement === frame) {
      await document.exitFullscreen();
      return;
    }

    await frame.requestFullscreen();
  };

  if (points.length === 0) {
    return null;
  }

  return (
    <section className="card relative overflow-hidden border border-slate-300 bg-gradient-to-br from-slate-100 via-zinc-50 to-slate-200 p-5 text-slate-900 shadow-[0_24px_50px_-34px_rgba(15,23,42,0.3)] md:p-6">
      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.65),transparent_35%),radial-gradient(circle_at_82%_68%,rgba(255,255,255,0.55),transparent_32%)]" />
      <div className="pointer-events-none absolute -left-10 top-0 h-28 w-28 rounded-full bg-white/70 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-28 w-28 rounded-full bg-slate-300/40 blur-3xl" />

      <div className="relative z-10 mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-700">Operations Map</p>
          <h2 className="mt-1 text-2xl font-black leading-tight text-slate-900">Libya Project Footprint</h2>
          <p className="mt-1 max-w-xl text-sm text-slate-700">All projects appear on the Libya satellite-style map. Click any marker to inspect and open the case study.</p>
        </div>
        {activePoint && (
          <div className="rounded-2xl border border-red-200 bg-white/92 px-4 py-3 shadow-[0_16px_35px_-24px_rgba(220,38,38,0.4)] backdrop-blur-sm">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-red-600">Active Project</p>
            <p className="mt-1 text-base font-extrabold text-slate-900">{activePoint.title}</p>
            <p className="text-xs text-slate-600">{activePoint.country || "Libya"}{activePoint.industry ? ` • ${activePoint.industry}` : ""}</p>
            <Link href={`/projects/${activePoint.slug}`} className="mt-2 inline-block text-xs font-bold text-red-600 underline-offset-4 hover:underline">
              Open Case Study
            </Link>
          </div>
        )}
      </div>

      <div className="relative z-10 overflow-hidden rounded-2xl border border-slate-300 bg-slate-100 p-3 md:p-4">
        <div ref={mapFrameRef} className={`relative w-full overflow-hidden rounded-xl border border-slate-300 bg-slate-200 ${isFullscreen ? "h-screen" : "aspect-[16/8]"}`}>
          <button
            type="button"
            onClick={() => void toggleFullscreen()}
            className="absolute right-3 top-3 z-[1000] inline-flex items-center gap-2 rounded-full border border-white/70 bg-slate-900/70 px-3 py-1.5 text-xs font-bold text-white backdrop-blur transition-colors hover:bg-slate-900/85"
            aria-label={isFullscreen ? "Exit fullscreen map" : "Open fullscreen map"}
          >
            <span className="text-sm leading-none">{isFullscreen ? "⤡" : "⤢"}</span>
            <span>{isFullscreen ? "Exit full screen" : "Full screen"}</span>
          </button>
          <MapContainer
            bounds={libyaViewBounds}
            minZoom={5}
            maxZoom={10}
            maxBoundsViscosity={1}
            scrollWheelZoom
            className="h-full w-full"
          >
            <MapViewportController bounds={libyaViewBounds} isFullscreen={isFullscreen} />
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="Tiles © Esri"
            />

            {libyaFeature && (
              <>
                <GeoJSON
                  data={libyaFeature as unknown as GeoJsonObject}
                  style={{
                    color: "#ffffff",
                    weight: 6,
                    opacity: 0.58,
                    fillOpacity: 0
                  }}
                />
                <GeoJSON
                  data={libyaFeature as unknown as GeoJsonObject}
                  style={{
                    color: "#dc2626",
                    weight: 3.2,
                    opacity: 0.98,
                    fillOpacity: 0
                  }}
                />
              </>
            )}

            {mapPoints.map((point) => {
              const isActive = activeId === point.id;
              return (
                <Marker
                  key={point.id}
                  position={point.position}
                  icon={createProjectPinIcon(String(point.order), point.color, isActive)}
                  eventHandlers={{
                    click: () => setActiveId(point.id),
                    mouseover: () => setHoveredId(point.id),
                    mouseout: () => setHoveredId(null)
                  }}
                >
                  <Tooltip direction="top" offset={[0, -8]} opacity={1} className="!rounded-xl !border !border-slate-200 !bg-white/95 !p-0 !shadow-lg">
                    <div className="w-[180px] overflow-hidden rounded-xl">
                      {point.imageUrl ? (
                        <div className="relative h-20 w-full">
                          <Image src={point.imageUrl} alt={point.title} fill className="object-cover" sizes="180px" />
                        </div>
                      ) : (
                        <div className="flex h-20 w-full items-center justify-center bg-slate-100 text-xs font-bold text-slate-500">NO IMAGE</div>
                      )}
                      <div className="space-y-0.5 px-2.5 py-2">
                        <p className="truncate text-[11px] font-bold uppercase tracking-[0.08em] text-red-600">{point.country || "Libya"}</p>
                        <p className="truncate text-xs font-semibold text-slate-900">{point.title}</p>
                      </div>
                    </div>
                  </Tooltip>
                </Marker>
              );
            })}
          </MapContainer>

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,0,0,0.18),transparent_50%)]" />
        </div>
      </div>
    </section>
  );
}
