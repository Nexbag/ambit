"use client"
import { useEffect } from "react";

const getElements=(ids:string[])=>{
  let parentArray:HTMLDivElement[] = [];
  ids.forEach((id) => {
    const parent = document.querySelector(`#${id}`) as HTMLDivElement;
    const divChildren:HTMLCollection=parent?.children||[];
    for(let i=0; i<divChildren.length;i++){
      const el=divChildren.item(i) as HTMLDivElement
      parentArray.push(el)
    }
    
  });
  return parentArray

}

export const useSlider = (ids:string[]) => {

  useEffect(() => {
    //strings to id
const parentArray=getElements(ids)
    const options = {
      threshold: 0.2,
    };
    const callback = (entries:IntersectionObserverEntry[], observer:IntersectionObserver) => {
      entries.forEach((entry, index) => {
        const target=entry.target as HTMLDivElement
        if (entry.isIntersecting) {
          target.style.transform = "translate(0,0) ";
          target.style.opacity = "1";

          observer.unobserve(entry.target);
        } else {
          target.style.transform =
            index % 2 === 0 ? "translate(-30%, 10%)" : "translate(30%, 10%)";
          target.style.opacity = "0";
          target.style.transition = "0.75s";
        }
      });
    };
    const observer = new IntersectionObserver(callback, options);
    parentArray.forEach((child) => {
      observer.observe(child);
    });
  }, []);
};
export const useOpacity = (ids:string[]) => {
 

  useEffect(() => {
    //strings to id
    const parentArray=getElements(ids)
    const options = {
      threshold: 0.2,
    };
    const callback = (entries:IntersectionObserverEntry[], observer:IntersectionObserver) => {
      entries.forEach((entry, index) => {
        const target=entry.target as HTMLDivElement
        if (entry.isIntersecting) {
         
          target.style.opacity = "1";

          observer.unobserve(entry.target);
        } else {
         
          target.style.opacity = "0.1";
          target.style.transition = "0.75s";
        }
      });
    };
    const observer = new IntersectionObserver(callback, options);
    parentArray.forEach((child) => {
      observer.observe(child);
    });
  }, []);
};

export const useSlideUp = (ids:string[]) => {
 

  useEffect(() => {
    const parentArray=getElements(ids)

 
    const options = {
      threshold: 0.2,
    };
    const callback = (entries:IntersectionObserverEntry[], observer:IntersectionObserver) => {
      entries.forEach((entry, index) => {
        const target=entry.target as HTMLDivElement

        if (entry.isIntersecting) {
          target.style.transform = "translateY(0%) ";
target.style.opacity = "1";

          observer.unobserve(entry.target);
        } else {
target.style.transform =
            index % 2 === 0 ? "translateY(15%)" : "translateY(30%)";
target.style.opacity = "0";
target.style.transition = "0.75s";
        }
      });
    };
    const observer = new IntersectionObserver(callback, options);
    parentArray.forEach((child) => {
      observer.observe(child);
    });
  }, []);
};
export const useScaler = (ids:string[]) => {
  
  useEffect(() => {
    let parentArray = getElements(ids);
    //strings to id
   
    const options = {
      threshold: 0.2,
    };
    const callback = (entries:IntersectionObserverEntry[], observer:IntersectionObserver) => {
      entries.forEach((entry, index) => {
const target=entry.target as HTMLDivElement
        if (entry.isIntersecting) {
target.style.scale = "1";
target.style.opacity = "1";
          observer.unobserve(entry.target);
        } else {
target.style.scale = index % 2 === 0 ? "0" : "0.2";
target.style.transition = "0.75s";
        }
      });
    };
    const observer = new IntersectionObserver(callback, options);
    parentArray.forEach((child) => {
      observer.observe(child);
    });
  }, []);
};
