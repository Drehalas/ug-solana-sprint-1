"use client";

import React, { useEffect, useState } from "react";
import {
  MapIcon,
  MoonIcon,
  SunIcon,
  TreesIcon,
} from "lucide-react";
import {  } from "react-icons/fa"; // Importing from react-icons
// Remove the next-themes import
// import { useTheme } from "next-themes";

import { useMap } from "@/context/map-context";
import { Tabs, TabsList, TabsTrigger } from "@/components/Charities/ui/tabs";

type StyleOption = {
  id: string;
  label: string;
  icon:React.ReactNode; 
};

const STYLE_OPTIONS: StyleOption[] = [
  {
    id: "streets-v12",
    label: "Map",
    icon: <MapIcon className="w-5 h-5" />,
  },
  {
    id: "outdoors-v12",
    label: "Terrain",
    icon: <TreesIcon className="w-5 h-5" />,
  },

  {
    id: "light-v11",
    label: "Light",
    icon: <SunIcon className="w-5 h-5" />,
  },
  {
    id: "dark-v11",
    label: "Dark",
    icon: <MoonIcon className="w-5 h-5" />,
  },
];

export default function MapStyles() {
  const { map } = useMap();
  // Use the safe wrapper instead
  const [activeStyle, setActiveStyle] = useState("streets-v12");

  const handleChange = (value: string) => {
    if (!map) return;
    
    // Add a brief camera animation when changing styles
    map.easeTo({
      pitch: map.getPitch() + 5,
      duration: 300,
    });
    
    // Set the style with a slight delay for better visual effect
    setTimeout(() => {
      map.setStyle(`mapbox://styles/mapbox/${value}`);
      setActiveStyle(value);
      
      // Return camera to original position
      setTimeout(() => {
        map.easeTo({
          pitch: map.getPitch() - 5,
          duration: 300,
        });
      }, 300);
    }, 150);
  };

  useEffect(() => {
    // No need to set theme if we're not using next-themes
  }, [map, activeStyle]); 

  return (
    <aside className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
      <Tabs value={activeStyle} onValueChange={handleChange}>
        <TabsList className="bg-background shadow-lg">
          {STYLE_OPTIONS.map((style) => (
            <TabsTrigger
              key={style.id}
              value={style.id}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm flex items-center sm:px-3 sm:py-1.5"
            >
              {style.icon}
              <span className="hidden sm:inline">{style.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </aside>
  );
}
