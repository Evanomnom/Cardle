import {status} from "../constants"

function GuessElement(props){
    const correct = (props.element.status == status.correct)

    return(
        <div className="flex items-center justify-center text-center">
            <div className={"flex flex-col items-center justify-center w-10 h-10 text-center " + ((props.element.status == status.correct) ? 'bg-green-500' : 'bg-red-500')}>
                {(props.element.status == status.below) && <div className="p-0 leading-[1rem]">▲</div>}
                <div className="p-0 leading-[1rem]">{props.element.value}</div>
                {(props.element.status == status.above) && <div className="p-0 leading-[1rem]">▼</div>}
            </div>
        </div>
    );
}

export default GuessElement;