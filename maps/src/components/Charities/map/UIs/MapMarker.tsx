"use client";

import mapboxgl, { MarkerOptions } from "mapbox-gl";
import React, { useEffect, useRef } from "react";

import { useMap } from "@/context/map-context";
import { LocationFeature } from "@/lib/mapbox/utils";

type Props = {
  longitude: number;
  latitude: number;
  data: any;
  onHover?: ({
    isHovered,
    position,
    marker,
    data,
  }: {
    isHovered: boolean;
    position: { longitude: number; latitude: number };
    marker: mapboxgl.Marker;
    data: LocationFeature;
  }) => void;
  onClick?: ({
    position,
    marker,
    data,
  }: {
    position: { longitude: number; latitude: number };
    marker: mapboxgl.Marker;
    data: LocationFeature;
  }) => void;
  children?: React.ReactNode;
} & MarkerOptions;

export default function Marker({
  children,
  latitude,
  longitude,
  data,
  onHover,
  onClick,
  ...props
}: Props) {
  const { map } = useMap();
  const markerRef = useRef<HTMLDivElement | null>(null);
  let marker: mapboxgl.Marker | null = null;

  const handleHover = (isHovered: boolean) => {
    if (onHover && marker) {
      onHover({
        isHovered,
        position: { longitude, latitude },
        marker,
        data,
      });
    }
  };

  const handleClick = () => {
    if (onClick && marker) {
      onClick({
        position: { longitude, latitude },
        marker,
        data,
      });
    }
  };

  useEffect(() => {
    const markerEl = markerRef.current;
    if (!map || !markerEl) return;

    // Add entrance animation class
    markerEl.classList.add('marker-entrance');
    markerEl.style.animation = 'markerEntrance 0.5s ease-out';

    const handleMouseEnter = () => handleHover(true);
    const handleMouseLeave = () => handleHover(false);
    
    // Add right-click handler
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault(); // Prevent default context menu
      handleClick();
    };

    // Add event listeners
    markerEl.addEventListener("mouseenter", handleMouseEnter);
    markerEl.addEventListener("mouseleave", handleMouseLeave);
    markerEl.addEventListener("contextmenu", handleContextMenu); // Add right-click listener
    // Remove the regular click listener to avoid conflicts
    // markerEl.addEventListener("click", handleClick);

    // Marker options
    const options = {
      element: markerEl,
      ...props,
    };

    // Before creating the marker, add validation
    if (isNaN(longitude) || isNaN(latitude)) {
      console.error(`Invalid coordinates: [${longitude}, ${latitude}] for data:`, data);
      return;
    }

    marker = new mapboxgl.Marker(options)
      .setLngLat([longitude, latitude])
      .addTo(map);

    return () => {
      // Cleanup on unmount
      if (marker) marker.remove();
      if (markerEl) {
        markerEl.removeEventListener("mouseenter", handleMouseEnter);
        markerEl.removeEventListener("mouseleave", handleMouseLeave);
        markerEl.removeEventListener("contextmenu", handleContextMenu);
        // markerEl.removeEventListener("click", handleClick);
      }
    };
  }, [map, longitude, latitude, props]);

  return (
    <div>
      <div ref={markerRef}>{children}</div>
    </div>
  );
}
