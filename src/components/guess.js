import GuessElement from "./guessElement";

function Guess(props) {
    return(
        <div className='grid grid-cols-6 gap-2 py-1'>
            {props.guess.map(element => (
                <GuessElement element={element} key={props.index + props.guess.indexOf(element) + "_element"} />
            ))}
        </div>
    );
}

export default Guess;