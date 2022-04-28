import { useState, useEffect } from "react";
import "./App.css";
import Select from "react-select";

// make sure its async or be doomed to deal with .then until the end of time
const getPerson = async (querystring) => {
  // make the call
  var response = await fetch(
    "https://fakerapi.it/api/v1/persons?_quantity=1" + querystring
  );
  // get the json from this
  response = await response.json();
  var { data } = response;
  // return
  return data[0];
};



// define our default ui state
var defaultUiParams = {
  // this is used make sure we dont load the page before everything is done
  // not usually needed but can be helpful
  loadingCompleted: false,
  showPeopleList: true,
};

function App() {
  // this is the state that holds the current setup of inputs on the page
  // first put the default into a state holder (defaultUiParams)
  // uiOptions is where we read the current state
  // setUiOptions is where we update the content of uiOptions
  const [uiOptions, setUiOptions] = useState(defaultUiParams);
  const [people, setPeople] = useState([]);

  useEffect(async () => {
    // Stuff to do when the page is first loaded
    // we get a random new person to test
    var startingPerson = await getPerson();
    // we update the state with this new person (important!)
    setPeople([...people, startingPerson]);
  }, []);

  useEffect(() => {
    // Stuff to do when uiOptions changes
    console.log("the ui state was updated to" ,{uiOptions})
  }, [uiOptions]);

  const DisplayPerson = (person, i) => {
    // this is dispalyed for each person
    var { firstname, lastname, email } = person;
    return (
      <div key={i} className={"control-box"}>
        <div>
          {firstname} {person.lastname}
        </div>
        <div>{email}</div>
      </div>
    );
  };

  const updateData = async (e) => {
    // we use small functions to hold these actions as its cleaner than writing it directly in the onClick argument below
    // we get the new person from our api
    var newPerson = await getPerson();
    // we add it to the state by spreading 'people' into a new array
    setPeople([...people, newPerson]);
  };

  const clearData = async (e) => {
    // we use small functions to hold these actions as its cleaner than writing it directly in the onClick argument below
    //empty the list
    setPeople([]);
  };

  return (
    <div className="App">
      <div className={"control-panel  "}>
        <div className={"horizontal"}>
          <div className={"control-box"}>Page title</div>
        </div>
        <div className={"horizontal"}>
          <div
            className={"highlighted link-hover control-box"}
            onClick={updateData}
          >
            Add a new person
          </div>
          <div
            className={"highlighted link-hover control-box"}
            onClick={clearData}
          >
            Clear list
          </div>
          <div
            className={"highlighted link-hover control-box"}
            // showing here that a function can be put into onclick but dont actually do this lol
            // this function overwrites the ui options with an inverted version of 'showPeopleList'
            // which we use to control the display later
            onClick={(e) =>
              setUiOptions({
                ...uiOptions,
                showPeopleList: !uiOptions.showPeopleList,
              })
            }
          >
            {uiOptions.showPeopleList?'Hide list':'Show list'}
          </div>
        </div>
{uiOptions.showPeopleList?  <div className={"control-box"}>
          <>People</>
          <>{people.map(DisplayPerson)}</>
        </div>:<div className={"control-box"}>List hidden!</div>}
      
      </div>
    </div>
  );
}

export default App;
