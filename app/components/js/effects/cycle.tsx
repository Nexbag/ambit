"use client";
import styles from "./cycle.module.scss";
import { MouseEvent } from "react";
export default function Cycle({removeHover=false}:{removeHover?:boolean}) {
  const handleIt = (e: MouseEvent<HTMLDivElement>) => {
    const doc = document.querySelector("body");
    const rubaDiv = document.querySelector("#rubaTop") as HTMLDivElement;
    const ball= document.querySelector("#ball") as HTMLDivElement;
    const rect = rubaDiv.getBoundingClientRect();
    const measurement=ball.getBoundingClientRect()
    const x = e.clientX - rect.left - measurement.width;
    const y = e.clientY - rect.top - measurement.height*1.7;

    doc?.style.setProperty("--x", `${x}px`);
    doc?.style.setProperty("--y", `${y}px`);
  
    
  };
  return (
    <div className={styles.main} id="rubaTop" onMouseMove={(e) => removeHover?"":handleIt(e)}>
      <div className={styles.effect}>
<div className={styles.parent}>
  <div className={styles.ball}></div>
</div>

      </div>
      <div className={styles.effect2}>
<div className={styles.parent}>
  <div className={styles.ball}></div>
</div>

      </div>
      <div className={styles.hove} >
       <div className={styles.child} id="ball"></div>
      </div>
      
    </div>
  );
}
