
import {status, type} from "../constants"

function GuessElement(props){
    return(
        <div className="flex items-center justify-center text-center">
            <div className={"flex flex-col items-center justify-center w-16 h-16 xl:w-20 xl:h-20 text-center " + ((props.element.status === status.correct) ? 'bg-green-500' : 'bg-red-500')}>
                {(props.element.status === status.below) && <div className="p-0 text-lg leading-[1rem]">▲</div>}
                {(props.element.status === status.above) && <div className="p-0 text-lg leading-[1rem]">▼</div>}
                <div className="p-0 text-4xl xl:text-5xl leading-[2rem]">
                    {(props.element.type === type.set) && <img src={"/sets/" + props.element.value + ".png"} alt={props.element.value}/>}
                    {(props.element.type === type.class) && <img src={"/classes/" + props.element.value + ".png"} alt={props.element.value} /> }
                    {(props.element.type === type.rarity) && <img className="lg:pt-2" src={"/rarity/" + props.element.value + ".png"} alt={props.element.value} />}
                    {((props.element.type === type.cost) || (props.element.type === type.attack) || (props.element.type == type.health)) && 
                    <span>{props.element.value}</span>}
                </div>
            </div>
        </div>
    );
}

export default GuessElement;