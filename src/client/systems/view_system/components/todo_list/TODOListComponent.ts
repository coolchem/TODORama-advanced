

import {Component, skinPart, UIElement, Group} from "ramajs/dist/index";
import {DOMElement} from "ramajs/dist/core/DOMElement";
import {TODODataGroup} from "../datagroup/TODODataGroup";
import {todoStore} from "../../../service_system/stores/index";
import {TODOItemEventInit} from "../../events/TODOItemEvent";
import {
    editTODOItem, clearAllCompleted, deleteTODO,
    toggleTODOItemCompleted, loadTODOs, applyTOODsFilter
} from "../../../service_system/managers/todo-manager";
import {TODOItem} from "../../../service_system/models/TODOItem";
import {EventConstants} from "../../../service_system/constants";


export class TODOListComponent extends Component
{
    @skinPart(false)
    todoCount:DOMElement;

    @skinPart(false)
    clearCompletedBtn:DOMElement;

    @skinPart(true)
    todoDataGroup:TODODataGroup;

    @skinPart(false)
    headerContentGroup:Group;
    

    private _headerContent:UIElement[];

    setHeaderContent(content:UIElement[]):void
    {
        this._headerContent = content;

        if(this.headerContentGroup)
        {
            this.headerContentGroup.setChildren(this._headerContent);
        }
    }


    constructor() {
        super();

        if(window.location.hash === "" || window.location.hash === null || window.location.hash === undefined)
        {
            window.location.hash = "#/"
        }

        window.onhashchange = ()=>{
            this.handleHashChange()
        };

        loadTODOs();

        todoStore.addEventListener(EventConstants.TODOS_LOADED,this.todosUPDATED);
        todoStore.addEventListener(EventConstants.TODOS_CHANGED,this.todosUPDATED);
    }

    protected partAdded(id:string, instance:any):void {
        super.partAdded(id, instance);
        
        if(instance == this.headerContentGroup)
        {
            this.headerContentGroup.setChildren(this._headerContent);
        }
        
        if(instance == this.todoDataGroup)
        {
            this.todoDataGroup.setDataProvider(todoStore.todos);
            
            this.todoDataGroup.addEventListener(TODOItemEventInit.TODO_ITEM_EDITED, this.todoItemEdited);
            this.todoDataGroup.addEventListener(TODOItemEventInit.TODO_ITEM_DELETED, this.todoItemDeleted);
            this.todoDataGroup.addEventListener(TODOItemEventInit.TODO_ITEM_TOGGLE_COMPLETED, this.todoItemToggleCompleted);
        }
        
        if(instance == this.clearCompletedBtn)
        {
            this.clearCompletedBtn.addEventListener("click", this.handleClearCompleted)

        }
        
        if(instance == this.todoCount)
        {
            this.todoCount[0].innerHTML = todoStore.itemsLeftToComplete;
        }
    }

    private todosUPDATED = ()=>{

        this.handleHashChange();

        if(this.todoCount)
            this.todoCount[0].innerHTML = todoStore.itemsLeftToComplete;

        if(todoStore.hasCompletedItems())
            this.clearCompletedBtn[0].style.display = '';
        else
            this.clearCompletedBtn[0].style.display = 'none';

    };

    private handleHashChange():void
    {
        var state:string = "";
        switch(window.location.hash)
        {

            case "#/" :
            {
                state =  "all";
                break;
            }

            case "#/active" :
            {
                state =  "active";
                break;
            }

            case "#/completed" :
            {
                state =  "completed";
                break;
            }

        }

        this.setCurrentState(state); //changing the state to any of the
        applyTOODsFilter(state);
    }

    private todoItemEdited = (event:CustomEvent)=>{
        var eventDetail:{item:TODOItem, value?:any} = event.detail;
        editTODOItem(eventDetail.item,eventDetail.value);
    };

    private handleClearCompleted = (event:Event):void =>{

        clearAllCompleted();
    };

    private todoItemDeleted = (event:CustomEvent)=>{

        var eventDetail:{item:TODOItem, value?:any} = event.detail;
        deleteTODO(eventDetail.item);

    };


    private todoItemToggleCompleted = (event:CustomEvent)=>{
        var eventDetail:{item:TODOItem, value?:any} = event.detail;
        toggleTODOItemCompleted(eventDetail.item,eventDetail.value);
    };

}