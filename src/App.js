/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { useRef, useEffect, useState, useCallback } from "react";
import {image} from './data/images';
// import image from './images/conrua.jpg';
function App() {
  const boardRef = useRef();
  const [context, setContext]= useState();
  const [startDraw, setStartDraw] = useState(false);
  const [startPoint, setStartPoint] = useState(null);  
  const [selection, setSelection] = useState({});  
  var timer = null;
  let colorStart = '';  
  useEffect(()=>{
    if(boardRef && boardRef.current) {
      const src = document.getElementById('conrua');      
      const ctx = boardRef.current.getContext('2d');      
      setContext(ctx);
      ctx.drawImage(src, 0, 0, 500, 450);
    }    
  },[]);
  useEffect(()=>{
    return ()=>{
      clearInterval(timer);
      setStartDraw(false);
      setSelection({});
    }
  }, [startDraw]);

  const fillArea = (startPoint) =>{        
    console.log(colorStart);
    if(getColor(startPoint) !== colorStart && getColor(startPoint) !== '#215534'){       
      return;
    }else{      
      if(getColor(startPoint) === colorStart){        
        context.fillStyle = '#215534';
        context.fillRect(startPoint.x, startPoint.y, 1, 1);
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
  const checkPoint = (array, point)=>{
      return array.some(p=>(p.x === point.x && p.y === point.y))
  }  
  const getFourPoint = (popItem, colorOnClick)=>{
    let result = [];
    const p18 = {x: popItem.x - 1, y: popItem.y + 1};    
    if(getColor(p18) === colorOnClick && getColor(p18) !== '#215534'){
      result.push(p18);
    }

    const p14 = {x: popItem.x, y: popItem.y + 1};    
    if(getColor(p14) === colorOnClick && getColor(p14) !== '#215534'){
      result.push(p14);
    }

    const p17 = {x: popItem.x - 1, y: popItem.y + 1};    
    if(getColor(p17) === colorOnClick && getColor(p17) !== '#215534'){
      result.push(p17);
    }
    const p11 = {x: popItem.x - 1, y: popItem.y};    
    if(getColor(p11) === colorOnClick && getColor(p11) !== '#215534'){
      result.push(p11);
    }
    const p16 = {x: popItem.x + 1, y: popItem.y - 1};    
    if(getColor(p16) === colorOnClick && getColor(p16) !== '#215534'){
      result.push(p16);
    }
    const p12 = {x: popItem.x + 1, y: popItem.y};    
    if(getColor(p12) === colorOnClick && getColor(p12) !== '#215534'){
      result.push(p12);
    } 
    
    const p13 = {x: popItem.x, y: popItem.y - 1};    
    if(getColor(p13) === colorOnClick && getColor(p13) !== '#215534'){
      result.push(p13);
    }
    
    const p15 = {x: popItem.x - 1, y: popItem.y - 1};    
    if(getColor(p15) === colorOnClick && getColor(p15) !== '#215534'){
      result.push(p15);
    }

    
    
    return result;
  }
  const fillPoint = (popItem, color = '#215534')=>{           
    context.fillStyle = color;  
    context.fillRect(popItem.x, popItem.y, 1, 1);
  }
  const fillSelectedArea = (startPoint, colorOnClick)=>{        
    let stack = [];
    stack.push(startPoint);
    timer = setInterval(() => {
      if(stack.length > 0 ){
        let popItem = stack.pop();
        fillPoint(popItem);   
        let getNearPoint = getFourPoint(popItem, colorOnClick);
        getNearPoint.forEach(e=>{
          if(!checkPoint(stack, e)){
            stack.push(e);
          }
        });
        console.log('count', getNearPoint.length, stack.length);
        //stack.push(...getFourPoint(popItem, colorOnClick));
      }else{
        console.log('stop');
        clearInterval(timer);
      }
      
    },1);
    
  }
  const handelFillImage = (e)=>{
    const rect = boardRef.current.getBoundingClientRect();
    const startPoint = {x : e.clientX - rect.left, y : parseInt( e.clientY - rect.top)};
    colorStart = getColor(startPoint);
    setStartDraw(true) ;
    setStartPoint(startPoint);    
    fillSelectedArea(startPoint, colorStart);
    //fillSelectedArea(startPoint);
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



