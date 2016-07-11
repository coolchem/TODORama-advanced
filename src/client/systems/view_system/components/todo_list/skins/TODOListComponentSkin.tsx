

import {Skin,Group,rama} from "ramajs/dist/index";
import {TODODataGroup} from "../../datagroup/TODODataGroup";
import {TODOItemRenderer} from "../../datagroup/TODOItemRenderer";

export class TODOListComponentSkin extends Skin
{


    render():any {
        return <div>

            <states>
                <state name="all" />
                <state name="active"/>
                <state name="completed"/>
            </states>

            
            
                <section class="main" >
                    
                    <Group id="headerContentGroup"/>
                    
                    <TODODataGroup id="todoDataGroup"
                                   class="todo-list"
                                   itemRenderer={TODOItemRenderer}/>
                </section>
                <footer class="footer">
                    <span class="todo-count"><strong id="todoCount"/> item left</span>
                    <ul class="filters">
                        <li>
                            <a class__all="selected" href="#/">All</a>
                        </li>
                        <li>
                            <a  class__active="selected" href="#/active">Active</a>
                        </li>
                        <li>
                            <a  class__completed="selected" href="#/completed">Completed</a>
                        </li>
                    </ul>
                    <button id="clearCompletedBtn" class="clear-completed">Clear completed</button>
                </footer>
            </div>;
    }
}