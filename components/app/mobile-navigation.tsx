"use client";

import { useEffect, useRef, useState } from "react";
import { Navigation, type AppScreen } from "./navigation";
import styles from "./navigation.module.css";

export function MobileNavigation({screen,onChange}:{screen:AppScreen;onChange:(screen:AppScreen)=>void}) {
  const [compact,setCompact]=useState(false);
  const island=useRef<HTMLDivElement>(null);
  const scrollIntent=useRef(false);

  useEffect(()=>{
    let previousY=window.scrollY;
    const intent=(event:Event)=>{
      const target=event.target;
      if(target instanceof Element && target.closest("dialog"))return;
      scrollIntent.current=true;
    };
    const scroll=()=>{
      const currentY=window.scrollY;
      if(Math.abs(currentY-previousY)<6)return;
      previousY=currentY;
      if(!scrollIntent.current || !window.matchMedia("(max-width:1023px)").matches)return;
      // Keyboard navigation keeps every label visible while focus is in the island.
      if(island.current?.querySelector(":focus-visible"))return;
      setCompact(true);
    };
    window.addEventListener("wheel",intent,{passive:true});
    window.addEventListener("touchmove",intent,{passive:true});
    window.addEventListener("scroll",scroll,{passive:true});
    return()=>{
      window.removeEventListener("wheel",intent);
      window.removeEventListener("touchmove",intent);
      window.removeEventListener("scroll",scroll);
    };
  },[]);

  const expand=()=>{scrollIntent.current=false;setCompact(false);};
  return <div ref={island} className={styles.island} data-mobile-navigation={compact ? "compact" : "expanded"} onPointerDownCapture={expand} onClickCapture={expand} onFocusCapture={expand}>
    <Navigation screen={screen} onChange={onChange}/>
  </div>;
}
