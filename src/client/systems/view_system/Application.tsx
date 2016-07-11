

import {View, rama} from "ramajs"
import {DOMElement} from "ramajs/dist/core/DOMElement";

import {todoStore} from "../service_system/stores/index";
import {
    loadTODOs, applyTOODsFilter, addTODO, toggleAllItemCompleted,
} from "../service_system/managers/todo-manager";
import {EventConstants} from "../service_system/constants";

import {TODOListComponent} from "./components/todo_list/TODOListComponent"
import {TODOListComponentSkin} from "./components/todo_list/skins/TODOListComponentSkin";


export class Application extends View
{

    toggleAllCheckBox:DOMElement;
    newTODOInput:DOMElement;
    
    constructor() {

        super();
        todoStore.addEventListener(EventConstants.TODOS_CHANGED,this.todosUPDATED);

    }


    initialized():void {

        this.toggleAllCheckBox.addEventListener("change", (event:Event)=>{
            console.log(event)
        });

        this.newTODOInput.addEventListener("keypress",(event:KeyboardEvent)=>{

            var keyCode:number = event.keyCode || event.which;
            if (keyCode == 13){
                // Enter pressed
                var todoText = (this.newTODOInput[0] as HTMLInputElement).value;

                if(todoText)
                {
                    addTODO(todoText);
                    (this.newTODOInput[0] as HTMLInputElement).value = "";
                }
            }

        });

    }

    private todosUPDATED = ()=>{

        if(!todoStore.hasTODOS())
        {
            this.setCurrentState("noTODOs")
        }
        else if(this.getCurrentState() == "noTODOs")
        {
                this.setCurrentState("")
        }

        if(this.toggleAllCheckBox)
            this.toggleAllCheckBox[0].checked = todoStore.itemsLeftToComplete == 0; 
    };
    

    private handleToggleAllCompleted = (event:Event):void=>
    {
        toggleAllItemCompleted((this.toggleAllCheckBox[0] as HTMLInputElement).checked)
    };
    


    render() {
        return <div>
            <states>
                <state name="noTODOs" />
            </states>
            <section class="todoapp">
                <header class="header">
                    <h1>todos</h1>
                    <input id="newTODOInput" class="new-todo" placeholder="What needs to be done?" autofocus/>
                </header>
                
                <TODOListComponent style__noTODOs="display:none" style="" skinClass={TODOListComponentSkin}>
                    <headerContent>
                        <input onchange={this.handleToggleAllCompleted} id="toggleAllCheckBox" class="toggle-all" type="checkbox"/>
                        <label for="toggle-all">Mark all as complete</label>
                    </headerContent>
                </TODOListComponent>
            </section>
            <footer class="info">
                <p>Double-click to edit a todo</p>
                <p>Template by <a href="http://sindresorhus.com">Sindre Sorhus</a></p>
                <p>Created by <a href="http://todomvc.com">you</a></p>
                <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
            </footer>

        </div>;
    }
}