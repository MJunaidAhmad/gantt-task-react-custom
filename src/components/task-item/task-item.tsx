import React, { useEffect, useRef, useState } from "react";
import { BarTask } from "../../types/bar-task";
import { GanttContentMoveAction } from "../../types/gantt-task-actions";
import { Bar } from "./bar/bar";
import { BarSmall } from "./bar/bar-small";
import { Milestone } from "./milestone/milestone";
import { Project } from "./project/project";
import style from "./task-list.module.css";

export type TaskItemProps = {
  task: BarTask;
  taskHeight: number;
  isProgressChangeable: boolean;
  isDateChangeable: boolean;
  isDelete: boolean;
  isSelected: boolean;
  arrowIndent:number;
  rtl:boolean;
  setMousePointerBar: React.Dispatch<React.SetStateAction<number>>;
  onEventStart: (
    action: GanttContentMoveAction,
    selectedTask: BarTask,
    event?: React.MouseEvent | React.KeyboardEvent
  ) => any;
};

export const TaskItem: React.FC<TaskItemProps> = props => {
  const {
    task,
    isDelete,
    taskHeight,
    isSelected,
    onEventStart,
    setMousePointerBar
  } = {
    ...props,
  };
  const [position, setPosition] = useState(0);

  const textRef = useRef<SVGTextElement>(null);
  const [taskItem, setTaskItem] = useState<JSX.Element>(<div />);
  // const [isTextInside, setIsTextInside] = useState(true);

  useEffect(() => {
    switch (task.typeInternal) {
      case "milestone":
        setTaskItem(<Milestone {...props} />);
        break;
      case "project":
        setTaskItem(<Project {...props} />);
        break;
      case "smalltask":
        setTaskItem(<BarSmall {...props} />);
        break;
      default:
        setTaskItem(<Bar {...props} />);
        break;
    }
  }, [task, isSelected]);

  useEffect(() => {
    if (textRef.current) {
      // setIsTextInside(textRef.current.getBBox().width < task.x2 - task.x1);
    }
  }, [textRef, task]);

  const getX = () => {
    const width = task.x2 - task.x1;
    
    // return task.x1 + 20 ;
    return width>240?task.x1 + 90 + ((task.name.length - 6)* 1.95):task.x1 + Math.round((width)/8)*4 +10
    
  };

  const handleMouseEnter = (event:any) => {
    const rect = event.currentTarget.getBoundingClientRect(); // Get element boundaries
    const relativeX = event.clientX - rect.left; // Mouse X position relative to the element
    setPosition(relativeX);
    setMousePointerBar(relativeX)
    console.log(`Mouse entered at X: ${relativeX}px`,position);
  };

  return (
    <g
    
      onKeyDown={e => {
        switch (e.key) {
          case "Delete": {
            if (isDelete) onEventStart("delete", task, e);
            break;
          }
        }
        e.stopPropagation();
      }}
      onMouseEnter={e => {
        console.log('mouse entered>>>',e);
        handleMouseEnter(e)
        onEventStart("mouseenter", task, e);
      }}
      onMouseLeave={e => {
        onEventStart("mouseleave", task, e);
      }}
      onDoubleClick={e => {
        onEventStart("dblclick", task, e);
      }}
      onClick={e => {
        onEventStart("click", task, e);
      }}
      onFocus={() => {
        onEventStart("select", task);
      }}
    >
      {taskItem}
      

      <text
        x={getX()}
        y={task.y + taskHeight * 0.5}
        className={
         style.barLabel
           
        }
        ref={textRef}
      >
        {task.x2 - task.x1 >240 ?task.name: task.x2 - task.x1 <40 ? '': task?.name?.slice(0, Math.round((task.x2 - task.x1)/8)-3)+'...'}
      </text>
      <svg
   x={task.x1+6} 
  y={task.y + taskHeight * 0.5 - 10.5}
  width="22"
  height="22"
  viewBox="0 0 36 36"
  style={{ fill: 'none'}}
>
{task.indicatorImageSvg}
 
</svg>
    </g>
  );
};
