const React = {
  createElement: (tag, props, ...children) => {
    if (typeof tag === "function") {
      return tag(props);
    }
    const element = { tag, props: { ...props, children } };
    return element;
  },
};

const render = (reactElement, container) => {
  if (["string", "number"].includes(typeof reactElement)) {
    container.append(String(reactElement));
    return;
  }
  const actualDomElement = window.document.createElement(reactElement.tag);

  if (reactElement.props) {
    Object.keys(reactElement.props)
      .filter((propType) => {
        return propType !== "children";
      })
      .forEach((propType) => {
        actualDomElement[propType] = reactElement.props[propType];
      });
  }

  if (reactElement.props.children) {
    reactElement.props.children.forEach((child) => {
      render(child, actualDomElement);
    });
  }
  container.append(actualDomElement);
};

const globalState = [];

let stateCursor = 0;

const useState = (initialState) => {
  const FROZENCURSOR = stateCursor;
  globalState[FROZENCURSOR] = globalState[FROZENCURSOR] || initialState;
  stateCursor++;
  const setState = (newState) => {
    globalState[FROZENCURSOR] = newState;
    rerender();
  };
  return [globalState[FROZENCURSOR], setState];
};

const App = () => {
  const [name, setName] = useState("person");
  /* Example code to show why hooks should not be used under conditionals 
  //   let randomName = "someRandomName";
  //   let setRandomName = () => {};
  //   if (name === "x") {
  //     [randomName, setRandomName] = useState("");
  //   }
  */
  const [count, setCount] = useState(0);
  return (
    <div className="react-class">
      <h1>Hello, {name}!</h1>
      <input
        type="text"
        placeholder="Enter the name here"
        value={name}
        onchange={(e) => setName(e.target.value)}
      />
      {/* <h2>RandomName is, {randomName}!</h2> */}

      <h2>Count value: {count}</h2>
      <button
        onclick={() => {
          setCount(count - 1);
        }}
      >
        -
      </button>
      <button
        onclick={() => {
          setCount(count + 1);
        }}
      >
        +
      </button>

      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis deleniti
        totam nesciunt eius vero aspernatur temporibus porro neque ad molestias
        maiores ducimus ratione expedita, esse unde illo molestiae aut hic!
      </p>
    </div>
  );
};

const rerender = () => {
  stateCursor = 0;
  document.querySelector("#app").firstChild.remove();
  render(<App />, window.document.querySelector("#app"));
};

render(<App />, window.document.querySelector("#app"));
