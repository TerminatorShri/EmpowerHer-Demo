import React from "react";
import { Provider } from "react-redux"; 
import HomeScreen from "./src/screens/HomeScreen";
import { store } from "./src/store/store"; 

const App: React.FC = () => {
  return (
    <Provider store={store}> 
        <HomeScreen />
    </Provider>
  );
};

export default App;
