

import {TODOItem} from "../models/TODOItem";
import {getTODOs, saveTODOs} from "../services/todo-service";
import {ActionConstants} from "../constants";
import {ArrayCollection} from "ramajs/dist/index";
import {todoStore} from "../stores/index";

var dispatcher = require("../dispatcher");

export function loadTODOs():void
{
    getTODOs().then((todos:any[])=>{
        
        dispatcher.dispatchEvent(ActionConstants.TODOS_LOADED,todos);
    });
}

export function applyTOODsFilter(filter:string):void
{
    dispatcher.dispatchEvent(ActionConstants.TODOS_FILTER_CHANGED,filter);
}

export function addTODO(label:string):void
{
    var todo:TODOItem = new TODOItem(label);
    var todos:ArrayCollection<TODOItem> = todoStore.todos;
    todos.addItem(todo);
    saveTODOItems();

}

export function deleteTODO(item:TODOItem):void
{
    item.deleted = true;
    saveTODOItems();
}

export function editTODOItem(item:TODOItem, value:string):void
{
    item.label = value;
    saveTODOItems();
}

export function toggleTODOItemCompleted(item:TODOItem, completed:boolean):void
{
    item.completed = completed;
    saveTODOItems();
}

export function toggleAllItemCompleted(value:boolean):void
{
    var todos:ArrayCollection<TODOItem> = todoStore.todos;
    
    todos.forEach((todo:TODOItem)=>{
        todo.completed = value;
    },null);

    saveTODOItems()
}

export function clearAllCompleted():void
{
    for (var i=todoStore.todos.length-1; i>=0; i--)
    {
        var todo:TODOItem = todoStore.todos.getItemAt(i);
        if(todo.completed)
        {
            todo.deleted = true;
        }
    }

    saveTODOItems();
}

function saveTODOItems():void
{
    var todos:ArrayCollection<TODOItem> = todoStore.todos;
    saveTODOs(todos.getSource()).then((todos:any[])=>{

        dispatcher.dispatchEvent(ActionConstants.TODOS_SAVED,todos)
    });
}