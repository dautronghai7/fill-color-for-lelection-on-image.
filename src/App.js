/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { useRef, useEffect, useState } from "react";
import {image} from './data/images';
// import image from './images/conrua.jpg';
function App() {
  const boardRef = useRef();
  const [context, setContext]= useState();
  //const [colorStart, setColorStart] = useState();
  let fill = [];
  let colorStart = '';
  useEffect(()=>{
    if(boardRef && boardRef.current) {
      const src = document.getElementById('conrua');      
      const ctx = boardRef.current.getContext('2d');      
      setContext(ctx);
      ctx.drawImage(src, 0, 0, 500, 450);
    }    
  })

  const fillArea = (startPoint) =>{        
    console.log(colorStart);
    if(getColor(startPoint) !== colorStart && getColor(startPoint) !== '#215534'){       
      return;
    }else{      
      if(getColor(startPoint) === colorStart){        
        context.fillStyle = '#215534';
        context.fillRect(startPoint.x, startPoint.y, 1, 1);
        fill.push(startPoint);
      }      
      const p1 = {x: startPoint.x - 1, y: startPoint.y};
      if(getColor(p1) === colorStart){
        console.log('next p1', getColor(p1));
          fillArea(p1);
      }
      const p2 = {x: startPoint.x + 1, y: startPoint.y};
      if(getColor(p2) === colorStart){
        console.log('next p2', getColor(p2));
        fillArea(p2);
      }
      const p3 = {x: startPoint.x, y: startPoint.y - 1};
      if(getColor(p3) === colorStart){
        console.log('next p3', getColor(p3));
        fillArea(p3);
      }
      const p4 = {x: startPoint.x, y: startPoint.y + 1};
      if(getColor(p4) === colorStart){
        console.log('next p4', getColor(p4));
        fillArea(p4);
      }
    }
  }
  const getColor = (_p)=>{    
    const p = context.getImageData(_p.x, _p.y, 1, 1);            
    return '#'+p.data[0].toString(16)+p.data[1].toString(16)+p.data[2].toString(16);
  }
  // const checkPoint = (array, point)=>{
  //     return array.some(p=>(p.x === point.x && p.y === point.y))
  // }  
  const getFourPoint = (popItem)=>{
    let result = [];
    const p11 = {x: popItem.x - 1, y: popItem.y};        
    if(getColor(p11) === colorStart){
      result.push(p11);
    }
    const p13 = {x: popItem.x, y: popItem.y - 1};    
    if(getColor(p13) === colorStart){
      result.push(p13);
    }
    const p14 = {x: popItem.x, y: popItem.y + 1};    
    if(getColor(p14) === colorStart){
      result.push(p14);
    }
    const p12 = {x: popItem.x + 1, y: popItem.y};    
    if(getColor(p12) === colorStart){
      result.push(p12);
    }
    return result;
  }
  const fillPoint = (popItem, color = '#215534')=>{    
    context.fillStyle = color;  
    context.fillRect(popItem.x, popItem.y, 1, 1);
  }
  const fillSelectedArea = (startPoint)=>{    
    //fill.push(startPoint);
    let stack = [];
    stack.push(startPoint);
    // let test = [{x: 0, y: 0},{x: 1, y: 1}];
    // stack.push(...test);
    // console.log(stack);
    let count = 0;  
    while(stack.length > 0){    
      count++;
      let popItem = stack.pop();       
      fillPoint(popItem);
      const p11 = {x: popItem.x - 1, y: popItem.y};        
      const p11Color = getColor(p11);      
      const p12 = {x: popItem.x + 1, y: popItem.y};
      const p12Color = getColor(p12);
      const p13 = {x: popItem.x, y: popItem.y - 1};
      const p13Color = getColor(p13);
      const p14 = {x: popItem.x, y: popItem.y + 1};
      const p14Color = getColor(p14);
      if(p11Color === colorStart){                  
        fillPoint(p11);
      }
      if(p12Color === colorStart){        
        fillPoint(p12);
      }
      if(p13Color === colorStart){        
        fillPoint(p13);
      } 
      if(p14Color === colorStart){        
        fillPoint(p14);
      } 
      if(count <= 2000){
      stack.push(...getFourPoint(p12));
      stack.push(...getFourPoint(p14));
      stack.push(...getFourPoint(p13));
      
      stack.push(...getFourPoint(p11));}
    }
  }
  const handelFillImage = (e)=>{
    const rect = boardRef.current.getBoundingClientRect();
    const startPoint = {x : e.clientX - rect.left, y : parseInt( e.clientY - rect.top)};
    colorStart = getColor(startPoint);
    //setColorStart(getColor(startPoint));    
    //context.fillStyle = '#215534';
    // fillArea(startPoint);
    fillSelectedArea(startPoint);
  }
  return (
    <div className="App">
    
      <img src={image} width='50' height='45' id='conrua'/>
      <h1>Fill area Image</h1>
      <canvas onClick={handelFillImage} style={{background: 'grey'}} ref={boardRef} width='1000' height='800' ></canvas>
    </div>
  );
}

export default App;



