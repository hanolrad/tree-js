import "./App.css"
import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import * as d3 from "d3";

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let index = 0; index < 6; index++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const TreeMap = () => {
  const { numbers } = useParams();
  const [numbersArray, setNumbersArray] = useState(() => numbers.split(',').map(Number).filter(n => ((!isNaN(n)) && (n >= 0) && (n <= 100))));

  const hierarchy = useMemo(() => {
    let rootNode = { name: "root", children: numbersArray.map((value, index) => ({ name: `${value}`, value })) };
    return d3.hierarchy(rootNode).sum((d) => d.value);
  }, [numbersArray]);

  const tree = useMemo(() => {
    const treeGenerator = d3.treemap().size([400, 400])
    return treeGenerator(hierarchy);
  }, [hierarchy]);
  
  // map tree leaves to SVG rectangles
  const allRectangles = tree.leaves().map((leaf) => {
    return (
      <g key={leaf.id} 
      >        
        <rect
          key={`rect-${leaf.id}`}
          x={leaf.x0}
          y={leaf.y0}
          width={leaf.x1 - leaf.x0}
          height={leaf.y1 - leaf.y0}
          stroke="transparent"
          fill={getRandomColor()}
        />
        <text
          key={`text-${leaf.id}`}
          x={leaf.x0 + ((leaf.x1 - leaf.x0) / 2)}
          y={leaf.y0 + ((leaf.y1 - leaf.y0) / 2)}
          fontSize={12}
          textAnchor="center"
          alignmentBaseline="hanging"
          fill="white"
        >
          {leaf.data.value}
        </text>
      </g>)})
  
  // interactive splitting logic
  d3.selectAll("rect").on("click", function (e) {
    const val = parseInt(e.srcElement.nextElementSibling.textContent)
    // console.log("Clicked rect", val)
    const third = Math.floor(val / 3);
      const rest = val - third;
      console.log("Splitting", val, "into", third, "and", rest);
      const newArray = numbersArray.map((n) => {
        if (n === val) {
          return [third, rest];
        } else {
          return n;
        }
      }).flat();
      // console.log("New array", newArray);
      const newParams = newArray.join(',');
      setNumbersArray(newArray);
      window.history.replaceState(null, null, `/${newParams}`)
    });

  return <div>
    {(numbersArray.length > 0) ? <svg style={{ width: '800px', height: '800px' }}>{allRectangles}</svg> : <h3>Oops, wrong numbers, please try again</h3>}
    </div>;
}

export default TreeMap;